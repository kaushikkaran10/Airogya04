import { NextRequest, NextResponse } from 'next/server';

// Enhanced debugging for n8n webhook integration
export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Your n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    // Check if webhook URL is properly configured (not a placeholder)
    if (!n8nWebhookUrl || n8nWebhookUrl.includes('your-') || n8nWebhookUrl.includes('placeholder') || n8nWebhookUrl.includes('replace-with')) {
      console.log('🔧 N8N webhook URL not configured - using development fallback');
      
      // Provide a helpful development response without setup instructions
       const developmentResponse = `Hello! I'm your AI health assistant.

• I received your message: "${message}"
• I'm here to help with your health-related questions

**Health Support:**
• I can provide general health guidance and information
• For specific symptoms, I recommend monitoring your condition
• Always consult healthcare professionals for medical advice
• Emergency services should be contacted for urgent situations

**How I can assist:**
• Answer general health questions
• Provide wellness tips and recommendations
• Help you understand when to seek medical care
• Offer support for health-related concerns

*This is general health information - please consult a healthcare professional for personalized medical advice.*`;

      return NextResponse.json({
        success: true,
        response: developmentResponse,
        sessionId: sessionId || `n8n_dev_session_${Date.now()}`,
        developmentMode: true,
      });
    }

    console.log('🚀 Sending request to n8n webhook:', n8nWebhookUrl);
    console.log('📤 Request payload:', { message, sessionId });

    // Send request to n8n webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId: sessionId || `session_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log('📥 N8N Response Status:', response.status);
    console.log('📥 N8N Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ N8N Error Response:', errorText);
      throw new Error(`N8N webhook responded with status: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('📥 N8N Raw Response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ N8N Parsed Response:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse N8N response as JSON:', parseError);
      throw new Error(`N8N returned invalid JSON: ${responseText}`);
    }

    return NextResponse.json({
      success: true,
      response: data.response || data.message || data.output || 'Response received from AI',
      sessionId: data.sessionId || sessionId,
    });

  } catch (error) {
    console.error('❌ Error calling n8n webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json({
    message: 'N8N Chat API is running',
    endpoint: 'POST /api/n8n-chat',
    requiredFields: ['message'],
    optionalFields: ['sessionId']
  });
}