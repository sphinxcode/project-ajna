import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Inbox, Mail, Bell, MessageSquare, Calendar } from 'lucide-react';

export default function InboxPage() {
  const notifications = [
    {
      id: 1,
      type: "announcement",
      title: "Welcome to Total Human Design!",
      message: "We're excited to have you on this transformational journey.",
      date: "Dec 3, 2025",
      read: false,
      icon: Bell
    },
    {
      id: 2,
      type: 'reminder',
      title: 'New Lesson Available',
      message: 'Week 3 lesson "Understanding Centers" is now available.',
      date: 'Dec 5, 2025',
      read: false,
      icon: Calendar
    },
    {
      id: 3,
      type: 'message',
      title: 'Chart Generated Successfully',
      message: 'Your Human Design chart has been saved to your account.',
      date: 'Dec 3, 2025',
      read: true,
      icon: MessageSquare
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            <span className="text-primary italic">Inbox</span> & Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated with your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Unread</CardDescription>
                <Mail className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">2</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Messages</CardDescription>
                <Inbox className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>This Week</CardDescription>
                <Bell className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>Your recent updates and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map(notification => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`flex gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                      !notification.read
                        ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20'
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notification.read
                        ? 'bg-gradient-to-br from-primary to-accent'
                        : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${!notification.read ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Badge className="bg-primary">New</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{notification.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empty State (for when there are no messages) */}
        {/* <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Inbox className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No new messages</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up! We'll notify you when there's something new.
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
