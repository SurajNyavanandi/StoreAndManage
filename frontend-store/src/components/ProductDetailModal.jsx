import React, { useState, useContext } from 'react';
import axios from 'axios';
import AppContext from '../services/AppContext';
import { FiX, FiStar, FiHeart, FiShoppingCart, FiCheck, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';

const ProductDetailModal = ({ product, onClose }) => {
  const { toggleWishlist, addToCart, addToast, fetchProducts, state } = useContext(AppContext);
  const [selectedSize, setSelectedSize] = useState('M');
  const [reviews, setReviews] = useState(product?.reviews || [
    { name: 'Rohan G.', rating: 5, comment: 'Excellent quality material, fits perfectly!', createdAt: '2 days ago' },
    { name: 'Priya M.', rating: 4, comment: 'Loved the fabric and fast shipping.', createdAt: '1 week ago' }
  ]);

  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!product) return null;

  const isWishlisted = state.wishlist?.some(item => item._id === product._id);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await axios.post(`/api/products/${product._id}/reviews`, {
        name: reviewerName,
        rating: Number(reviewRating),
        comment: reviewComment
      });

      if (res.data.success) {
        addToast('success', 'Review Added', 'Thank you for your rating!');
        setReviews([res.data.review, ...reviews]);
        setReviewerName('');
        setReviewComment('');
        fetchProducts();
      }
    } catch {
      // Local fallback
      const newRev = { name: reviewerName, rating: Number(reviewRating), comment: reviewComment, createdAt: 'Just now' };
      setReviews([newRev, ...reviews]);
      addToast('success', 'Review Added', 'Thank you for rating!');
      setReviewerName('');
      setReviewComment('');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">Product Information & Reviews</span>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Image Column */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                    isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:text-rose-500'
                  }`}
                >
                  <FiHeart size={20} className={isWishlisted ? 'fill-white' : ''} />
                </button>
              </div>

              {/* Promo Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
                <span>Use coupon <strong className="font-mono bg-emerald-200/80 px-1.5 py-0.5 rounded">WELCOME10</strong> for 10% OFF</span>
                <span className="font-bold text-emerald-700">Save More</span>
              </div>
            </div>

            {/* Right Product Details Column */}
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  Brand: {product.brand || 'UrbanStyle'} • Category: {product.category}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">{product.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FiStar key={star} size={16} className={star <= Math.round(product.rating || 4.5) ? 'fill-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{product.rating || 4.5}</span>
                  <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{product.description || 'Crafted with premium high-grade fabric for ultimate comfort and modern durability.'}</p>

              {/* Size Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-500">Select Sizing</span>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === sz
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => addToCart({ ...product, selectedSize })}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={18} /> Add to Cart ({selectedSize})
                </button>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5"><FiTruck className="text-blue-600" /> Free Express Shipping</div>
                <div className="flex items-center gap-1.5"><FiShield className="text-blue-600" /> 100% Quality Guaranteed</div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h3>

            {/* Write Review Form */}
            <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-600">Rate & Review this product</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name (e.g. Kunal V.)"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Expectation)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>
              <textarea
                rows={2}
                required
                placeholder="Share details about fit, comfort, quality..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Submit Review
              </button>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{rev.name}</span>
                    <span className="text-[10px] text-slate-400">{rev.createdAt || 'Recently'}</span>
                  </div>
                  <div className="flex items-center text-amber-400 text-xs">
                    {[1, 2, 3, 4, 5].map(st => (
                      <FiStar key={st} size={12} className={st <= rev.rating ? 'fill-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
