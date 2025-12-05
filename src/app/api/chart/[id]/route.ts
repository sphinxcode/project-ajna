import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to view charts' },
        { status: 401 }
      );
    }

    // Fetch chart by ID
    const { data: chart, error: dbError } = await supabase
      .from('charts')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !chart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    // Ensure user owns this chart
    if (chart.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to view this chart' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      chart
    });

  } catch (error) {
    console.error('Chart fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching your chart' },
      { status: 500 }
    );
  }
}
