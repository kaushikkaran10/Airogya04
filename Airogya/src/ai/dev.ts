import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-symptoms-and-suggest-conditions.ts';
import '@/ai/flows/provide-simplified-condition-information.ts';
import '@/ai/flows/translate-content-to-multiple-languages.ts';
import '@/ai/flows/find-nearby-hospitals.ts';
