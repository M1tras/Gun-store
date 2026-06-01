const { Product } = require('../models');

/**
 * GET /api/products
 * Public. Returns all products.
 */
const getAll = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ products });
  } catch (err) {
    console.error('getAll products error:', err);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
};

/**
 * GET /api/products/:id
 * Public. Returns a single product.
 */
const getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ product });
  } catch (err) {
    console.error('getById product error:', err);
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
};

/**
 * POST /api/products
 * Admin only. Creates a new product.
 * Body: { name, description, price, stock, imageUrl, isRestricted }
 */
const create = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, isRestricted } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'name and price are required' });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'price must be a non-negative number' });
    }

    const parsedStock = parseInt(stock, 10);
    if (stock !== undefined && (isNaN(parsedStock) || parsedStock < 0)) {
      return res.status(400).json({ message: 'stock must be a non-negative integer' });
    }

    const product = await Product.create({
      name,
      description: description || null,
      price: parsedPrice,
      stock: parsedStock >= 0 ? parsedStock : 0,
      imageUrl: imageUrl || null,
      isRestricted: Boolean(isRestricted),
    });

    return res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('create product error:', err);
    return res.status(500).json({ message: 'Failed to create product' });
  }
};

/**
 * PUT /api/products/:id
 * Admin only. Full update of a product.
 * Body: any subset of { name, description, price, stock, imageUrl, isRestricted }
 */
const update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, stock, imageUrl, isRestricted } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: 'price must be a non-negative number' });
      }
      updates.price = parsedPrice;
    }

    if (stock !== undefined) {
      const parsedStock = parseInt(stock, 10);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ message: 'stock must be a non-negative integer' });
      }
      updates.stock = parsedStock;
    }

    if (isRestricted !== undefined) updates.isRestricted = Boolean(isRestricted);

    await product.update(updates);

    return res.status(200).json({ message: 'Product updated', product });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('update product error:', err);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

/**
 * DELETE /api/products/:id
 * Admin only. Deletes a product.
 */
const remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('delete product error:', err);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { getAll, getById, create, update, remove };
