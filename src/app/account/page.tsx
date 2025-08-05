import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActiveSubscriptions } from "@/components/account/active-subscriptions"
import { BillingHistory } from "@/components/account/billing-history"

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Account</h1>
        <p className="text-muted-foreground">Manage your subscriptions and billing information.</p>
      </div>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>
        <TabsContent value="subscriptions" className="mt-6">
          <ActiveSubscriptions />
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <BillingHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
