'use server';
/**
 * @fileOverview A content translation AI agent.
 *
 * - translateContentToMultipleLanguages - A function that translates content to multiple languages.
 * - TranslateContentInput - The input type for the translateContentToMultipleLanguages function.
 * - TranslateContentOutput - The return type for the translateContentToMultipleLanguages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateContentInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguages: z
    .array(z.enum(['en', 'hi', 'or']))
    .describe('The list of target languages to translate to. en = English, hi = Hindi, or = Odia'),
});
export type TranslateContentInput = z.infer<typeof TranslateContentInputSchema>;

const TranslateContentOutputSchema = z.record(z.string(), z.string());
export type TranslateContentOutput = z.infer<typeof TranslateContentOutputSchema>;

export async function translateContentToMultipleLanguages(input: TranslateContentInput): Promise<TranslateContentOutput> {
  return translateContentToMultipleLanguagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateContentToMultipleLanguagesPrompt',
  input: {schema: TranslateContentInputSchema},
  output: {schema: TranslateContentOutputSchema},
  prompt: `You are a multilingual translation expert. You will translate the given text into the specified target languages. Return a JSON object where the keys are the language codes (en, hi, or) and the values are the translated text in the corresponding language.

Text to translate: {{{text}}}
Target languages: {{#each targetLanguages}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}`,
});

const translateContentToMultipleLanguagesFlow = ai.defineFlow(
  {
    name: 'translateContentToMultipleLanguagesFlow',
    inputSchema: TranslateContentInputSchema,
    outputSchema: TranslateContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

