'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Share2,
  Copy,
  Check,
  Zap,
  Compass,
  User,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Users,
  CircleDot,
  Layers,
  Heart,
  Brain,
  Target,
  Edit,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import BodyGraphHDKit from '@/components/bodygraph/BodyGraphHDKit';
import {
  GATE_NAMES,
  GATE_KEYWORDS,
  CENTER_CONFIG,
  CHANNELS,
  PLANET_GLYPHS,
  PLANET_ORDER,
  AUTHORITY_INFO,
  PROFILE_INFO
} from '@/lib/bodygraph/data';
import { HDAPIResponse, ChartActivations, TYPE_INFO } from '@/types/humandesign';

interface ChartData {
  id: string;
  user_id: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  type: string;
  authority: string;
  profile: string;
  incarnation_cross: string;
  definition: string;
  chart_data: HDAPIResponse['data'];
  created_at: string;
}

// Transform ChartActivations to hdkit format
function transformActivations(activations: ChartActivations) {
  const result: Record<string, { g: number; l: number; planet: string }> = {};
  Object.entries(activations).forEach(([planet, position]) => {
    result[planet] = {
      g: position.gate,
      l: position.line,
      planet: planet
    };
  });
  return result;
}

// Get active gates from activations
function getActiveGates(personality: ChartActivations, design: ChartActivations) {
  const gates: Array<{
    gate: number;
    line: number;
    planet: string;
    type: 'personality' | 'design' | 'both';
    color?: number;
    tone?: number;
    base?: number;
  }> = [];

  const gateMap = new Map<number, { personality?: typeof personality.Sun; design?: typeof design.Sun }>();

  // Process personality
  Object.entries(personality).forEach(([planet, pos]) => {
    if (!gateMap.has(pos.gate)) {
      gateMap.set(pos.gate, {});
    }
    gateMap.get(pos.gate)!.personality = { ...pos, planet } as typeof personality.Sun & { planet: string };
  });

  // Process design
  Object.entries(design).forEach(([planet, pos]) => {
    if (!gateMap.has(pos.gate)) {
      gateMap.set(pos.gate, {});
    }
    gateMap.get(pos.gate)!.design = { ...pos, planet } as typeof design.Sun & { planet: string };
  });

  // Create gate entries
  gateMap.forEach((activations, gate) => {
    if (activations.personality && activations.design) {
      // Gate activated in both
      gates.push({
        gate,
        line: activations.personality.line,
        planet: activations.personality.planet,
        type: 'both',
        color: activations.personality.color,
        tone: activations.personality.tone,
        base: activations.personality.base
      });
    } else if (activations.personality) {
      gates.push({
        gate,
        line: activations.personality.line,
        planet: activations.personality.planet,
        type: 'personality',
        color: activations.personality.color,
        tone: activations.personality.tone,
        base: activations.personality.base
      });
    } else if (activations.design) {
      gates.push({
        gate,
        line: activations.design.line,
        planet: activations.design.planet,
        type: 'design',
        color: activations.design.color,
        tone: activations.design.tone,
        base: activations.design.base
      });
    }
  });

  return gates.sort((a, b) => a.gate - b.gate);
}

// Get active channels
function getActiveChannels(chartChannels: string[]) {
  return chartChannels
    .map(channelStr => {
      // Parse channel string (e.g., "64-47") into gates array
      const gates = channelStr.split('-').map(Number);
      const channel = CHANNELS.find(c =>
        (c.gates[0] === gates[0] && c.gates[1] === gates[1]) ||
        (c.gates[0] === gates[1] && c.gates[1] === gates[0])
      );
      return channel;
    })
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
}

