import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = await createClient();

    // Find the share record
    const { data: shareData, error: shareError } = await supabase
      .from('shared_charts')
      .select('chart_id, is_active, expires_at')
      .eq('share_token', token)
      .single();

    if (shareError || !shareData) {
      return NextResponse.json(
        { error: 'Shared chart not found' },
        { status: 404 }
      );
    }

    // Check if share is active
    if (!shareData.is_active) {
      return NextResponse.json(
        { error: 'This share link is no longer active' },
        { status: 410 }
      );
    }

    // Check if share has expired
    if (shareData.expires_at && new Date(shareData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This share link has expired' },
        { status: 410 }
      );
    }

    // Fetch the chart data (public access - no auth needed)
    const { data: chart, error: chartError } = await supabase
      .from('charts')
      .select('id, birth_date, birth_time, birth_location, type, authority, profile, incarnation_cross, definition, chart_data, created_at')
      .eq('id', shareData.chart_id)
      .single();

    if (chartError || !chart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    // Increment view count
    const { data: currentShare } = await supabase
      .from('shared_charts')
      .select('view_count')
      .eq('share_token', token)
      .single();

    if (currentShare) {
      await supabase
        .from('shared_charts')
        .update({ view_count: (currentShare.view_count || 0) + 1 })
        .eq('share_token', token);
    }

    return NextResponse.json({
      success: true,
      chart: {
        ...chart,
        user_id: null // Don't expose user_id for privacy
      }
    });

  } catch (error) {
    console.error('Shared chart fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the shared chart' },
      { status: 500 }
    );
  }
}
