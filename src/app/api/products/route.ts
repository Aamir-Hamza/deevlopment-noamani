import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    let query: any = {};

    if (page) {
      query = { assignedPages: { $in: [page] } };
      console.log(`Backend: Filtering products for page: ${page}`);
      console.log(`Backend: Using query: ${JSON.stringify(query)}`);
    }

    const products = await Product.find(query);
    console.log(`Backend: Found ${products.length} products.`);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Backend: Failed to fetch products:", error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Backend: Received POST request for product:", body);
    await connectDB();
    // Ensure galleryImages is always an array of strings
    const galleryImages = Array.isArray(body.galleryImages) ? body.galleryImages.filter((x: string) => typeof x === 'string') : [];
    const product = await Product.create({ ...body, galleryImages });
    console.log("Backend: Product created successfully:", product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Backend: Failed to create product:", error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 