import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  GraduationCap,
  PlayCircle,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', user!.id)
    .single();

  // Get first name
  const firstName = profile?.name?.split(' ')[0] || 'Student';

  // Sample course data (will be replaced with real data later)
  const previousClasses = [
    {
      id: 1,
      title: 'Introduction to Human Design',
      description: 'Understanding the basics of your bodygraph',
      progress: 100,
      thumbnail: '🎯',
      duration: '45 min',
      completed: true
    },
    {
      id: 2,
      title: 'Energy Types Explained',
      description: 'Deep dive into Generators, Projectors, and more',
      progress: 100,
      thumbnail: '⚡',
      duration: '60 min',
      completed: true
    },
    {
      id: 3,
      title: 'Authority in Decision Making',
      description: 'How to trust your inner authority',
      progress: 75,
      thumbnail: '🧭',
      duration: '50 min',
      completed: false
    }
  ];

  const upcomingTopics = [
    {
      id: 4,
      title: 'Centers & Conditioning',
      description: 'Exploring the 9 centers and their themes',
      date: 'Dec 12, 2025',
      thumbnail: '🔮',
      duration: '55 min'
    },
    {
      id: 5,
      title: 'Profile Lines Deep Dive',
      description: 'Understanding your conscious and unconscious roles',
      date: 'Dec 15, 2025',
      thumbnail: '📖',
      duration: '48 min'
    },
    {
      id: 6,
      title: 'Filipino Cultural Healing',
      description: 'Deconditioning from utang na loob and hiya',
      date: 'Dec 18, 2025',
      thumbnail: '🌸',
      duration: '65 min'
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-primary/20 shadow-xl">
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Welcome back, <span className="text-primary italic">{firstName}</span>!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Always stay updated in your student portal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-white/80 backdrop-blur-sm border-accent/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  Here's Your Progress
                </CardTitle>
                <CardDescription>Your journey through the 44-week program</CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-accent/10 border-accent">
                Week 3 of 44
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Overall Progress</span>
                <span className="font-semibold text-primary">7%</span>
              </div>
              <Progress value={7} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Previous Classes */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Previous Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousClasses.map((course) => (
              <Card
                key={course.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-accent/10"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-5xl mb-3">{course.thumbnail}</div>
                    {course.completed && (
                      <Badge className="bg-green-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {course.progress}% complete
                    </p>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
                    asChild
                  >
                    <Link href={`/classes/${course.id}`}>
                      {course.completed ? 'Review' : 'Continue'}
                      <PlayCircle className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Topics */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-accent" />
            Upcoming Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTopics.map((topic) => (
              <Card
                key={topic.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white/90 to-accent/5 backdrop-blur-sm border-accent/20"
              >
                <CardHeader>
                  <div className="text-5xl mb-3">{topic.thumbnail}</div>
                  <CardTitle className="text-lg group-hover:text-accent transition-colors">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{topic.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{topic.duration}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 hover:bg-accent/10 hover:border-accent"
                    disabled
                  >
                    Available Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button
                size="lg"
                className="h-auto py-6 bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/my-chart">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-8 h-8" />
                    <span className="font-semibold">View My Chart</span>
                  </div>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-auto py-6 border-2 border-primary/30 hover:bg-primary/5 transition-all"
                asChild
              >
                <Link href="/classes">
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap className="w-8 h-8" />
                    <span className="font-semibold">Browse All Classes</span>
                  </div>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-auto py-6 border-2 border-accent/30 hover:bg-accent/5 transition-all"
                asChild
              >
                <Link href="/resources">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="w-8 h-8" />
                    <span className="font-semibold">Free Resources</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
