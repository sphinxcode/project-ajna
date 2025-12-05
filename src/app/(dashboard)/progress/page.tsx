import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Award, Target, Clock, CheckCircle2 } from 'lucide-react';

export default function ProgressPage() {
  const stats = [
    { label: 'Current Week', value: '3 of 44', icon: Calendar, color: 'text-primary' },
    { label: 'Lessons Completed', value: '3', icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Study Time', value: '2.5 hrs', icon: Clock, color: 'text-accent' },
    { label: 'Streak', value: '5 days', icon: Target, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { date: 'Dec 6, 2025', lesson: 'Authority in Decision Making', duration: '45 min', completed: true },
    { date: 'Dec 5, 2025', lesson: 'Energy Types Explained', duration: '60 min', completed: true },
    { date: 'Dec 4, 2025', lesson: 'Introduction to Human Design', duration: '50 min', completed: true },
  ];

  const milestones = [
    { title: 'First Chart Generated', date: 'Dec 3, 2025', achieved: true },
    { title: 'Week 1 Completed', date: 'Dec 5, 2025', achieved: true },
    { title: 'Phase 1 Completed', date: 'Coming Soon', achieved: false },
    { title: '44-Week Journey Completed', date: 'Coming Soon', achieved: false },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Your <span className="text-primary italic">Progress</span>
          </h1>
          <p className="text-muted-foreground">Track your journey through the 44-week program</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>{stat.label}</CardDescription>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Overall Progress */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Overall Journey Progress
            </CardTitle>
            <CardDescription>44-Week Deconditioning Journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Week 3 of 44</span>
                <span className="font-semibold text-primary">7%</span>
              </div>
              <Progress value={7} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Phase 1</p>
                <p className="text-2xl font-bold text-accent">17%</p>
                <Progress value={17} className="h-2 mt-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phase 2</p>
                <p className="text-2xl font-bold text-muted-foreground">0%</p>
                <Progress value={0} className="h-2 mt-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phase 3</p>
                <p className="text-2xl font-bold text-muted-foreground">0%</p>
                <Progress value={0} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest completed lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-muted"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">{activity.lesson}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{activity.duration}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Milestones
            </CardTitle>
            <CardDescription>Your achievements along the journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    milestone.achieved
                      ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20'
                      : 'bg-muted/30 border-muted opacity-60'
                  }`}
                >
                  {milestone.achieved ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                  </div>
                  {milestone.achieved && (
                    <Badge className="bg-green-600">Achieved</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
