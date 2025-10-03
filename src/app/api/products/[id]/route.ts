import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { products } from '@/data/products';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let product = null;

  try {
    await connectDB();

    // Try by MongoDB _id
    product = await Product.findById(id);

    // If not found, try by slug
    if (!product) {
      product = await Product.findOne({ slug: id });
    }
  } catch (err) {
    // Ignore DB errors, fallback to local array
  }

  // If still not found, try local products array
  if (!product) {
    product = products.find((p) => p.slug === id);
  }

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectDB();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { ...body, galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages.filter((x: string) => typeof x === 'string') : [] } },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
