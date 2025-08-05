import { RecommendationForm } from "@/components/recommendations/recommendation-form";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">AI-Powered Recommendations</h1>
        <p className="text-muted-foreground">
          Tell us what you love, and our AI will suggest the perfect subscription bundles for you.
        </p>
      </div>
      <RecommendationForm />
    </div>
  );
}
