/**
 * Emergency Detection System
 * Analyzes user messages for critical symptoms and emergency keywords
 */

export interface EmergencyAnalysis {
  isEmergency: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedKeywords: string[];
  confidence: number;
  recommendedAction: string;
}

// Critical emergency keywords that require immediate medical attention
const CRITICAL_KEYWORDS = [
  // Cardiac/Chest
  'chest pain', 'heart attack', 'cardiac arrest', 'severe chest pain',
  'crushing chest pain', 'chest tightness', 'heart racing', 'palpitations',
  
  // Breathing
  'can\'t breathe', 'difficulty breathing', 'shortness of breath', 'gasping',
  'choking', 'suffocating', 'respiratory distress', 'wheezing severely',
  
  // Neurological
  'stroke', 'paralysis', 'can\'t move', 'slurred speech', 'confusion',
  'severe headache', 'sudden weakness', 'facial drooping', 'seizure',
  'unconscious', 'fainting', 'loss of consciousness',
  
  // Bleeding/Trauma
  'severe bleeding', 'heavy bleeding', 'blood loss', 'hemorrhage',
  'deep cut', 'severe injury', 'broken bone', 'head injury',
  
  // Poisoning/Overdose
  'poisoning', 'overdose', 'toxic', 'swallowed poison', 'drug overdose',
  
  // Severe Pain
  'excruciating pain', 'unbearable pain', 'severe abdominal pain',
  'intense pain', 'agonizing pain',
  
  // Other Critical
  'allergic reaction', 'anaphylaxis', 'severe allergic', 'swelling throat',
  'severe burn', 'electric shock', 'drowning', 'hypothermia',
  'heat stroke', 'severe dehydration'
];

// High priority keywords that need urgent attention
const HIGH_PRIORITY_KEYWORDS = [
  'severe pain', 'high fever', 'persistent vomiting', 'severe diarrhea',
  'difficulty swallowing', 'severe cough', 'blood in urine', 'blood in stool',
  'severe dizziness', 'severe nausea', 'severe headache', 'blurred vision',
  'severe fatigue', 'severe weakness', 'severe abdominal pain',
  'persistent fever', 'high temperature', 'severe cold', 'severe flu'
];

// Medium priority keywords
const MEDIUM_PRIORITY_KEYWORDS = [
  'pain', 'fever', 'headache', 'nausea', 'vomiting', 'diarrhea',
  'cough', 'cold', 'flu', 'tired', 'weak', 'dizzy', 'sore throat',
  'runny nose', 'congestion', 'ache', 'discomfort', 'unwell'
];

// Emergency phrases in multiple languages
const EMERGENCY_PHRASES = {
  english: [
    'help me', 'emergency', 'urgent', 'critical', 'dying', 'can\'t breathe',
    'severe pain', 'call ambulance', 'hospital now', 'immediate help'
  ],
  hindi: [
    'मदद करो', 'आपातकाल', 'तुरंत', 'गंभीर', 'सांस नहीं आ रही', 'तेज दर्द',
    'एम्बुलेंस बुलाओ', 'अस्पताल', 'तुरंत मदद'
  ],
  odia: [
    'ସାହାଯ୍ୟ କର', 'ଜରୁରୀ', 'ତୁରନ୍ତ', 'ଗମ୍ଭୀର', 'ନିଶ୍ୱାସ ନେଇ ପାରୁନି',
    'ତୀବ୍ର ଯନ୍ତ୍ରଣା', 'ଆମ୍ବୁଲାନ୍ସ', 'ହସ୍ପିଟାଲ'
  ]
};

/**
 * Analyzes a message for emergency keywords and severity
 */
export function analyzeEmergency(message: string): EmergencyAnalysis {
  const lowerMessage = message.toLowerCase();
  const detectedKeywords: string[] = [];
  let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let confidence = 0;

  // Check for critical keywords
  for (const keyword of CRITICAL_KEYWORDS) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      detectedKeywords.push(keyword);
      maxSeverity = 'critical';
      confidence += 0.9;
    }
  }

  // Check for high priority keywords
  if (maxSeverity !== 'critical') {
    for (const keyword of HIGH_PRIORITY_KEYWORDS) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword);
        maxSeverity = 'high';
        confidence += 0.7;
      }
    }
  }

  // Check for medium priority keywords
  if (maxSeverity === 'low') {
    for (const keyword of MEDIUM_PRIORITY_KEYWORDS) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword);
        maxSeverity = 'medium';
        confidence += 0.4;
      }
    }
  }

  // Check for emergency phrases in multiple languages
  const allEmergencyPhrases = [
    ...EMERGENCY_PHRASES.english,
    ...EMERGENCY_PHRASES.hindi,
    ...EMERGENCY_PHRASES.odia
  ];

  for (const phrase of allEmergencyPhrases) {
    if (lowerMessage.includes(phrase.toLowerCase())) {
      detectedKeywords.push(phrase);
      maxSeverity = 'critical';
      confidence += 0.95;
    }
  }

  // Normalize confidence score
  confidence = Math.min(confidence, 1.0);

  // Determine if it's an emergency
  const isEmergency = maxSeverity === 'critical' || maxSeverity === 'high';

  // Generate recommended action
  let recommendedAction = '';
  switch (maxSeverity) {
    case 'critical':
      recommendedAction = 'IMMEDIATE EMERGENCY: Call 112 or visit emergency room NOW';
      break;
    case 'high':
      recommendedAction = 'URGENT: Seek medical attention within 2-4 hours';
      break;
    case 'medium':
      recommendedAction = 'Consult healthcare provider within 24-48 hours';
      break;
    default:
      recommendedAction = 'Monitor symptoms and consult doctor if they persist';
  }

  return {
    isEmergency,
    severity: maxSeverity,
    detectedKeywords: [...new Set(detectedKeywords)], // Remove duplicates
    confidence,
    recommendedAction
  };
}

/**
 * Checks if a message contains multiple emergency indicators
 */
export function hasMultipleEmergencyIndicators(message: string): boolean {
  const analysis = analyzeEmergency(message);
  return analysis.detectedKeywords.length >= 2 && analysis.confidence > 0.8;
}

/**
 * Gets emergency severity level from analysis results
 */
export function getEmergencySeverity(analysisResults: any[]): 'low' | 'medium' | 'high' | 'critical' {
  if (!analysisResults || analysisResults.length === 0) return 'low';
  
  const severities = analysisResults.map(result => result.severity || 'Mild');
  
  if (severities.includes('Severe')) return 'critical';
  if (severities.includes('Moderate')) return 'high';
  return 'medium';
}

/**
 * Formats emergency message for display
 */
export function formatEmergencyMessage(analysis: EmergencyAnalysis): string {
  if (!analysis.isEmergency) return '';
  
  const urgencyLevel = analysis.severity === 'critical' ? '🚨 CRITICAL EMERGENCY' : '⚠️ URGENT MEDICAL ATTENTION NEEDED';
  
  return `${urgencyLevel}

Based on your symptoms, you may need immediate medical care.

🏥 ${analysis.recommendedAction}

📞 Emergency Helplines:
• 112 - All Emergency Services
• 108 - Medical Emergency/Ambulance
• 104 - National Health Helpline

⚠️ If symptoms worsen, call 112 immediately.`;
}