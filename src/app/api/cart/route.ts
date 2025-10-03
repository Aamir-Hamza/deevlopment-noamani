import { NextResponse } from 'next/server';

// In-memory cart storage (this will reset on server restart)
let cartItems: any[] = [];

export async function GET() {
  return NextResponse.json({ items: cartItems });
}

export async function POST(request: Request) {
  const item = await request.json();
  
  const existingItemIndex = cartItems.findIndex(i => i.id === item.id);
  
  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += item.quantity || 1;
  } else {
    cartItems.push({ ...item, quantity: item.quantity || 1 });
  }

  return NextResponse.json({ items: cartItems });
}

export async function PUT(request: Request) {
  const { itemId, quantity } = await request.json();
  
  cartItems = cartItems.map(item =>
    item.id === itemId ? { ...item, quantity } : item
  );

  return NextResponse.json({ items: cartItems });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');
  
  if (itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
  } else {
    cartItems = [];
  }

  return NextResponse.json({ items: cartItems });
} 