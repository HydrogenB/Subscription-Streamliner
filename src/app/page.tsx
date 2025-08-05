import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, SlidersHorizontal, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12">
      <section className="w-full py-12 bg-card rounded-xl shadow-lg">
        <div className="container px-4">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Subscription Streamliner
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                All your subscriptions, one simple platform. Discover, manage, and save with AI-powered recommendations.
              </p>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <Link href="/subscriptions">
                <Button size="lg" className="w-full group transition-all duration-300 ease-in-out hover:scale-105">
                  Browse Plans
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl grid grid-cols-1 gap-8">
        <Card className="text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="text-primary" />
              Customize Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Tailor your subscription with our flexible plans and add-ons to fit your needs perfectly.</p>
          </CardContent>
        </Card>
        <Card className="text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-primary" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Let our smart AI find the best subscription bundles for you based on your interests.</p>
          </CardContent>
        </Card>
        <Card className="text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-primary" />
              Manage Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Easily view your active subscriptions, manage billing, and make changes anytime.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
