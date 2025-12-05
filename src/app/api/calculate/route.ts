import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BirthData, HDAPIResponse } from '@/types/humandesign';

const API_URL = process.env.HD_API_URL || 'https://humandesignmcp-production.up.railway.app';
const API_TOKEN = process.env.HD_API_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to generate a chart' },
        { status: 401 }
      );
    }

    const body: BirthData = await request.json();

    // Validate required fields
    if (!body.birthDate || !body.birthLocation) {
      return NextResponse.json(
        { error: 'Birth date and location are required' },
        { status: 400 }
      );
    }

    if (!body.birthTime) {
      return NextResponse.json(
        { error: 'Birth time is required for accurate chart calculation' },
        { status: 400 }
      );
    }

    // Call the Human Design API
    const apiResponse = await fetch(`${API_URL}/api/human-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        birthDate: body.birthDate,
        birthTime: body.birthTime,
        birthLocation: body.birthLocation,
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error('HD API Error:', errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to calculate chart. Please try again.' },
        { status: apiResponse.status }
      );
    }

    const apiResult: HDAPIResponse = await apiResponse.json();

    if (!apiResult.success || !apiResult.data) {
      return NextResponse.json(
        { error: apiResult.error || 'Failed to calculate chart' },
        { status: 400 }
      );
    }

    // Store chart in database
    const chartData = {
      user_id: user.id,
      is_primary: true,
      birth_date: body.birthDate,
      birth_time: body.birthTime,
      birth_location: body.birthLocation,
      birth_coordinates: apiResult.data.birthInfo?.coordinates || null,
      birth_timezone: apiResult.data.birthInfo?.timezone || null,
      type: apiResult.data.type,
      authority: apiResult.data.authority,
      profile: apiResult.data.profile,
      incarnation_cross: apiResult.data.incarnationCross,
      definition: determineDefinition(apiResult.data.channels || []),
      chart_data: apiResult.data,
      chart_needs_recalculation: false,
      chart_calculated_at: new Date().toISOString(),
    };

    // Upsert chart (update if exists, insert if not)
    const { data: chart, error: dbError } = await supabase
      .from('charts')
      .upsert(chartData, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return the chart data even if DB save fails
      return NextResponse.json({
        success: true,
        data: apiResult.data,
        saved: false,
        warning: 'Chart calculated but could not be saved to your account'
      });
    }

    return NextResponse.json({
      success: true,
      data: apiResult.data,
      chartId: chart.id,
      saved: true
    });

  } catch (error) {
    console.error('Calculate error:', error);
    return NextResponse.json(
      { error: 'An error occurred while calculating your chart' },
      { status: 500 }
    );
  }
}

// Determine definition type based on channels
function determineDefinition(channels: string[]): string {
  if (channels.length === 0) return 'None';

  // Map of which centers each channel connects
  const centersByChannel: Record<string, [string, string]> = {
    '1-8': ['g', 'throat'],
    '2-14': ['sacral', 'g'],
    '3-60': ['root', 'sacral'],
    '4-63': ['head', 'ajna'],
    '5-15': ['sacral', 'g'],
    '6-59': ['sacral', 'solar'],
    '7-31': ['g', 'throat'],
    '9-52': ['root', 'sacral'],
    '10-20': ['g', 'throat'],
    '10-34': ['g', 'sacral'],
    '10-57': ['g', 'spleen'],
    '11-56': ['ajna', 'throat'],
    '12-22': ['throat', 'solar'],
    '13-33': ['g', 'throat'],
    '16-48': ['spleen', 'throat'],
    '17-62': ['ajna', 'throat'],
    '18-58': ['root', 'spleen'],
    '19-49': ['root', 'solar'],
    '20-34': ['throat', 'sacral'],
    '20-57': ['throat', 'spleen'],
    '21-45': ['heart', 'throat'],
    '23-43': ['ajna', 'throat'],
    '24-61': ['head', 'ajna'],
    '25-51': ['heart', 'g'],
    '26-44': ['spleen', 'heart'],
    '27-50': ['sacral', 'spleen'],
    '28-38': ['spleen', 'root'],
    '29-46': ['sacral', 'g'],
    '30-41': ['root', 'solar'],
    '32-54': ['root', 'spleen'],
    '34-57': ['sacral', 'spleen'],
    '35-36': ['solar', 'throat'],
    '37-40': ['heart', 'solar'],
    '39-55': ['root', 'solar'],
    '42-53': ['root', 'sacral'],
    '47-64': ['head', 'ajna'],
  };

  // Build areas of definition using union-find
  const areasOfDefinition: string[][] = [[], [], [], []];

  channels.forEach((channel) => {
    const [gate1, gate2] = channel.split('-').map(Number);
    const channelKey = `${Math.min(gate1, gate2)}-${Math.max(gate1, gate2)}`;
    const centers = centersByChannel[channelKey];

    if (!centers) return;

    const connectedAreas: number[] = [];
    for (let i = 0; i < 4; i++) {
      if (centers.some((c) => areasOfDefinition[i].includes(c))) {
        connectedAreas.push(i);
      }
    }

    if (connectedAreas.length === 0) {
      for (let i = 0; i < 4; i++) {
        if (areasOfDefinition[i].length === 0) {
          areasOfDefinition[i] = [...centers];
          break;
        }
      }
    } else if (connectedAreas.length === 1) {
      const areaIndex = connectedAreas[0];
      areasOfDefinition[areaIndex] = [...new Set([...areasOfDefinition[areaIndex], ...centers])];
    } else {
      const primaryArea = connectedAreas[0];
      for (let i = 1; i < connectedAreas.length; i++) {
        const areaToMerge = connectedAreas[i];
        areasOfDefinition[primaryArea] = [
          ...new Set([...areasOfDefinition[primaryArea], ...areasOfDefinition[areaToMerge], ...centers])
        ];
        areasOfDefinition[areaToMerge] = [];
      }
      areasOfDefinition[primaryArea] = [...new Set([...areasOfDefinition[primaryArea], ...centers])];
    }
  });

  const nonEmptyCount = areasOfDefinition.filter(area => area.length > 0).length;

  if (nonEmptyCount === 0) return 'None';
  if (nonEmptyCount === 1) return 'Single';
  if (nonEmptyCount === 2) return 'Split';
  if (nonEmptyCount === 3) return 'Triple Split';
  return 'Quadruple Split';
}
