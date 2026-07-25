import express from 'express';

const router = express.Router();

const activeCoupons = [
  { code: 'WELCOME10', discountType: 'percentage', value: 10, minOrder: 400, description: '10% off on your order' },
  { code: 'SUMMER20', discountType: 'percentage', value: 20, minOrder: 999, description: '20% off on orders above ₹999' },
  { code: 'VIRATTOM50', discountType: 'fixed', value: 150, minOrder: 500, description: 'Flat ₹150 off on orders above ₹500' },
  { code: 'FREESHIP', discountType: 'fixed', value: 100, minOrder: 300, description: 'Free shipping discount (₹100 value)' }
];

// Validate coupon code
router.post('/validate', (req, res) => {
  const { code, cartAmount = 0 } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code required' });
  }

  const found = activeCoupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!found) {
    return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  if (cartAmount < found.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount for code ${found.code} is ₹${found.minOrder}`
    });
  }

  let discountAmount = 0;
  if (found.discountType === 'percentage') {
    discountAmount = Math.round((cartAmount * found.value) / 100);
  } else {
    discountAmount = found.value;
  }

  return res.status(200).json({
    success: true,
    message: `Coupon '${found.code}' applied successfully!`,
    coupon: found,
    discountAmount
  });
});

// Get all active coupons (Admin)
router.get('/', (req, res) => {
  return res.status(200).json({ success: true, data: activeCoupons });
});

export default router;