export default function MyChartPage() {
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchChart() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError('Not authenticated');
          return;
        }

        // Fetch user's chart
        const { data, error: fetchError } = await supabase
          .from('charts')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('No chart found. Please generate your chart first.');
          } else {
            setError('Error loading chart');
          }
          return;
        }

        setChart(data as ChartData);
      } catch (err) {
        setError('Error loading chart');
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, []);

  const handleShare = async () => {
    if (!chart) return;

    setIsSharing(true);
    try {
      const response = await fetch(`/api/chart/${chart.id}/share`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to create share link');

      const data = await response.json();
      setShareUrl(data.shareUrl);

      // Copy to clipboard
      await navigator.clipboard.writeText(data.shareUrl);
      setIsCopied(true);
      toast.success('Share link copied to clipboard!');

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to create share link');
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Chart Not Found</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/chart/generate">Generate Your Chart</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chart) return null;

  const chartData = chart.chart_data;
  const personalityActivations = transformActivations(chartData.personality);
  const designActivations = transformActivations(chartData.design);
  const allGates = getActiveGates(chartData.personality, chartData.design);
  const personalityGates = allGates.filter(g => g.type === 'personality' || g.type === 'both');
  const designGates = allGates.filter(g => g.type === 'design' || g.type === 'both');
  const activeChannels = getActiveChannels(chartData.channels);

  // Format birth date and time for display
  const birthDate = new Date(chart.birth_date + 'T' + chart.birth_time);
  const formattedDate = birthDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = birthDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              My <span className="text-primary italic">Human Design</span>
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{chart.birth_location}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/chart/generate">
                <Edit className="w-4 h-4 mr-2" />
                Edit Birth Data
              </Link>
            </Button>
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="bg-gradient-to-r from-primary to-accent"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  {isSharing ? 'Creating...' : 'Share Chart'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Three-Column Bodygraph Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Design Gates */}
          <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <CircleDot className="w-5 h-5" />
                Design (Unconscious)
              </CardTitle>
              <CardDescription className="text-xs">88 days before birth</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {PLANET_ORDER.map(planet => {
                const activation = chartData.design[planet as keyof ChartActivations];
                if (!activation) return null;
                return (
                  <div key={planet} className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-lg flex-shrink-0">{PLANET_GLYPHS[planet as keyof typeof PLANET_GLYPHS]}</span>
                        <span className="font-semibold text-primary text-sm truncate">{planet}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-xs font-semibold text-primary">{activation.gate}.{activation.line}</span>
                        </div>
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-xs font-medium text-primary">C{activation.color}</span>
                        </div>
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-xs font-medium text-primary">T{activation.tone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Center: Bodygraph */}
          <Card className="lg:col-span-6 bg-white/90 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6">
              <BodyGraphHDKit
                personalityActivations={personalityActivations}
                designActivations={designActivations}
                activationsToShow="both"
              />
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-black rounded"></div>
                  <span>Personality (Conscious)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span>Design (Unconscious)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Personality Gates */}
          <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-black/20">
            <CardHeader className="bg-gradient-to-r from-black/5 to-black/10">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personality (Conscious)
              </CardTitle>
              <CardDescription className="text-xs">At time of birth</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {PLANET_ORDER.map(planet => {
                const activation = chartData.personality[planet as keyof ChartActivations];
                if (!activation) return null;
                return (
                  <div key={planet} className="p-2 rounded-lg bg-black/5 border border-black/10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-lg flex-shrink-0">{PLANET_GLYPHS[planet as keyof typeof PLANET_GLYPHS]}</span>
                        <span className="font-semibold text-sm truncate">{planet}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/10 border border-black/20">
                          <span className="text-xs font-semibold">{activation.gate}.{activation.line}</span>
                        </div>
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black/10 border border-black/20">
                          <span className="text-xs font-medium">C{activation.color}</span>
                        </div>
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black/10 border border-black/20">
                          <span className="text-xs font-medium">T{activation.tone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Type Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Zap className="w-10 h-10 text-primary" />
                <Badge className="bg-primary">Energy</Badge>
              </div>
              <CardTitle className="text-2xl mt-2">{chart.type}</CardTitle>
              <CardDescription className="text-sm font-medium text-primary">
                {TYPE_INFO[chart.type as keyof typeof TYPE_INFO]?.strategy || 'Your Strategy'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Signature:</span> {TYPE_INFO[chart.type as keyof typeof TYPE_INFO]?.signature || 'Peace'}
              </p>
            </CardContent>
          </Card>

          {/* Authority Card */}
          <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Compass className="w-10 h-10 text-accent" />
                <Badge className="bg-accent">Decision</Badge>
              </div>
              <CardTitle className="text-2xl mt-2">{chart.authority}</CardTitle>
              <CardDescription className="text-sm font-medium text-accent">
                Your Inner Authority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {AUTHORITY_INFO[chart.authority as keyof typeof AUTHORITY_INFO]?.description || 'Trust your inner guidance.'}
              </p>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="w-10 h-10 text-primary" />
                <Badge variant="outline">Profile</Badge>
              </div>
              <CardTitle className="text-2xl mt-2">{chart.profile}</CardTitle>
              <CardDescription className="text-sm font-medium">
                {PROFILE_INFO[chart.profile as keyof typeof PROFILE_INFO]?.name || 'Your Profile'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-semibold">Conscious:</span> {chart.profile.split('/')[0]} Line</p>
                <p><span className="font-semibold">Unconscious:</span> {chart.profile.split('/')[1]} Line</p>
              </div>
            </CardContent>
          </Card>

          {/* Cross Card */}
          <Card className="bg-gradient-to-br from-accent/5 to-primary/10 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Sparkles className="w-10 h-10 text-accent" />
                <Badge variant="outline">Purpose</Badge>
              </div>
              <CardTitle className="text-lg mt-2 leading-tight">{chart.incarnation_cross.replace('Right Angle Cross of ', '').replace('Left Angle Cross of ', '').replace('Juxtaposition Cross of ', '')}</CardTitle>
              <CardDescription className="text-xs">
                {chart.incarnation_cross.includes('Right Angle') ? 'Right Angle Cross' :
                 chart.incarnation_cross.includes('Left Angle') ? 'Left Angle Cross' : 'Juxtaposition Cross'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Your life's purpose and direction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="centers">Centers</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="gates">Gates</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Definition</CardTitle>
                <CardDescription>How your energy flows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className="mb-2">{chart.definition || 'Single Definition'}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {chart.definition === 'Single Definition' && 'All your defined centers are connected in one continuous flow. You have a consistent, reliable way of processing energy.'}
                    {chart.definition === 'Split Definition' && 'You have two separate areas of definition. You may need others to bridge the gap between these areas.'}
                    {chart.definition === 'Triple Split' && 'You have three separate areas of definition. Multiple perspectives and flexibility in how you process energy.'}
                    {chart.definition === 'Quadruple Split' && 'You have four separate areas of definition. You benefit from diverse connections and perspectives.'}
                    {chart.definition === 'No Definition' && 'As a Reflector, you are completely open and deeply connected to your environment.'}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Your Strategy in Action</h4>
                  <p className="text-sm text-muted-foreground">
                    {TYPE_INFO[chart.type as keyof typeof TYPE_INFO]?.strategy || 'Follow your strategy'}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Making Decisions</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your {chart.authority} authority. {AUTHORITY_INFO[chart.authority as keyof typeof AUTHORITY_INFO]?.description || 'Trust your inner guidance.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Centers Tab */}
          <TabsContent value="centers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Defined Centers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDot className="w-5 h-5 text-accent" />
                    Defined Centers
                  </CardTitle>
                  <CardDescription>Your consistent, reliable energy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chartData.definedCenters.map(center => {
                    const centerInfo = CENTER_CONFIG.find(c => c.name === center);
                    if (!centerInfo) return null;
                    return (
                      <div key={center} className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{center}</h4>
                          <Badge className="bg-accent text-xs">Defined</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{centerInfo.theme}</p>
                        <div className="flex flex-wrap gap-1">
                          {centerInfo.gates.map(gate => (
                            <Badge key={gate} variant="secondary" className="text-xs">
                              {gate}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Open Centers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-muted-foreground" />
                    Open Centers
                  </CardTitle>
                  <CardDescription>Where you're influenced by others</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {CENTER_CONFIG.filter(c => !chartData.definedCenters.includes(c.name)).map(centerInfo => (
                    <div key={centerInfo.name} className="p-3 rounded-lg bg-muted/30 border border-muted">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{centerInfo.name}</h4>
                        <Badge variant="outline" className="text-xs">Open</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{centerInfo.notSelfTheme}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels">
            <Card>
              <CardHeader>
                <CardTitle>Active Channels</CardTitle>
                <CardDescription>
                  {activeChannels.length} channels connecting your defined centers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeChannels.map(channel => (
                    <div
                      key={channel.gates}
                      className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-primary text-xs">{channel.gates}</Badge>
                        <Badge variant="outline" className="text-xs">{channel.type}</Badge>
                      </div>
                      <h4 className="font-semibold mb-1">{channel.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{channel.circuit}</p>
                      <div className="flex gap-1 text-xs text-muted-foreground">
                        <span>{GATE_NAMES[channel.gate1 as keyof typeof GATE_NAMES]}</span>
                        <span>↔</span>
                        <span>{GATE_NAMES[channel.gate2 as keyof typeof GATE_NAMES]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gates Tab */}
          <TabsContent value="gates">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personality Gates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personality Gates (Conscious)
                  </CardTitle>
                  <CardDescription>{personalityGates.length} gates activated at birth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                  {personalityGates.map(gate => (
                    <div
                      key={`personality-${gate.gate}-${gate.planet}`}
                      className="p-3 rounded-lg bg-black/5 border border-black/10"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Gate {gate.gate}.{gate.line}</span>
                          <Badge variant="secondary" className="text-xs">
                            {PLANET_GLYPHS[gate.planet as keyof typeof PLANET_GLYPHS]} {gate.planet}
                          </Badge>
                        </div>
                        {gate.type === 'both' && (
                          <Badge className="text-xs bg-gradient-to-r from-black to-primary">
                            Both
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {GATE_NAMES[gate.gate as keyof typeof GATE_NAMES]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {GATE_KEYWORDS[gate.gate as keyof typeof GATE_KEYWORDS]}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Design Gates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CircleDot className="w-5 h-5" />
                    Design Gates (Unconscious)
                  </CardTitle>
                  <CardDescription>{designGates.length} gates activated 88 days before birth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                  {designGates.map(gate => (
                    <div
                      key={`design-${gate.gate}-${gate.planet}`}
                      className="p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">Gate {gate.gate}.{gate.line}</span>
                          <Badge variant="secondary" className="text-xs">
                            {PLANET_GLYPHS[gate.planet as keyof typeof PLANET_GLYPHS]} {gate.planet}
                          </Badge>
                        </div>
                        {gate.type === 'both' && (
                          <Badge className="text-xs bg-gradient-to-r from-primary to-black">
                            Both
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {GATE_NAMES[gate.gate as keyof typeof GATE_NAMES]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {GATE_KEYWORDS[gate.gate as keyof typeof GATE_KEYWORDS]}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Variables Tab */}
          <TabsContent value="variables">
            <Card>
              <CardHeader>
                <CardTitle>Variables & Advanced Data</CardTitle>
                <CardDescription>PHS (Primary Health System) & Rave Psychology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variable Type */}
                <div>
                  <h4 className="font-semibold mb-2">Variable Type</h4>
                  <Badge className="text-lg px-4 py-2">{chartData.variableType || 'Not Available'}</Badge>
                </div>

                {/* PHS */}
                {chartData.phs && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        Digestion (PHS)
                      </h4>
                      <p className="text-lg font-medium mb-1">{chartData.phs.digestion}</p>
                      {chartData.phs.digestionTone && (
                        <p className="text-sm text-muted-foreground">Tone: {chartData.phs.digestionTone}</p>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent" />
                        Environment (PHS)
                      </h4>
                      <p className="text-lg font-medium mb-1">{chartData.phs.environment}</p>
                      {chartData.phs.environmentTone && (
                        <p className="text-sm text-muted-foreground">Tone: {chartData.phs.environmentTone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Rave Psychology */}
                {chartData.ravePsychology && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Motivation
                      </h4>
                      <p className="text-lg font-medium mb-1">{chartData.ravePsychology.motivation}</p>
                      {chartData.ravePsychology.motivationTone && (
                        <p className="text-sm text-muted-foreground">Tone: {chartData.ravePsychology.motivationTone}</p>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-accent" />
                        Perspective
                      </h4>
                      <p className="text-lg font-medium mb-1">{chartData.ravePsychology.perspective}</p>
                      {chartData.ravePsychology.perspectiveTone && (
                        <p className="text-sm text-muted-foreground">Tone: {chartData.ravePsychology.perspectiveTone}</p>
                      )}
                    </div>

                    {chartData.ravePsychology.transferred && (
                      <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                        <h4 className="font-semibold mb-2">Transferred</h4>
                        <p className="text-lg font-medium">{chartData.ravePsychology.transferred}</p>
                      </div>
                    )}

                    {chartData.ravePsychology.distracted && (
                      <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                        <h4 className="font-semibold mb-2">Distracted</h4>
                        <p className="text-lg font-medium">{chartData.ravePsychology.distracted}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to go deeper?</h3>
            <p className="text-muted-foreground mb-6">
              Explore the 44-Week Journey and fully embody your Human Design
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent" asChild>
                <Link href="/classes">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Explore Classes
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/resources">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Free Resources
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
