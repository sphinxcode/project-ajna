import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

export default function CartPage() {
  // Sample cart items (will be replaced with real data later)
  const cartItems = [
    {
      id: 1,
      title: '44-Week Deconditioning Journey',
      type: 'Course Bundle',
      price: 8999,
      quantity: 1,
      thumbnail: '🎓'
    },
    {
      id: 2,
      title: 'Personal Human Design Reading',
      type: 'Consultation',
      price: 2500,
      quantity: 1,
      thumbnail: '✨'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0; // No tax for now
  const total = subtotal + tax;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Shopping <span className="text-primary italic">Cart</span>
          </h1>
          <p className="text-muted-foreground">Review your items and proceed to checkout</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-4xl flex-shrink-0">
                        {item.thumbnail}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <Badge variant="outline" className="mt-1">
                              {item.type}
                            </Badge>
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="w-8 h-8 rounded-lg border border-muted hover:bg-muted transition-colors flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              className="w-8 h-8 rounded-lg border border-muted hover:bg-muted transition-colors flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xl font-bold text-primary">
                            ₱{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your total</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">₱{tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl text-primary">
                          ₱{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent text-lg py-6"
                    size="lg"
                    disabled
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Payment processing coming soon
                  </p>

                  {/* Security Badges */}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-center text-muted-foreground mb-2">
                      Secure checkout powered by
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        Stripe
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        PayMongo
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Empty Cart State
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Add items to your cart to get started with your Human Design journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-primary to-accent" asChild>
                  <a href="/classes">
                    Browse Classes
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/resources">
                    View Resources
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggested Items */}
        {cartItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'I-Ching Deep Dive Course', price: 1499, thumbnail: '☯️' },
                { title: 'Filipino Healing Module', price: 999, thumbnail: '🌸' },
                { title: 'Advanced Variables Workshop', price: 2999, thumbnail: '🔬' }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="text-5xl mb-4 text-center">{item.thumbnail}</div>
                    <h3 className="font-semibold text-center mb-2">{item.title}</h3>
                    <p className="text-center text-2xl font-bold text-primary mb-4">
                      ₱{item.price.toLocaleString()}
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
