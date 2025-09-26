'use server';

/**
 * @fileOverview Finds nearby hospitals based on a user-provided PIN code.
 *
 * - findNearbyHospitals - A function that handles finding nearby hospitals.
 * - FindNearbyHospitalsInput - The input type for the findNearbyHospitals function.
 * - FindNearbyHospitalsOutput - The return type for the findNearbyHospitals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { hospitalData } from '@/lib/hospital-data';


const FindNearbyHospitalsInputSchema = z.object({
  pincode: z.string().describe('The PIN code to search for hospitals in.'),
});
export type FindNearbyHospitalsInput = z.infer<typeof FindNearbyHospitalsInputSchema>;

const HospitalSchema = z.object({
    name: z.string().describe('The name of the hospital.'),
    address: z.string().describe('The full address of the hospital.'),
    type: z.enum(['government', 'private', 'charitable']).describe('The type of hospital.'),
    hours: z.string().describe('The operating hours of the hospital (e.g., "24/7").'),
    directions: z.string().describe('A Google Maps URL for directions to the hospital.'),
    phone: z.string().describe('The contact phone number for the hospital, formatted as "tel:<number>".'),
});

const FindNearbyHospitalsOutputSchema = z.object({
    hospitals: z.array(HospitalSchema).describe('A list of nearby hospitals.'),
});
export type FindNearbyHospitalsOutput = z.infer<typeof FindNearbyHospitalsOutputSchema>;


const getHospitalsByPincode = ai.defineTool(
    {
      name: 'getHospitalsByPincode',
      description: 'Returns a list of hospitals for a given Indian PIN code.',
      inputSchema: z.object({
        pincode: z.string().describe('The PIN code to search for hospitals in.'),
      }),
      outputSchema: FindNearbyHospitalsOutputSchema,
    },
    async (input) => {
        return hospitalData[input.pincode] || { hospitals: [] };
    }
);

export async function findNearbyHospitals(
  input: FindNearbyHospitalsInput
): Promise<FindNearbyHospitalsOutput> {
  return findNearbyHospitalsFlow(input);
}

const findNearbyHospitalsFlow = ai.defineFlow(
  {
    name: 'findNearbyHospitalsFlow',
    inputSchema: FindNearbyHospitalsInputSchema,
    outputSchema: FindNearbyHospitalsOutputSchema,
  },
  async input => {
    return await getHospitalsByPincode(input);
  }
);
