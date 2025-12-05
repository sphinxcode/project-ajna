'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
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
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      gates.push({
        gate,
        line: activations.personality.line,
        planet: (activations.personality as unknown as { planet: string }).planet,
        type: 'both',
        color: activations.personality.color,
        tone: activations.personality.tone,
        base: activations.personality.base
      });
    } else if (activations.personality) {
      gates.push({
        gate,
        line: activations.personality.line,
        planet: (activations.personality as unknown as { planet: string }).planet,
        type: 'personality',
        color: activations.personality.color,
        tone: activations.personality.tone,
        base: activations.personality.base
      });
    } else if (activations.design) {
      gates.push({
        gate,
        line: activations.design.line,
        planet: (activations.design as unknown as { planet: string }).planet,
        type: 'design',
        color: activations.design.color,
        tone: activations.design.tone,
        base: activations.design.base
      });
    }
  });

  return gates;
}

// Get active channels
function getActiveChannels(chartChannels: string[] | undefined) {
  if (!chartChannels) return [];

  return chartChannels.map(channelStr => {
    const [gate1, gate2] = channelStr.split('-').map(Number);
    const channelData = CHANNELS.find(
      c => (c.gates[0] === gate1 && c.gates[1] === gate2) ||
           (c.gates[0] === gate2 && c.gates[1] === gate1)
    );
    return {
      gates: [Math.min(gate1, gate2), Math.max(gate1, gate2)] as [number, number],
      name: channelData?.name || 'Unknown',
      type: channelData?.type || 'Individual',
      circuit: channelData?.circuit || 'Unknown'
    };
  });
}

