'use server';

/**
 * @fileOverview Provides simplified explanations of medical conditions.
 *
 * - provideSimplifiedConditionInformation - A function that handles the process of providing simplified condition information.
 * - ProvideSimplifiedConditionInformationInput - The input type for the provideSimplifiedConditionInformation function.
 * - ProvideSimplifiedConditionInformationOutput - The return type for the provideSimplifiedConditionInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideSimplifiedConditionInformationInputSchema = z.object({
  conditionName: z.string().describe('The name of the medical condition to explain.'),
  language: z.string().describe('The language to provide the explanation in.'),
});
export type ProvideSimplifiedConditionInformationInput = z.infer<typeof ProvideSimplifiedConditionInformationInputSchema>;

const ProvideSimplifiedConditionInformationOutputSchema = z.object({
  simplifiedExplanation: z.string().describe('A simplified explanation of the medical condition, including causes, prevention tips, and guidance on when to see a doctor.'),
});
export type ProvideSimplifiedConditionInformationOutput = z.infer<typeof ProvideSimplifiedConditionInformationOutputSchema>;

export async function provideSimplifiedConditionInformation(
  input: ProvideSimplifiedConditionInformationInput
): Promise<ProvideSimplifiedConditionInformationOutput> {
  return provideSimplifiedConditionInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideSimplifiedConditionInformationPrompt',
  input: {schema: ProvideSimplifiedConditionInformationInputSchema},
  output: {schema: ProvideSimplifiedConditionInformationOutputSchema},
  prompt: `You are a medical expert who can provide simplified explanations of medical conditions.

  Provide a simplified explanation of the following medical condition, including its causes, prevention tips, and guidance on when to see a doctor. The explanation should be easy to understand for non-medical users.

  Condition Name: {{{conditionName}}}
  Language: {{{language}}}`,
});

const provideSimplifiedConditionInformationFlow = ai.defineFlow(
  {
    name: 'provideSimplifiedConditionInformationFlow',
    inputSchema: ProvideSimplifiedConditionInformationInputSchema,
    outputSchema: ProvideSimplifiedConditionInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
