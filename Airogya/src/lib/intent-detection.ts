// Intent detection utility for Airogya chatbot
export interface IntentAnalysis {
  isMedical: boolean;
  confidence: number;
  category: 'medical' | 'general' | 'greeting' | 'personal' | 'technical';
  suggestedResponse?: string;
}

// Medical keywords and patterns
const MEDICAL_KEYWORDS = [
  // Symptoms
  'pain', 'ache', 'hurt', 'fever', 'headache', 'nausea', 'vomit', 'dizzy', 'tired', 'fatigue',
  'cough', 'cold', 'flu', 'sore throat', 'runny nose', 'congestion', 'sneeze',
  'rash', 'itch', 'swelling', 'bruise', 'cut', 'wound', 'bleeding', 'burn',
  'chest pain', 'shortness of breath', 'difficulty breathing', 'palpitations',
  'stomach ache', 'abdominal pain', 'diarrhea', 'constipation', 'heartburn',
  'back pain', 'joint pain', 'muscle pain', 'cramp', 'sprain',
  'anxiety', 'depression', 'stress', 'insomnia', 'sleep problems',
  
  // Medical terms
  'symptom', 'diagnosis', 'treatment', 'medicine', 'medication', 'prescription',
  'doctor', 'hospital', 'clinic', 'emergency', 'urgent care',
  'blood pressure', 'diabetes', 'cholesterol', 'heart disease', 'cancer',
  'infection', 'virus', 'bacteria', 'allergy', 'asthma',
  'pregnancy', 'menstruation', 'period', 'contraception',
  
  // Body parts
  'head', 'neck', 'shoulder', 'arm', 'hand', 'finger', 'chest', 'back',
  'stomach', 'abdomen', 'leg', 'knee', 'foot', 'toe', 'eye', 'ear', 'nose', 'mouth', 'throat',
  
  // Medical questions
  'should i see a doctor', 'is this normal', 'what could this be', 'how to treat',
  'when to worry', 'is this serious', 'medical advice', 'health concern'
];

// Non-medical patterns
const NON_MEDICAL_PATTERNS = [
  // Greetings
  /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
  
  // Personal questions
  /what.*your.*name/i,
  /who.*are.*you/i,
  /what.*my.*name/i,
  /remember.*me/i,
  
  // General questions
  /what.*time/i,
  /what.*weather/i,
  /how.*are.*you/i,
  /thank.*you/i,
  /thanks/i,
  /bye/i,
  /goodbye/i,
  
  // Technical questions
  /how.*app.*work/i,
  /how.*use/i,
  /help.*navigate/i,
  /features/i,
];

// Greeting responses
const GREETING_RESPONSES = [
  "Hello! I'm Dr. Airogya, your AI health assistant. How can I help you today?",
  "Hi there! I'm here to help with any health questions or concerns you might have.",
  "Good to see you! What can I assist you with regarding your health today?"
];

// Personal question responses
const PERSONAL_RESPONSES = {
  name: "I'm Dr. Airogya, your AI medical assistant. I don't have access to your personal information unless you share it with me during our conversation. How can I help you with your health today?",
  identity: "I'm Dr. Airogya, an AI-powered medical assistant designed to provide helpful health guidance. I'm here to support you with medical questions and health concerns.",
  memory: "I can only remember our current conversation. For your privacy and security, I don't store personal information between sessions. If you'd like personalized advice, please share relevant details during our chat."
};

export function detectIntent(message: string): IntentAnalysis {
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for greetings
  if (NON_MEDICAL_PATTERNS.some(pattern => pattern.test(lowerMessage))) {
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(lowerMessage)) {
      return {
        isMedical: false,
        confidence: 0.9,
        category: 'greeting',
        suggestedResponse: GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)]
      };
    }
    
    // Personal questions
    if (/what.*your.*name|who.*are.*you/.test(lowerMessage)) {
      return {
        isMedical: false,
        confidence: 0.9,
        category: 'personal',
        suggestedResponse: PERSONAL_RESPONSES.identity
      };
    }
    
    if (/what.*my.*name|remember.*me/.test(lowerMessage)) {
      return {
        isMedical: false,
        confidence: 0.9,
        category: 'personal',
        suggestedResponse: PERSONAL_RESPONSES.memory
      };
    }
    
    // General non-medical
    return {
      isMedical: false,
      confidence: 0.8,
      category: 'general'
    };
  }
  
  // Check for medical keywords
  const medicalKeywordCount = MEDICAL_KEYWORDS.filter(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  ).length;
  
  // Calculate medical confidence based on keyword density
  const wordCount = lowerMessage.split(' ').length;
  const medicalDensity = medicalKeywordCount / wordCount;
  
  // High confidence medical if multiple medical keywords or high density
  if (medicalKeywordCount >= 2 || medicalDensity > 0.3) {
    return {
      isMedical: true,
      confidence: Math.min(0.9, 0.5 + medicalDensity),
      category: 'medical'
    };
  }
  
  // Medium confidence medical if one medical keyword
  if (medicalKeywordCount === 1) {
    return {
      isMedical: true,
      confidence: 0.6,
      category: 'medical'
    };
  }
  
  // Check for medical question patterns
  const medicalQuestionPatterns = [
    /should.*see.*doctor/i,
    /is.*this.*normal/i,
    /what.*could.*this.*be/i,
    /how.*to.*treat/i,
    /when.*to.*worry/i,
    /is.*this.*serious/i,
    /medical.*advice/i,
    /health.*concern/i
  ];
  
  if (medicalQuestionPatterns.some(pattern => pattern.test(message))) {
    return {
      isMedical: true,
      confidence: 0.8,
      category: 'medical'
    };
  }
  
  // Default to general if no clear medical intent
  return {
    isMedical: false,
    confidence: 0.5,
    category: 'general'
  };
}

// Generate appropriate response based on intent
export function generateNonMedicalResponse(intent: IntentAnalysis, message: string): string {
  if (intent.suggestedResponse) {
    return intent.suggestedResponse;
  }
  
  switch (intent.category) {
    case 'greeting':
      return GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
      
    case 'personal':
      if (message.toLowerCase().includes('name')) {
        return PERSONAL_RESPONSES.name;
      }
      return PERSONAL_RESPONSES.identity;
      
    case 'general':
      return "I'm Dr. Airogya, your AI health assistant. I'm specifically designed to help with medical questions and health concerns. If you have any health-related questions, I'd be happy to help! Otherwise, you might want to try a general-purpose assistant for non-medical queries.";
      
    case 'technical':
      return "I'm focused on providing medical assistance. For technical questions about the app, you might want to check the help section or contact support. Is there anything health-related I can help you with?";
      
    default:
      return "I'm here to help with health and medical questions. What can I assist you with regarding your health today?";
  }
}