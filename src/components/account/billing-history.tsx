import { billingHistory } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BillingHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>
          A record of your past payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingHistory.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
             {billingHistory.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                        No billing history found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
