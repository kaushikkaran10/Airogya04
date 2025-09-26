
"use server";

import {
  analyzeSymptomsAndSuggestConditions,
  type AnalyzeSymptomsInput,
  type AnalyzeSymptomsOutput,
} from "@/ai/flows/analyze-symptoms-and-suggest-conditions";
import {
  provideSimplifiedConditionInformation,
  type ProvideSimplifiedConditionInformationOutput,
} from "@/ai/flows/provide-simplified-condition-information";
import type { FindNearbyHospitalsOutput } from "@/ai/flows/find-nearby-hospitals";
import { hospitalData } from "@/lib/hospital-data";

export async function analyzeSymptoms(
  input: AnalyzeSymptomsInput
): Promise<AnalyzeSymptomsOutput> {
  return await analyzeSymptomsAndSuggestConditions(input);
}

export async function getConditionInfo(
  conditionName: string,
  language: string
): Promise<ProvideSimplifiedConditionInformationOutput> {
  return await provideSimplifiedConditionInformation({ conditionName, language });
}

export async function searchHospitals(
  pincode: string
): Promise<FindNearbyHospitalsOutput> {
  // Directly return data from the static source instead of calling the AI flow.
  return hospitalData[pincode] || { hospitals: [] };
}

export interface ChatWithN8nInput {
  message: string;
  sessionId?: string;
}

export interface ChatWithN8nOutput {
  success: boolean;
  response: string;
  sessionId: string;
  error?: string;
}

export async function chatWithN8n(
  input: ChatWithN8nInput
): Promise<ChatWithN8nOutput> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/n8n-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to communicate with AI');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in chatWithN8n:', error);
    return {
      success: false,
      response: 'Sorry, I encountered an error while processing your request.',
      sessionId: input.sessionId || `session_${Date.now()}`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export interface ChatWithGeminiInput {
  message: string;
  sessionId?: string;
  userDetails?: {
    age: number;
    gender: string;
  };
}

export interface ChatWithGeminiOutput {
  success: boolean;
  response: string;
  sessionId: string;
  error?: string;
}

export async function chatWithGemini(
  input: ChatWithGeminiInput
): Promise<ChatWithGeminiOutput> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/gemini-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to communicate with Gemini AI');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in chatWithGemini:', error);
    return {
      success: false,
      response: 'Sorry, I encountered an error while processing your request with Gemini AI.',
      sessionId: input.sessionId || `gemini_session_${Date.now()}`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
