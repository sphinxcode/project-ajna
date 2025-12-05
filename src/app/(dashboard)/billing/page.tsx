import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Clock, Check, X } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            <span className="text-primary italic">Billing</span> & Subscription
          </h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods</p>
        </div>

        {/* Current Plan */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Free Tier</CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Free
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm">Full chart generator access</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm">Personal chart saved to account</p>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">44-week deconditioning journey</p>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">Advanced chart data</p>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <Card className="border-2 border-accent/30 hover:border-accent transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Monthly</span>
                  <Badge className="bg-accent">Popular</Badge>
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₱899</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Full 44-week journey</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Advanced chart data</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">I Ching deep dives</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Community access</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Priority support</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" size="lg" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="border-2 border-primary/30 hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Yearly</span>
                  <Badge className="bg-primary">Save 20%</Badge>
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₱8,999</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ₱750/month • Save ₱2,000/year
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Everything in Monthly</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Early access to new features</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Certificate of completion</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Monthly live Q&A access</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm">Priority booking discounts</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" size="lg" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No payment methods on file. Add a payment method when you upgrade to premium.
            </p>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Billing History
            </CardTitle>
            <CardDescription>View your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No billing history available. You're currently on the free plan.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
