import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { recreationsCatalogue } from '@/data/recreationsCatalogue';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  let product = null;

  // First get the catalogue product to use its name for matching
  const catalogueProduct = recreationsCatalogue.find(p => p.slug === slug);
  
  if (!catalogueProduct) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }

  try {
    await connectDB();

    console.log('Searching for product with slug:', slug);
    console.log('Catalogue product name:', catalogueProduct.name);

    // First try to find by slug if it exists
    product = await Product.findOne({ slug: slug });
    console.log('Search by slug result:', product ? 'Found' : 'Not found');

    // If not found by slug, try by exact name match with recreations category
    if (!product) {
      product = await Product.findOne({ 
        name: { $regex: new RegExp(`^${catalogueProduct.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        category: { $regex: /recreations/i }
      });
      console.log('Search by exact name result:', product ? 'Found' : 'Not found');
    }

    // If not found, try by name matching (partial)
    if (!product) {
      product = await Product.findOne({ 
        name: { $regex: new RegExp(catalogueProduct.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        category: { $regex: /recreations/i }
      });
      console.log('Search by partial name result:', product ? 'Found' : 'Not found');
    }

    // If still not found, try without category filter (in case category is different)
    if (!product) {
      product = await Product.findOne({ 
        name: { $regex: new RegExp(catalogueProduct.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
      });
      console.log('Search by name without category filter result:', product ? 'Found' : 'Not found');
    }

    // If still not found, try searching by any product that might match (for debugging)
    if (!product) {
      // Try to find any product with similar name (case-insensitive partial match)
      const allProducts = await Product.find({});
      console.log('All products in database:', allProducts.map(p => ({ 
        _id: p._id, 
        name: p.name, 
        category: p.category, 
        price: p.price,
        slug: p.slug 
      })));
      
      // Try fuzzy matching - check if any product name contains the catalogue name or vice versa
      product = allProducts.find(p => {
        const pName = p.name.toLowerCase().trim();
        const catName = catalogueProduct.name.toLowerCase().trim();
        return pName === catName || 
               pName.includes(catName) || 
               catName.includes(pName) ||
               (p.slug && p.slug === slug);
      });
      console.log('Fuzzy match result:', product ? `Found: ${product.name} (Price: ${product.price})` : 'Not found');
    }

    // If still not found, try partial name match
    if (!product) {
      const nameWords = catalogueProduct.name.split(/\s+/).filter(w => w.length > 2);
      if (nameWords.length > 0) {
        product = await Product.findOne({
          name: { $regex: new RegExp(nameWords[0], 'i') },
          category: { $regex: /recreations/i }
        });
        console.log('Search by first word result:', product ? 'Found' : 'Not found');
      }
    }

    // If found in database, merge with catalogue data
    if (product) {
      const productData = product.toObject();
      // Ensure price is a number and not converted
      const dbPrice = typeof productData.price === 'number' 
        ? productData.price 
        : Number(productData.price) || 0;
      
      console.log('Found product in database:', {
        name: productData.name,
        rawPrice: productData.price,
        priceType: typeof productData.price,
        dbPrice: dbPrice,
        category: productData.category,
        slug: productData.slug
      });
      
      const responseData = {
        ...productData,
        slug: slug,
        brand: catalogueProduct.brand,
        fragrances: catalogueProduct.fragrances,
        // Use database images if available, otherwise use catalogue images
        images: productData.galleryImages && productData.galleryImages.length > 0 
          ? productData.galleryImages 
          : (productData.image 
              ? [productData.image, ...(productData.galleryImages || [])]
              : catalogueProduct.images),
        inStock: productData.stock > 0,
        // CRITICAL: Always use raw database price - NO conversion, NO modification
        // This is the actual price stored in the database (e.g., 1200 for ₹1,200)
        price: dbPrice,
      };
      
      console.log('=== RETURNING PRODUCT DATA ===');
      console.log('Database Price (raw):', productData.price);
      console.log('Database Price (processed):', dbPrice);
      console.log('Returned Price:', responseData.price);
      console.log('Product Name:', productData.name);
      console.log('Product Category:', productData.category);
      console.log('============================');
      
      return NextResponse.json(responseData);
    } else {
      console.log('Product not found in database, using catalogue price:', catalogueProduct.price);
    }
  } catch (err) {
    console.error('Error fetching recreations product from database:', err);
  }

  // Fallback to catalogue if not found in database
  return NextResponse.json(catalogueProduct);
}

