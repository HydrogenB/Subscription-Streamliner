'use client';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { subscriptionRecommendation, type SubscriptionRecommendationOutput } from '@/ai/flows/subscription-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { RecommendationResults } from './recommendation-results';

const formSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in a bit more detail.'),
  viewingHistory: z.string().min(10, 'Please describe your viewing history in a bit more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

export function RecommendationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubscriptionRecommendationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      viewingHistory: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const recommendation = await subscriptionRecommendation(data);
      setResult(recommendation);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to get recommendations. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Discover Your Next Subscription</CardTitle>
            <CardDescription>
              Example interests: "sci-fi movies, cooking shows, live soccer".
              <br />
              Example viewing history: "Watched The Mandalorian, Chef's Table, and the Premier League."
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What are you interested in?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="viewingHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Viewing History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What have you watched recently?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Recommendations
            </Button>
          </CardFooter>
        </form>
      </Form>
      {loading && (
        <div className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Our AI is thinking...</p>
        </div>
      )}
      {result && <RecommendationResults result={result} />}
    </Card>
  );
}
