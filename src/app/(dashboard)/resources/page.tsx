import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Video, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: 'Human Design Basics Guide',
      description: 'A comprehensive introduction to the five energy types',
      type: 'PDF',
      icon: FileText,
      free: true,
      url: '#'
    },
    {
      id: 2,
      title: 'Understanding Your Authority',
      description: 'Learn how to trust your inner decision-making process',
      type: 'Video',
      icon: Video,
      free: true,
      url: '#'
    },
    {
      id: 3,
      title: 'The 9 Centers Explained',
      description: 'Deep dive into each center and its themes',
      type: 'PDF',
      icon: FileText,
      free: true,
      url: '#'
    },
    {
      id: 4,
      title: 'Filipino Cultural Conditioning',
      description: 'Understanding how our culture shapes our not-self',
      type: 'Video',
      icon: Video,
      free: true,
      url: '#'
    },
    {
      id: 5,
      title: '64 Gates Reference Sheet',
      description: 'Quick reference guide for all 64 gates',
      type: 'PDF',
      icon: FileText,
      free: true,
      url: '#'
    },
    {
      id: 6,
      title: 'Profile Lines Overview',
      description: 'Understanding the 12 profiles and their dynamics',
      type: 'Video',
      icon: Video,
      free: true,
      url: '#'
    }
  ];

  const premiumResources = [
    {
      id: 7,
      title: 'Advanced Rave Psychology',
      description: 'Motivation, Perspective, and Cognition deep dive',
      type: 'Premium',
      icon: BookOpen
    },
    {
      id: 8,
      title: 'PHS & Environment Study',
      description: 'Complete guide to Primary Health System',
      type: 'Premium',
      icon: BookOpen
    },
    {
      id: 9,
      title: 'Color, Tone & Base Workshop',
      description: 'The deepest layers of Human Design',
      type: 'Premium',
      icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            FREE <span className="text-primary italic">Resources</span>
          </h1>
          <p className="text-muted-foreground">
            Educational materials to deepen your Human Design understanding
          </p>
        </div>

        {/* Free Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => {
              const Icon = resource.icon;
              return (
                <Card
                  key={resource.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        Free
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent"
                      asChild
                      disabled
                    >
                      <Link href={resource.url}>
                        <Download className="w-4 h-4 mr-2" />
                        Coming Soon
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Premium Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Premium Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumResources.map(resource => {
              const Icon = resource.icon;
              return (
                <Card
                  key={resource.id}
                  className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <Badge className="bg-accent">Premium</Badge>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full border-accent/50 hover:bg-accent/10"
                      asChild
                    >
                      <Link href="/billing">
                        Upgrade to Access
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Card */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Want More Resources?</h3>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium and unlock our complete library of advanced materials
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent" asChild>
              <Link href="/billing">
                View Premium Plans
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
