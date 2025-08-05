//Subscription Recommendation Flow
'use server';
/**
 * @fileOverview AI-powered subscription recommendation flow.
 *
 * - subscriptionRecommendation - A function that returns subscription recommendations based on user interests.
 * - SubscriptionRecommendationInput - The input type for the subscriptionRecommendation function.
 * - SubscriptionRecommendationOutput - The return type for the subscriptionRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubscriptionRecommendationInputSchema = z.object({
  interests: z
    .string()
    .describe(
      'A comma-separated list of user interests, e.g., movies, sports, documentaries.'
    ),
  viewingHistory: z
    .string()
    .describe(
      'A description of the user viewing history, e.g., watched action movies and sports events.'
    ),
});
export type SubscriptionRecommendationInput = z.infer<
  typeof SubscriptionRecommendationInputSchema
>;

const SubscriptionRecommendationOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe(
      'A list of subscription recommendations based on user interests and viewing history.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why these subscriptions are recommended to the user.'
    ),
});
export type SubscriptionRecommendationOutput = z.infer<
  typeof SubscriptionRecommendationOutputSchema
>;

export async function subscriptionRecommendation(
  input: SubscriptionRecommendationInput
): Promise<SubscriptionRecommendationOutput> {
  return subscriptionRecommendationFlow(input);
}

const subscriptionRecommendationPrompt = ai.definePrompt({
  name: 'subscriptionRecommendationPrompt',
  input: {schema: SubscriptionRecommendationInputSchema},
  output: {schema: SubscriptionRecommendationOutputSchema},
  prompt: `Based on the user's interests and viewing history, recommend relevant subscriptions.

Interests: {{{interests}}}
Viewing History: {{{viewingHistory}}}

Provide a list of subscription recommendations and a brief explanation for each.
Do not suggest subscriptions that are obviously irrelevant to the user's stated interests.
Ensure that the recommendations are diverse and cover a range of content types, where applicable.

Format the output as a JSON object.
`,
});

const subscriptionRecommendationFlow = ai.defineFlow(
  {
    name: 'subscriptionRecommendationFlow',
    inputSchema: SubscriptionRecommendationInputSchema,
    outputSchema: SubscriptionRecommendationOutputSchema,
  },
  async input => {
    const {output} = await subscriptionRecommendationPrompt(input);
    return output!;
  }
);
