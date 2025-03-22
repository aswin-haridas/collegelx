import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('approved', true);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase.from('items').insert([body]);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}