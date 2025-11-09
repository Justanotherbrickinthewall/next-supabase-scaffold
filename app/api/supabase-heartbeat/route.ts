import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if the Project table exists and has the required columns
    const { data, error } = await supabase
      .from('Project')
      .select('name, description')
      .limit(1);

    if (error) {
      // If the error is about the table not existing, return false
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json({ success: false }, { status: 200 });
      }
      // For other errors, still return false
      return NextResponse.json({ success: false }, { status: 200 });
    }

    // If we can query the table with those columns, it exists and has the right structure
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Catch any unexpected errors
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