export default function ChartResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const chartId = resolvedParams.id;

  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    async function fetchChart() {
      try {
        const response = await fetch(`/api/chart/${chartId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch chart');
        }

        setChart(data.chart);

        // Also fetch share status
        const shareResponse = await fetch(`/api/chart/${chartId}/share`);
        if (shareResponse.ok) {
          const shareData = await shareResponse.json();
          if (shareData.isShared) {
            setShareUrl(shareData.shareUrl);
            setViewCount(shareData.viewCount || 0);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, [chartId]);

  const handleShare = async () => {
    if (shareLoading) return;

    // If we already have a share URL, just copy it
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    // Create a new share link
    setShareLoading(true);
    try {
      const response = await fetch(`/api/chart/${chartId}/share`, {
        method: 'POST'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create share link');
      }

      setShareUrl(data.shareUrl);
      await navigator.clipboard.writeText(data.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Share error:', err);
      // Fallback to current URL
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setShareLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-sans">Loading your chart...</p>
        </div>
      </main>
    );
  }

  if (error || !chart) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || 'Chart not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chart/generate">
              <Button className="w-full">Generate New Chart</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const chartData = chart.chart_data;
  if (!chartData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Invalid Chart Data</CardTitle>
            <CardDescription>The chart data is missing or corrupted.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chart/generate">
              <Button className="w-full">Generate New Chart</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const typeInfo = TYPE_INFO[chart.type as keyof typeof TYPE_INFO] || TYPE_INFO['Generator'];
  const activeGates = getActiveGates(chartData.personality, chartData.design);
  const activeChannels = getActiveChannels(chartData.channels);
  const definedCenters = chartData.definedCenters || [];
  const undefinedCenters = CENTER_CONFIG.map(c => c.id).filter(id => !definedCenters.includes(id));

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary via-white to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Back Home</span>
          </Link>

          <h1 className="font-accent text-xl text-accent">Total Human Design</h1>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            disabled={shareLoading}
            className="flex items-center gap-2"
          >
            {shareLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Creating...</span>
              </>
            ) : copied ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="hidden sm:inline text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">{shareUrl ? 'Copy Link' : 'Share'}</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Chart Header with Birth Info */}
        <div className="text-center mb-8">
          <p className="font-accent text-lg text-accent mb-2">Your Human Design Chart</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(chart.birth_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {chart.birth_time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {chart.birth_location}
            </span>
          </div>
        </div>

        {/* Main Three-Column Layout */}
        <div className="grid lg:grid-cols-[280px_1fr_280px] gap-6 mb-8">
          {/* Design Column (Left) */}
          <div className="order-2 lg:order-1">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  Design (Unconscious)
                </CardTitle>
                <CardDescription className="text-xs">88 days before birth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {PLANET_ORDER.map(planet => {
                  const activation = chartData.design[planet as keyof ChartActivations];
                  if (!activation) return null;
                  return (
                    <div key={`design-${planet}`} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg w-6" title={planet}>{PLANET_GLYPHS[planet]}</span>
                        <span className="text-sm font-medium text-foreground">{planet}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{activation.gate}.{activation.line}</div>
                        <div className="flex gap-1 justify-end">
                          <Badge variant="outline" className="text-[10px] px-1 py-0">C{activation.color}</Badge>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">T{activation.tone}</Badge>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">B{activation.base}</Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Bodygraph Center */}
          <div className="order-1 lg:order-2">
            <Card className="bg-white/90 backdrop-blur">
              <CardContent className="p-4">
                <BodyGraphHDKit
                  personalityActivations={transformActivations(chartData.personality)}
                  designActivations={transformActivations(chartData.design)}
                  activationsToShow="all"
                  className="mx-auto"
                />
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#1A1A1A]" />
                    <span>Personality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <span>Design</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personality Column (Right) */}
          <div className="order-3">
            <Card className="bg-foreground/5 border-foreground/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1A1A1A]" />
                  Personality (Conscious)
                </CardTitle>
                <CardDescription className="text-xs">At time of birth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {PLANET_ORDER.map(planet => {
                  const activation = chartData.personality[planet as keyof ChartActivations];
                  if (!activation) return null;
                  return (
                    <div key={`pers-${planet}`} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg w-6" title={planet}>{PLANET_GLYPHS[planet]}</span>
                        <span className="text-sm font-medium text-foreground">{planet}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{activation.gate}.{activation.line}</div>
                        <div className="flex gap-1 justify-end">
                          <Badge variant="outline" className="text-[10px] px-1 py-0">C{activation.color}</Badge>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">T{activation.tone}</Badge>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">B{activation.base}</Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Type Card */}
          <Card className="bg-gradient-to-br from-white to-secondary">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardDescription className="text-xs">Energy Type</CardDescription>
                  <CardTitle className="text-lg text-primary">{chart.type}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 text-sm text-muted-foreground">
              <p><strong>Strategy:</strong> {typeInfo.strategy}</p>
              <p><strong>Signature:</strong> {typeInfo.signature}</p>
            </CardContent>
          </Card>

          {/* Authority Card */}
          <Card className="bg-gradient-to-br from-white to-secondary">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardDescription className="text-xs">Authority</CardDescription>
                  <CardTitle className="text-lg text-primary">{chart.authority}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 text-sm text-muted-foreground">
              <p>{AUTHORITY_INFO[chart.authority]?.description || 'Your decision-making guide'}</p>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-white to-secondary">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardDescription className="text-xs">Profile</CardDescription>
                  <CardTitle className="text-lg text-primary">{chart.profile}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 text-sm text-muted-foreground">
              <p>{PROFILE_INFO[chart.profile]?.name || chartData.profileName}</p>
              <p className="text-xs mt-1">{PROFILE_INFO[chart.profile]?.theme}</p>
            </CardContent>
          </Card>

          {/* Incarnation Cross Card */}
          <Card className="bg-gradient-to-br from-white to-secondary">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardDescription className="text-xs">Incarnation Cross</CardDescription>
                  <CardTitle className="text-base text-primary leading-tight">{chart.incarnation_cross}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 text-sm text-muted-foreground">
              <p>Your life purpose and theme</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content Sections */}
        <Card className="bg-white/90 backdrop-blur">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto flex-wrap">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
                <Target className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="centers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
                <CircleDot className="w-4 h-4 mr-2" />
                Centers
              </TabsTrigger>
              <TabsTrigger value="channels" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
                <Layers className="w-4 h-4 mr-2" />
                Channels
              </TabsTrigger>
              <TabsTrigger value="gates" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
                <Users className="w-4 h-4 mr-2" />
                Gates
              </TabsTrigger>
              <TabsTrigger value="variables" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
                <Brain className="w-4 h-4 mr-2" />
                Variables & PHS
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Your Design at a Glance
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Definition</p>
                        <p className="font-semibold text-primary">{chart.definition}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chart.definition === 'Single' && 'All your defined centers are connected'}
                          {chart.definition === 'Split' && 'Two separate areas of definition'}
                          {chart.definition === 'Triple Split' && 'Three separate areas of definition'}
                          {chart.definition === 'Quadruple Split' && 'Four separate areas of definition'}
                          {chart.definition === 'None' && 'No defined centers (Reflector)'}
                        </p>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Not-Self Theme</p>
                        <p className="font-semibold text-primary">{chartData.notSelfTheme || typeInfo.notSelfTheme}</p>
                        <p className="text-xs text-muted-foreground mt-1">What you experience when not living correctly</p>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Signature</p>
                        <p className="font-semibold text-primary">{chartData.signature || typeInfo.signature}</p>
                        <p className="text-xs text-muted-foreground mt-1">What you experience when living correctly</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-primary">Strategy in Action</h3>
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm text-foreground leading-relaxed">
                        As a <strong>{chart.type}</strong>, your strategy is to <strong>{typeInfo.strategy.toLowerCase()}</strong>.
                        When you follow this strategy, you will experience <strong>{typeInfo.signature.toLowerCase()}</strong>.
                        When you don&apos;t, you&apos;ll feel <strong>{typeInfo.notSelfTheme.toLowerCase()}</strong>.
                      </p>
                    </div>
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm font-medium text-primary mb-2">Making Decisions</p>
                      <p className="text-sm text-foreground leading-relaxed">
                        Your {chart.authority} authority means: {AUTHORITY_INFO[chart.authority]?.strategy || 'Trust your inner knowing.'}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Centers Tab */}
              <TabsContent value="centers" className="mt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      Defined Centers ({definedCenters.length})
                    </h4>
                    <div className="space-y-3">
                      {definedCenters.map(centerId => {
                        const center = CENTER_CONFIG.find(c => c.id === centerId);
                        if (!center) return null;
                        return (
                          <div key={centerId} className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                            <p className="font-medium text-primary">{center.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{center.theme}</p>
                            <p className="text-xs text-foreground/60 mt-2">
                              Gates: {center.gates.filter(g => activeGates.some(ag => ag.gate === g)).join(', ') || 'None activated'}
                            </p>
                          </div>
                        );
                      })}
                      {definedCenters.length === 0 && (
                        <p className="text-sm text-muted-foreground">No defined centers</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-muted-foreground" />
                      Open Centers ({undefinedCenters.length})
                    </h4>
                    <div className="space-y-3">
                      {undefinedCenters.map(centerId => {
                        const center = CENTER_CONFIG.find(c => c.id === centerId);
                        if (!center) return null;
                        return (
                          <div key={centerId} className="p-4 bg-muted/30 rounded-lg border border-border">
                            <p className="font-medium text-foreground">{center.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{center.theme}</p>
                            <p className="text-xs text-destructive/80 mt-2">
                              Not-Self: {center.notSelfTheme}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Channels Tab */}
              <TabsContent value="channels" className="mt-0">
                {activeChannels.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No complete channels defined.</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeChannels.map((channel) => (
                      <div key={`${channel.gates[0]}-${channel.gates[1]}`} className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-accent/20 text-accent">
                            {channel.gates[0]}-{channel.gates[1]}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {channel.type}
                          </Badge>
                        </div>
                        <p className="font-medium text-primary">The Channel of {channel.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {GATE_NAMES[channel.gates[0]]} — {GATE_NAMES[channel.gates[1]]}
                        </p>
                        <p className="text-xs text-foreground/60 mt-2">
                          {channel.circuit} Circuit
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Gates Tab */}
              <TabsContent value="gates" className="mt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#1A1A1A]" />
                      Personality Gates (Conscious)
                    </h4>
                    <div className="space-y-2">
                      {activeGates.filter(g => g.type === 'personality' || g.type === 'both').map(g => (
                        <div key={`p-${g.gate}-${g.planet}`} className="p-3 bg-secondary/50 rounded-lg border border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-primary">Gate {g.gate}.{g.line}</span>
                              <p className="text-sm text-muted-foreground">{GATE_NAMES[g.gate]}</p>
                              <p className="text-xs text-foreground/60">{GATE_KEYWORDS[g.gate]}</p>
                            </div>
                            <span className="text-lg" title={g.planet}>{PLANET_GLYPHS[g.planet]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      Design Gates (Unconscious)
                    </h4>
                    <div className="space-y-2">
                      {activeGates.filter(g => g.type === 'design' || g.type === 'both').map(g => (
                        <div key={`d-${g.gate}-${g.planet}`} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-primary">Gate {g.gate}.{g.line}</span>
                              <p className="text-sm text-muted-foreground">{GATE_NAMES[g.gate]}</p>
                              <p className="text-xs text-foreground/60">{GATE_KEYWORDS[g.gate]}</p>
                            </div>
                            <span className="text-lg" title={g.planet}>{PLANET_GLYPHS[g.planet]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Variables & PHS Tab */}
              <TabsContent value="variables" className="mt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Variable Type */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-primary">Variable Type</h3>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="font-mono text-2xl text-center text-accent mb-2">
                        {chartData.variableType || 'Not Available'}
                      </p>
                      <p className="text-xs text-muted-foreground text-center">
                        Your cognitive architecture (4 arrows)
                      </p>
                    </div>
                  </div>

                  {/* PHS - Digestion & Environment */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-primary">Primary Health System (PHS)</h3>
                    {chartData.phs ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Digestion</p>
                          <p className="font-medium text-primary">{chartData.phs.digestion}</p>
                          <p className="text-xs text-foreground/60">Tone: {chartData.phs.digestionTone}</p>
                        </div>
                        <div className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Environment</p>
                          <p className="font-medium text-primary">{chartData.phs.environment}</p>
                          <p className="text-xs text-foreground/60">Tone: {chartData.phs.environmentalTone}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">PHS data not available</p>
                    )}
                  </div>

                  {/* Rave Psychology - Motivation & Perspective */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-semibold text-primary">Rave Psychology</h3>
                    {chartData.ravePsychology ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Motivation</p>
                          <p className="font-medium text-primary">{chartData.ravePsychology.motivation}</p>
                          <p className="text-xs text-foreground/60">Tone: {chartData.ravePsychology.motivationTone}</p>
                        </div>
                        <div className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Transferred</p>
                          <p className="font-medium text-muted-foreground">-</p>
                        </div>
                        <div className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Perspective</p>
                          <p className="font-medium text-primary">{chartData.ravePsychology.perspective}</p>
                          <p className="text-xs text-foreground/60">Tone: {chartData.ravePsychology.perspectiveTone}</p>
                        </div>
                        <div className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Distracted</p>
                          <p className="font-medium text-muted-foreground">-</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Rave Psychology data not available</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/chart/generate">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Edit Birth Data
            </Button>
          </Link>
          <Button onClick={handleShare} disabled={shareLoading} size="lg" className="bg-accent hover:bg-accent/90">
            {shareLoading ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {shareLoading ? 'Creating Link...' : copied ? 'Link Copied!' : shareUrl ? 'Copy Share Link' : 'Share Chart'}
          </Button>
          {shareUrl && viewCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {viewCount} {viewCount === 1 ? 'view' : 'views'}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-12 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Total Human Design. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}