import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { detectIntent, generateNonMedicalResponse } from '@/lib/intent-detection';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// In-memory conversation storage (in production, use Redis or database)
const conversationHistory = new Map<string, Array<{role: 'user' | 'assistant', content: string, timestamp: number}>>();

// Clean up old conversations (older than 1 hour)
const cleanupOldConversations = () => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [sessionId, messages] of conversationHistory.entries()) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.timestamp < oneHourAgo) {
      conversationHistory.delete(sessionId);
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userDetails } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Clean up old conversations periodically
    if (Math.random() < 0.1) { // 10% chance to clean up
      cleanupOldConversations();
    }

    // Get or create conversation history
    const currentSessionId = sessionId || `session_${Date.now()}`;
    if (!conversationHistory.has(currentSessionId)) {
      conversationHistory.set(currentSessionId, []);
    }
    const history = conversationHistory.get(currentSessionId)!;

    // Add user message to history
    history.push({
      role: 'user',
      content: message,
      timestamp: Date.now()
    });

    // Detect intent before processing
    const intentAnalysis = detectIntent(message);
    
    // Handle non-medical queries with short, appropriate responses
    if (!intentAnalysis.isMedical && intentAnalysis.confidence > 0.7) {
      const nonMedicalResponse = generateNonMedicalResponse(intentAnalysis, message);
      
      // Add bot response to history
      history.push({
        role: 'assistant',
        content: nonMedicalResponse,
        timestamp: Date.now()
      });

      return NextResponse.json({
        success: true,
        response: nonMedicalResponse,
        sessionId: currentSessionId,
        intentDetected: intentAnalysis.category,
        confidence: intentAnalysis.confidence
      });
    }

    // Check if API key is properly configured (not a placeholder)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('placeholder') || apiKey.includes('your-') || apiKey.includes('replace-with')) {
      console.log('🔧 Gemini API key not configured - using development fallback');
      
      // Import emergency detection for development mode
      const { analyzeEmergency, formatEmergencyMessage } = await import('@/lib/emergency-detection');
      
      // Check for emergency in development mode
      const emergencyAnalysis = analyzeEmergency(message);
      if (emergencyAnalysis.isEmergency) {
        const emergencyResponse = `🚨 **EMERGENCY ALERT** 🚨
• Call 112 immediately for emergency services
• This requires urgent medical attention  
• Don't delay - seek help NOW

**🔍 Assessment:**
• ${emergencyAnalysis.severity} emergency detected

**💊 Immediate Action:**
• Call emergency services: 112
• Stay calm and follow dispatcher instructions

**⚠️ Important:**
• This is a medical emergency - get help immediately`;

        // Add bot response to history
        history.push({
          role: 'assistant',
          content: emergencyResponse,
          timestamp: Date.now()
        });

        return NextResponse.json({
          success: true,
          response: emergencyResponse,
          sessionId: currentSessionId,
          developmentMode: true,
          isEmergency: true,
        });
      }

      // Enhanced AI-powered medical responses (removed hardcoded responses)
    }

    console.log('🚀 Sending request to Gemini AI');
    console.log('📤 Request payload:', { message, sessionId, userDetails });

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

    // Create a concise, friendly medical assistant prompt with multilingual support
    const systemPrompt = `CRITICAL INSTRUCTION: You MUST respond in the EXACT SAME LANGUAGE as the user's message.

LANGUAGE DETECTION RULES:
1. If the user writes in English → Respond ONLY in English
2. If the user writes in Hindi (हिंदी) → Respond ONLY in Hindi (हिंदी)
3. If the user writes in Odia (ଓଡ଼ିଆ) → Respond ONLY in Odia (ଓଡ଼ିଆ)
4. NEVER mix languages in your response
5. Detect the language from the user's message and match it exactly

You are Dr. Airogya, a friendly AI medical assistant. Keep every response concise (2-4 sentences max).

RESPONSE GUIDELINES:
- Be warm, calm, and empathetic
- Use simple, conversational language
- For simple questions, reply simply and directly
- Do NOT give long medical assessments unless explicitly requested
- For serious symptoms, briefly recommend seeing a doctor
- Always sound human and caring

EMERGENCY SITUATIONS:
For life-threatening symptoms, respond briefly in the user's language:
- English: "This sounds serious and needs immediate medical attention. Please call 112 or go to the nearest emergency room right away."
- Hindi: "यह गंभीर लगता है और तुरंत चिकित्सा सहायता की आवश्यकता है। कृपया 112 पर कॉल करें या तुरंत निकटतम आपातकालीन कक्ष में जाएं।"
- Odia: "ଏହା ଗମ୍ଭୀର ଲାଗୁଛି ଏବଂ ତୁରନ୍ତ ଚିକିତ୍ସା ସହାୟତା ଆବଶ୍ୟକ। ଦୟାକରି 112 କୁ କଲ କରନ୍ତୁ କିମ୍ବା ତୁରନ୍ତ ନିକଟସ୍ଥ ଜରୁରୀକାଳୀନ କକ୍ଷକୁ ଯାଆନ୍ତୁ।"

LANGUAGE EXAMPLES:
- English: "I understand your concern. This could be..."
- Hindi: "मैं आपकी चिंता समझता हूं। यह हो सकता है..."
- Odia: "ମୁଁ ଆପଣଙ୍କ ଚିନ୍ତାକୁ ବୁଝୁଛି। ଏହା ହୋଇପାରେ..."

${userDetails ? `User: Age ${userDetails.age}, Gender ${userDetails.gender}` : ''}

User Message: ${message}`;

    // Enhanced conversation context with user details for personalized responses
    const conversationContext = history.length > 0 
      ? `\n\nCONVERSATION HISTORY:\n${history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join('\n')}`
      : '';

    const userContext = userDetails 
      ? `\n\nPATIENT INFORMATION:\n- Age: ${userDetails.age}\n- Gender: ${userDetails.gender}\n- Location: ${userDetails.location}\n- Medical History: ${userDetails.medicalHistory || 'Not provided'}`
      : '';

    const fullPrompt = `${systemPrompt}

USER MESSAGE: "${message}"${userContext}${conversationContext}

Please provide a professional medical assessment following the enhanced response structure above. Consider the patient's demographics and any conversation history for personalized guidance.`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Add bot response to history
    history.push({
      role: 'assistant',
      content: text,
      timestamp: Date.now()
    });

    console.log('✅ Gemini Response received');

    return NextResponse.json({
      success: true,
      response: text,
      sessionId: sessionId || `gemini_session_${Date.now()}`,
    });

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    
    let errorMessage = 'Failed to process chat request';
    let userFriendlyMessage = 'I apologize, but I\'m having trouble connecting to my AI service right now. Please try again in a few moments.';
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid Gemini API key. Please check your configuration.';
        userFriendlyMessage = 'There\'s a configuration issue with the AI service. Please contact support.';
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        errorMessage = 'API quota exceeded. Please try again later.';
        userFriendlyMessage = 'The AI service has reached its usage limit. Please try again later.';
      } else if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
        errorMessage = 'Gemini AI service is temporarily unavailable (503 error)';
        userFriendlyMessage = 'The AI service is temporarily overloaded. Please wait a moment and try again.';
      } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        errorMessage = 'Rate limit exceeded';
        userFriendlyMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.message.includes('ECONNREFUSED') || error.message.includes('network')) {
        errorMessage = 'Network connection error';
        userFriendlyMessage = 'Unable to connect to the AI service. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message;
      }
    }

    // Return a user-friendly error response that the frontend can handle gracefully
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        response: userFriendlyMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        retryable: true // Indicate that this error can be retried
      },
      { status: 503 } // Use 503 for service unavailable to indicate temporary issue
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Gemini Chat API is running',
    endpoint: 'POST /api/gemini-chat',
    requiredFields: ['message'],
    optionalFields: ['sessionId', 'userDetails']
  });
}