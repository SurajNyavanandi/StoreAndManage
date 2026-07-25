import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    trim: true,
    default: ''
  },
  brand: {
    type: String,
    trim: true,
    default: 'ViratTOM'
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Out of Stock'],
    default: 'Active'
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    enum: ['kids', 'mens', 'womens', 'accessories', 'footwear'],
    required: true
  },
  subcategory: {
    type: String,
    enum: ['shirt', 'tshirt', 'pants', 'kurti', 'saree', 'frock', 'kurta', 'accessories', 'shoes', 'top'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 10
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  salesCount: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
