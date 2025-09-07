import { NextRequest, NextResponse } from 'next/server';
import { unifiedThemeService } from '../../../../../lib/services/unified-theme-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await unifiedThemeService.activateTheme(params.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Theme activated successfully' 
    });
  } catch (error) {
    console.error('Theme activation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}