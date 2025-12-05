import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, PlayCircle, Lock, Clock, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ClassesPage() {
  const phases = [
    {
      id: 1,
      title: 'Phase 1: Ancient Foundations',
      weeks: '1-6',
      description: 'I-Ching, Hexagrams, and the roots of Human Design',
      lessons: 18,
      completed: 3,
      status: 'in_progress',
      unlocked: true
    },
    {
      id: 2,
      title: 'Phase 2: Nourishing Your Vehicle',
      weeks: '7-18',
      description: 'Determination & Environment (PHS)',
      lessons: 36,
      completed: 0,
      status: 'locked',
      unlocked: false
    },
    {
      id: 3,
      title: 'Phase 3: Clearing Your Vision',
      weeks: '19-26',
      description: 'Perspective & Motivation (Rave Psychology)',
      lessons: 24,
      completed: 0,
      status: 'locked',
      unlocked: false
    },
    {
      id: 4,
      title: 'Phase 4: Learning Your Mechanics',
      weeks: '27-36',
      description: 'Type, Strategy, Authority deep dive',
      lessons: 30,
      completed: 0,
      status: 'locked',
      unlocked: false
    },
    {
      id: 5,
      title: 'Phase 5: Cultural Healing',
      weeks: '37-40',
      description: 'Deconditioning Filipino cultural patterns',
      lessons: 12,
      completed: 0,
      status: 'locked',
      unlocked: false
    },
    {
      id: 6,
      title: 'Phase 6: Integration & 2027',
      weeks: '41-44',
      description: 'Living your design, preparing for the shift',
      lessons: 12,
      completed: 0,
      status: 'locked',
      unlocked: false
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            44-Week <span className="text-primary italic">Journey</span>
          </h1>
          <p className="text-muted-foreground">
            Your transformational path through Human Design deconditioning
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Week 3 of 44 • 7% Complete</CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Week 3
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={7} className="h-3" />
          </CardContent>
        </Card>

        {/* Phases */}
        <div>
          <h2 className="text-2xl font-bold mb-4">6 Phases of Transformation</h2>
          <div className="space-y-6">
            {phases.map(phase => {
              const progress = phase.completed > 0 ? (phase.completed / phase.lessons) * 100 : 0;
              return (
                <Card
                  key={phase.id}
                  className={`group transition-all duration-300 ${
                    phase.unlocked
                      ? 'hover:shadow-xl hover:-translate-y-1 border-accent/20'
                      : 'opacity-60 bg-muted/30'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {phase.unlocked ? (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                              {phase.id}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <Lock className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <CardTitle className={phase.unlocked ? 'group-hover:text-primary transition-colors' : ''}>
                              {phase.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span>Weeks {phase.weeks}</span>
                              <span>•</span>
                              <span>{phase.lessons} lessons</span>
                            </CardDescription>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground ml-15">
                          {phase.description}
                        </p>
                      </div>
                      {phase.status === 'in_progress' && (
                        <Badge className="bg-accent">In Progress</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {phase.completed > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span>{phase.completed} of {phase.lessons} completed</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      {phase.unlocked ? (
                        <Button
                          className="bg-gradient-to-r from-primary to-accent"
                          asChild
                          disabled
                        >
                          <Link href={`/classes/${phase.id}`}>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {phase.completed > 0 ? 'Continue' : 'Start Phase'}
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                      <Button variant="outline" asChild disabled={!phase.unlocked}>
                        <Link href={`/classes/${phase.id}`}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          View Syllabus
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Upgrade CTA */}
        <Card className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 border-accent/20">
          <CardContent className="p-8 text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h3 className="text-2xl font-bold mb-2">Ready to Dive Deeper?</h3>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium to unlock all 44 weeks of transformational content
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent" asChild>
              <Link href="/billing">
                Upgrade to Premium
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
