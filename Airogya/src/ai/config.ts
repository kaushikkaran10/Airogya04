import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// TODO: Add your Gemini API key here.
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";


export function configureGenkit() {
  genkit({
    plugins: [
      googleAI({
        apiKey: GEMINI_API_KEY,
      }),
    ],
    model: 'googleai/gemini-2.5-flash',
  });
}
