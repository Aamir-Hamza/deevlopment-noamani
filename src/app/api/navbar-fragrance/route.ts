import { NextRequest, NextResponse } from 'next/server';

let navbarFragrance = [
  { id: '1', name: 'AMBER MUSK', slug: 'amber-musk' },
  { id: '2', name: 'CITRUS BLOOM', slug: 'citrus-bloom' },
];

export async function GET() {
  return NextResponse.json(navbarFragrance);
}

export async function POST(req: NextRequest) {
  const { name, slug } = await req.json();
  const id = Date.now().toString();
  navbarFragrance.push({ id, name, slug });
  return NextResponse.json({ success: true, id });
}

export async function PUT(req: NextRequest) {
  const { id, name, slug } = await req.json();
  navbarFragrance = navbarFragrance.map((item) =>
    item.id === id ? { ...item, name, slug } : item
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  navbarFragrance = navbarFragrance.filter((item) => item.id !== id);
  return NextResponse.json({ success: true });
} 