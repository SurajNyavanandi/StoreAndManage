import Product from '../models/product.js';
import mongoose from 'mongoose';

let sampleProducts = [
  // Kids
  { _id: 'k1', name: 'Kids Basic Tee', sku: 'KID-TEE-01', brand: 'MiniVirat', status: 'Active', price: 399, originalPrice: 499, category: 'kids', subcategory: 'tshirt', image: 'https://media.istockphoto.com/id/499599404/photo/pensive-preschool-boy-against-the-white.jpg?s=2048x2048&w=is&k=20&c=8rwwvmsw8qO6Teog7_DGuYI7PbDH26qbhk9EA8ugXHE=', description: 'Comfortable cotton basic tee for kids', stock: 25, rating: 4.5, salesCount: 120, reviews: [{ _id: 'r1', userName: 'Ananya S.', rating: 5, comment: 'Very soft fabric for kids!', createdAt: new Date() }] },
  { _id: 'k2', name: 'Kids Casual Shirt', sku: 'KID-SHT-02', brand: 'MiniVirat', status: 'Active', price: 499, originalPrice: 699, category: 'kids', subcategory: 'shirt', image: 'https://media.istockphoto.com/id/505082791/photo/confident-little-boy.jpg?s=2048x2048&w=is&k=20&c=xrL1ClLJQNT1sd7cUdCF5zhO2CLdOk6JtGA8QlcQs54=', description: 'Stylish casual buttoned shirt for boys', stock: 4, rating: 4.2, salesCount: 85, reviews: [] },
  { _id: 'k3', name: 'Kids Cool Tee', sku: 'KID-TEE-03', brand: 'UrbanKid', status: 'Active', price: 599, originalPrice: 799, category: 'kids', subcategory: 'tshirt', image: 'https://media.istockphoto.com/id/1296361252/photo/child-boy-modern-stock-photo.jpg?s=612x612&w=0&k=20&c=cXbTqHoULAbq_cWtWQyC4nArlBVR0VqN-txecZ5cJbA=', description: 'Modern graphic print cool tee', stock: 30, rating: 4.8, salesCount: 210, reviews: [] },
  { _id: 'k4', name: 'Kids Art Tee', sku: 'KID-TEE-04', brand: 'MiniVirat', status: 'Draft', price: 649, originalPrice: 899, category: 'kids', subcategory: 'tshirt', image: 'https://media.istockphoto.com/id/1205448553/photo/portrait-of-a-smiling-cute-little-boy.jpg?s=612x612&w=0&k=20&c=2jxOPbbOOMfGLuEOG_Vx9ixVyW0s7QL0dMSuJPMoyZs=', description: 'Vibrant artistic patterned t-shirt', stock: 0, rating: 4.6, salesCount: 45, reviews: [] },

  // Mens
  { _id: 'm1', name: 'Mens Basic Tee', sku: 'MEN-TEE-01', brand: 'ViratTOM', status: 'Active', price: 499, originalPrice: 699, category: 'mens', subcategory: 'tshirt', image: 'https://images.unsplash.com/photo-1740711152088-88a009e877bb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Essential everyday cotton crew neck t-shirt', stock: 40, rating: 4.7, salesCount: 350, reviews: [{ _id: 'r2', userName: 'Rahul V.', rating: 5, comment: 'Great fitting and durable material.', createdAt: new Date() }] },
  { _id: 'm2', name: 'Mens Casual Shirt', sku: 'MEN-SHT-02', brand: 'ViratTOM', status: 'Active', price: 899, originalPrice: 1299, category: 'mens', subcategory: 'shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Relaxed fit casual linen blend shirt', stock: 3, rating: 4.4, salesCount: 190, reviews: [] },
  { _id: 'm3', name: 'Mens Premium Tee', sku: 'MEN-TEE-03', brand: 'ApexCraft', status: 'Active', price: 799, originalPrice: 999, category: 'mens', subcategory: 'tshirt', image: 'https://media.istockphoto.com/id/1326852382/photo/portrait-of-smiling-young-man-in-green-workwear-shirt-isolated-on-gray-background.jpg?s=2048x2048&w=is&k=20&c=-eD2SdzFwLBQz1tpF4IMbLmmCy1LSXJz-KRourxqa2o=', description: 'Premium heavyweight cotton tee', stock: 35, rating: 4.9, salesCount: 410, reviews: [] },
  { _id: 'm4', name: 'Mens Art Denim Shirt', sku: 'MEN-SHT-04', brand: 'ApexCraft', status: 'Active', price: 1149, originalPrice: 1599, category: 'mens', subcategory: 'shirt', image: 'https://media.istockphoto.com/id/526917707/photo/denim-shirt.jpg?s=1024x1024&w=is&k=20&c=IepC-UZVJoRFAYILK_sV88o5zfewUDJLuTP2puuowKo=', description: 'Classic denim workwear shirt', stock: 12, rating: 4.3, salesCount: 160, reviews: [] },

  // Womens
  { _id: 'w1', name: 'Womens Traditional Lehenga', sku: 'WOM-ETH-01', brand: 'RoyalElegance', status: 'Active', price: 1599, originalPrice: 2499, category: 'womens', subcategory: 'saree', image: 'https://media.istockphoto.com/id/497274028/photo/woman-in-bright-red-lehenga-choli.jpg?s=2048x2048&w=is&k=20&c=BrK7ppTY5U33cOKQiZdfj0L3wugvqNxtB4Qpa8Wr8ck=', description: 'Elegant traditional red festival wear', stock: 20, rating: 4.8, salesCount: 280, reviews: [{ _id: 'r3', userName: 'Priya M.', rating: 5, comment: 'Stunning design and fast shipping!', createdAt: new Date() }] },
  { _id: 'w2', name: 'Womens Festive Yellow Top', sku: 'WOM-TOP-02', brand: 'RoyalElegance', status: 'Active', price: 699, originalPrice: 999, category: 'womens', subcategory: 'top', image: 'https://media.istockphoto.com/id/1278316420/photo/young-woman-diwali-celebrate-stock-photo.jpg?s=2048x2048&w=is&k=20&c=Uxv7h_cACLbINX3U7t76y5-cc6wOYrphDKe0YxNFfm4=', description: 'Festive yellow celebration top', stock: 2, rating: 4.6, salesCount: 140, reviews: [] },
  { _id: 'w3', name: 'Womens Vibrant Tee', sku: 'WOM-TEE-03', brand: 'ViratTOM', status: 'Active', price: 799, originalPrice: 1099, category: 'womens', subcategory: 'tshirt', image: 'https://media.istockphoto.com/id/2155405667/photo/portrait-of-a-smiling-young-woman-looking-at-the-camera-on-a-colourful-background.jpg?s=2048x2048&w=is&k=20&c=smmXLU2Izh94k2NkUmj0wJAMk7-h2VRmuy4f8udhEB0=', description: 'Vibrant casual soft-touch t-shirt', stock: 28, rating: 4.7, salesCount: 310, reviews: [] },
  { _id: 'w4', name: 'Womens Chic Portrait Series Top', sku: 'WOM-TOP-04', brand: 'RoyalElegance', status: 'Active', price: 849, originalPrice: 1199, category: 'womens', subcategory: 'top', image: 'https://media.istockphoto.com/id/2150393050/photo/portrait-of-a-young-woman-sitting-on-a-stool-on-a-coloured-background.jpg?s=2048x2048&w=is&k=20&c=_ZVtaEuWsRuq0rdbgrXfqChr5zKwzH6Vp4KFmg8g9vQ=', description: 'Modern chic portrait series top', stock: 19, rating: 4.5, salesCount: 220, reviews: [] }
];

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, sku, brand, status, description, price, originalPrice, category, subcategory, image, stock, rating } = req.body;

    if (!name || !description || !price || !category || !subcategory || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: name, description, price, category, subcategory, image'
      });
    }

    const computedSku = sku || `${category.toUpperCase().slice(0, 3)}-PROD-${Date.now().toString().slice(-4)}`;

    if (mongoose.connection.readyState === 1) {
      const product = new Product({
        name,
        sku: computedSku,
        brand: brand || 'ViratTOM',
        status: status || 'Active',
        description,
        price,
        originalPrice: originalPrice || price,
        category,
        subcategory,
        image,
        stock: Number(stock) || 0,
        rating: Number(rating) || 4.5
      });
      await product.save();
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    }

    const newProd = {
      _id: 'p_' + Date.now(),
      name,
      sku: computedSku,
      brand: brand || 'ViratTOM',
      status: status || 'Active',
      description,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      category,
      subcategory,
      image,
      stock: Number(stock) || 10,
      rating: Number(rating) || 4.5,
      salesCount: 0,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    sampleProducts.unshift(newProd);
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProd
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all products with search, filters, pagination & sorting
export const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, search, brand, status, minPrice, maxPrice, stockStatus, sort, page = 1, limit = 50 } = req.query;

    let filter = {};
    if (category) filter.category = category.toLowerCase();
    if (subcategory) filter.subcategory = subcategory.toLowerCase();
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (status) filter.status = status;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (stockStatus) {
      if (stockStatus === 'in_stock') filter.stock = { $gt: 5 };
      if (stockStatus === 'low_stock') filter.stock = { $gt: 0, $lte: 5 };
      if (stockStatus === 'out_of_stock') filter.stock = 0;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    let products = [];
    if (mongoose.connection.readyState === 1) {
      try {
        let query = Product.find(filter);
        if (sort === 'price_asc') query = query.sort({ price: 1 });
        else if (sort === 'price_desc') query = query.sort({ price: -1 });
        else if (sort === 'rating') query = query.sort({ rating: -1 });
        else if (sort === 'sales') query = query.sort({ salesCount: -1 });
        else query = query.sort({ createdAt: -1 });

        products = await query;
      } catch (err) {
        console.log('Database query notice:', err.message);
      }
    }

    if (!products || products.length === 0) {
      let filtered = [...sampleProducts];
      if (category) filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      if (subcategory) filtered = filtered.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
      if (brand) filtered = filtered.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
      if (status) filtered = filtered.filter(p => p.status === status);
      if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
      if (stockStatus === 'in_stock') filtered = filtered.filter(p => p.stock > 5);
      if (stockStatus === 'low_stock') filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
      if (stockStatus === 'out_of_stock') filtered = filtered.filter(p => p.stock === 0);

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else if (sort === 'sales') filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

      products = filtered;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      count: products.length,
      page: pageNum,
      totalPages: Math.ceil(products.length / limitNum) || 1,
      data: paginatedProducts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(id);
      if (product) {
        return res.status(200).json({ success: true, data: product });
      }
    }

    const product = sampleProducts.find(p => String(p._id) === String(id));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (product) {
        return res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
      }
    }

    const index = sampleProducts.findIndex(p => String(p._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    sampleProducts[index] = { ...sampleProducts[index], ...updates };
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: sampleProducts[index]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndDelete(id);
      if (product) {
        return res.status(200).json({ success: true, message: 'Product deleted successfully', data: product });
      }
    }

    const index = sampleProducts.findIndex(p => String(p._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deleted = sampleProducts.splice(index, 1)[0];
    return res.status(200).json({ success: true, message: 'Product deleted successfully', data: deleted });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Duplicate product
export const duplicateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let original = null;

    if (mongoose.connection.readyState === 1) {
      original = await Product.findById(id);
    }
    if (!original) {
      original = sampleProducts.find(p => String(p._id) === String(id));
    }

    if (!original) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const copyData = {
      name: `${original.name} (Copy)`,
      sku: `${original.sku || 'SKU'}-COPY-${Date.now().toString().slice(-4)}`,
      brand: original.brand || 'ViratTOM',
      status: 'Draft',
      description: original.description,
      price: original.price,
      originalPrice: original.originalPrice || original.price,
      category: original.category,
      subcategory: original.subcategory,
      image: original.image,
      stock: original.stock || 10,
      rating: original.rating || 4.5,
      salesCount: 0,
      reviews: []
    };

    if (mongoose.connection.readyState === 1) {
      const newProd = new Product(copyData);
      await newProd.save();
      return res.status(201).json({ success: true, message: 'Product duplicated successfully', data: newProd });
    }

    const newProd = { _id: 'p_' + Date.now(), ...copyData, createdAt: new Date(), updatedAt: new Date() };
    sampleProducts.unshift(newProd);
    return res.status(201).json({ success: true, message: 'Product duplicated successfully', data: newProd });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Bulk Actions (delete or status update)
export const bulkProductAction = async (req, res) => {
  try {
    const { ids, action, status } = req.body; // action = 'delete' | 'updateStatus'

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No product IDs provided' });
    }

    if (action === 'delete') {
      if (mongoose.connection.readyState === 1) {
        await Product.deleteMany({ _id: { $in: ids } });
      }
      sampleProducts = sampleProducts.filter(p => !ids.includes(String(p._id)));
      return res.status(200).json({ success: true, message: `Successfully deleted ${ids.length} products` });
    }

    if (action === 'updateStatus' && status) {
      if (mongoose.connection.readyState === 1) {
        await Product.updateMany({ _id: { $in: ids } }, { status, updatedAt: new Date() });
      }
      sampleProducts = sampleProducts.map(p => ids.includes(String(p._id)) ? { ...p, status, updatedAt: new Date() } : p);
      return res.status(200).json({ success: true, message: `Updated status for ${ids.length} products to ${status}` });
    }

    return res.status(400).json({ success: false, message: 'Invalid bulk action' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Add product review
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;

    if (!userName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name, rating, and comment' });
    }

    const newReview = { _id: 'r_' + Date.now(), userName, rating: Number(rating), comment, createdAt: new Date() };

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(id);
      if (product) {
        product.reviews.push(newReview);
        const avg = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
        product.rating = Math.round(avg * 10) / 10;
        await product.save();
        return res.status(200).json({ success: true, message: 'Review added successfully', data: product });
      }
    }

    const product = sampleProducts.find(p => String(p._id) === String(id));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.reviews = product.reviews || [];
    product.reviews.push(newReview);
    const avg = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    product.rating = Math.round(avg * 10) / 10;

    return res.status(200).json({ success: true, message: 'Review added successfully', data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  return getAllProducts(req, res);
};
