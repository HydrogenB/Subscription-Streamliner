import type { SubscriptionRecommendationOutput } from "@/ai/flows/subscription-recommendation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RecommendationResultsProps {
  result: SubscriptionRecommendationOutput;
}

export function RecommendationResults({ result }: RecommendationResultsProps) {
  return (
    <div className="p-6 border-t">
      <h2 className="text-2xl font-bold font-headline mb-4">Here are your recommendations!</h2>
      <Card className="bg-background/50">
        <CardHeader>
          <CardTitle>Top Picks For You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-6" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Why these recommendations?</h3>
            <p className="text-muted-foreground italic">"{result.reasoning}"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
