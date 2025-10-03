import { NextRequest, NextResponse } from 'next/server';

let navbarBestsellers = [
  { id: '1', name: 'VELVET ORCHID', slug: 'velvet-orchid' },
  { id: '2', name: 'ROYAL OUD', slug: 'royal-oud' },
];

export async function GET() {
  return NextResponse.json(navbarBestsellers);
}

export async function POST(req: NextRequest) {
  const { name, slug } = await req.json();
  const id = Date.now().toString();
  navbarBestsellers.push({ id, name, slug });
  return NextResponse.json({ success: true, id });
}

export async function PUT(req: NextRequest) {
  const { id, name, slug } = await req.json();
  navbarBestsellers = navbarBestsellers.map((item) =>
    item.id === id ? { ...item, name, slug } : item
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  navbarBestsellers = navbarBestsellers.filter((item) => item.id !== id);
  return NextResponse.json({ success: true });
} 