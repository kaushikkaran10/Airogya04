
'use server';

/**
 * @fileOverview Analyzes user-input symptoms and suggests possible conditions, severity level, and recommended next steps.
 * 
 * - analyzeSymptomsAndSuggestConditions - A function that handles the symptom analysis process.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptomsAndSuggestConditions function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptomsAndSuggestConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms entered by the user (text or voice).'),
  age: z.number().describe('The age of the user.'),
  gender: z.enum(['Male', 'Female', 'Other']).describe('The gender of the user.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "or").'),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  conditions: z.array(
    z.object({
      condition: z.string().describe('Possible condition.'),
      severity:
        z.enum(['Mild', 'Moderate', 'Severe'])
          .describe('Severity level of the condition.'),
      nextSteps: z.string().describe('Suggested next steps.'),
    })
  ).describe('List of possible conditions, severity levels, and next steps.'),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptomsAndSuggestConditions(
  input: AnalyzeSymptomsInput
): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are an AI medical assistant. Your role is to analyze symptoms provided by a user and suggest possible conditions, their severity, and next steps.

You MUST tailor your response based on the user's age.
- For children (age 12 and under), use simple, reassuring, and easy-to-understand language.
- For teenagers (age 13-17), use clear and direct language, avoiding overly technical terms.
- For adults (age 18 and over), you can be more detailed and use standard medical terminology where appropriate.

You MUST respond in the specified language.

User Details:
Age: {{{age}}}
Gender: {{{gender}}}
Language: {{{language}}}

Symptoms: {{{symptoms}}}

Return a JSON array of conditions. Each condition should have a severity (Mild, Moderate, or Severe) and nextSteps describing what the user should do. The language of the nextSteps must be tailored to the user's age and be in the specified language. The JSON should match this schema:
${JSON.stringify(AnalyzeSymptomsOutputSchema.shape, null, 2)}`,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
