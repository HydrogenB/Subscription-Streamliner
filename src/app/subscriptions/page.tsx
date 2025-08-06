import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Build Your Bundle</CardTitle>
          <CardDescription>
            Create your perfect entertainment package by selecting from our available services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/subscriptions/add">
            <Button size="lg" className="w-full group">
              Add Bundle
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
