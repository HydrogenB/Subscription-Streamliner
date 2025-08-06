import { userSubscriptions } from "@/lib/data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ActiveSubscriptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Subscriptions</CardTitle>
        <CardDescription>
          Here are all the plans you are currently subscribed to.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {userSubscriptions.map(sub => (
          <Card key={sub.id} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">{sub.serviceName}</CardTitle>
                <CardDescription>Renews on: {sub.renewalDate}</CardDescription>
              </div>
              <Badge variant={sub.status === 'Active' ? 'default' : 'secondary'} className={sub.status === 'Active' ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}>
                {sub.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                THB {sub.price.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Manage Plan</Button>
              <Button variant="destructive">Cancel</Button>
            </CardFooter>
          </Card>
        ))}
        {userSubscriptions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            You have no active subscriptions.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
