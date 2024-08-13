const express = require('express');
const Product = require('../models/product');
// Middleware for authentication (optional)

const router = express.Router();

// Create Product
router.post('/', async (req, res) => {
  const { name, price, description, tax, discount } = req.body;

  const product = new Product({ name, price, description, tax, discount });

  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
});

// Get All Products
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Get Product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Update Product
router.put('/:id', async (req, res) => {
  const { name, price, description, tax, discount } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.tax = tax || product.tax;
    product.discount = discount || product.discount;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete Product
router.delete('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;
