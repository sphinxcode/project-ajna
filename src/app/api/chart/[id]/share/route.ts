import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chartId } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to share charts' },
        { status: 401 }
      );
    }

    // Verify user owns this chart
    const { data: chart, error: chartError } = await supabase
      .from('charts')
      .select('id, user_id')
      .eq('id', chartId)
      .single();

    if (chartError || !chart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    if (chart.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to share this chart' },
        { status: 403 }
      );
    }

    // Check if a share token already exists for this chart
    const { data: existingShare } = await supabase
      .from('shared_charts')
      .select('share_token, is_active')
      .eq('chart_id', chartId)
      .eq('is_active', true)
      .single();

    if (existingShare) {
      // Return existing share token
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shared/${existingShare.share_token}`;
      return NextResponse.json({
        success: true,
        shareToken: existingShare.share_token,
        shareUrl,
        isExisting: true
      });
    }

    // Generate a new share token
    const shareToken = randomBytes(16).toString('hex');

    // Create share entry
    const { error: insertError } = await supabase
      .from('shared_charts')
      .insert({
        chart_id: chartId,
        share_token: shareToken,
        is_active: true,
        view_count: 0
      });

    if (insertError) {
      console.error('Share insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      );
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shared/${shareToken}`;

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl,
      isExisting: false
    });

  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating share link' },
      { status: 500 }
    );
  }
}

// Get share status for a chart
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chartId } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    // Verify user owns this chart
    const { data: chart, error: chartError } = await supabase
      .from('charts')
      .select('id, user_id')
      .eq('id', chartId)
      .single();

    if (chartError || !chart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    if (chart.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to view this chart' },
        { status: 403 }
      );
    }

    // Get share info
    const { data: shareData } = await supabase
      .from('shared_charts')
      .select('share_token, is_active, view_count, created_at')
      .eq('chart_id', chartId)
      .eq('is_active', true)
      .single();

    if (!shareData) {
      return NextResponse.json({
        success: true,
        isShared: false
      });
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shared/${shareData.share_token}`;

    return NextResponse.json({
      success: true,
      isShared: true,
      shareToken: shareData.share_token,
      shareUrl,
      viewCount: shareData.view_count,
      createdAt: shareData.created_at
    });

  } catch (error) {
    console.error('Get share error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

// Delete/deactivate share link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chartId } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    // Verify user owns this chart
    const { data: chart, error: chartError } = await supabase
      .from('charts')
      .select('id, user_id')
      .eq('id', chartId)
      .single();

    if (chartError || !chart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    if (chart.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to modify this chart' },
        { status: 403 }
      );
    }

    // Deactivate share link
    const { error: updateError } = await supabase
      .from('shared_charts')
      .update({ is_active: false })
      .eq('chart_id', chartId);

    if (updateError) {
      console.error('Share deactivate error:', updateError);
      return NextResponse.json(
        { error: 'Failed to remove share link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Share link removed'
    });

  } catch (error) {
    console.error('Delete share error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
