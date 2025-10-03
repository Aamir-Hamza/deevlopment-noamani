import { NextRequest, NextResponse } from 'next/server';

let navbarProducts = [
  { id: '1', name: 'ROSE SAFFRON', slug: 'rose-saffron' },
  { id: '2', name: 'PIMENTO', slug: 'pimento' },
  { id: '3', name: 'RESIN', slug: 'resin' },
  { id: '4', name: 'OCEAN BREEZE', slug: 'ocean-breeze' },
];

export async function GET() {
  return NextResponse.json(navbarProducts);
}

export async function POST(req: NextRequest) {
  const { name, slug } = await req.json();
  const id = Date.now().toString();
  navbarProducts.push({ id, name, slug });
  return NextResponse.json({ success: true, id });
}

export async function PUT(req: NextRequest) {
  const { id, name, slug } = await req.json();
  navbarProducts = navbarProducts.map((item) =>
    item.id === id ? { ...item, name, slug } : item
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  navbarProducts = navbarProducts.filter((item) => item.id !== id);
  return NextResponse.json({ success: true });
} 