const { Order, OrderItem, Product, User } = require('../models');
const { sequelize } = require('../models');

/**
 * POST /api/orders
 * Authenticated users. Creates a new order.
 *
 * Body: { items: [{ productId, quantity }] }
 *
 * Business rules enforced:
 *  1. items array must be non-empty.
 *  2. Every productId must exist and have sufficient stock.
 *  3. If ANY item is a restricted product, the user must:
 *     a. Have hasGunLicense === true
 *     b. Be 18 years of age or older
 *  4. Prices are always taken from the DB, never from the client.
 *  5. Stock is decremented atomically inside a transaction.
 */
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'items must be a non-empty array' });
    }

    // Validate item shape
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Each item must have productId and quantity' });
      }
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty < 1) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Quantity must be a positive integer' });
      }
    }

    // Deduplicate productIds (combine quantities if same product appears twice)
    const itemMap = new Map();
    for (const item of items) {
      const pid = parseInt(item.productId, 10);
      const qty = parseInt(item.quantity, 10);
      itemMap.set(pid, (itemMap.get(pid) || 0) + qty);
    }

    const productIds = Array.from(itemMap.keys());

    // Fetch all products in one query (with lock for update)
    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    // Verify all requested products exist
    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missing = productIds.filter((id) => !foundIds.includes(id));
      await transaction.rollback();
      return res.status(404).json({ message: `Products not found: ${missing.join(', ')}` });
    }

    // --- Gun license & age check ---
    const hasRestrictedItem = products.some((p) => p.isRestricted);

    if (hasRestrictedItem) {
      // Re-fetch user with fresh data to be safe (verifyToken already attached req.user,
      // but we want the most current values inside this transaction)
      const user = await User.findByPk(req.user.id, { transaction });

      if (!user.hasGunLicense) {
        await transaction.rollback();
        return res.status(403).json({
          message:
            'Your cart contains restricted firearms/equipment. A valid gun license is required to purchase these items.',
        });
      }

      if (user.age < 18) {
        await transaction.rollback();
        return res.status(403).json({
          message:
            'You must be 18 years of age or older to purchase restricted firearms/equipment.',
        });
      }
    }

    // --- Stock check ---
    for (const product of products) {
      const requested = itemMap.get(product.id);
      if (product.stock < requested) {
        await transaction.rollback();
        return res.status(409).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${requested}.`,
        });
      }
    }

    // --- Calculate total ---
    let totalPrice = 0;
    for (const product of products) {
      totalPrice += parseFloat(product.price) * itemMap.get(product.id);
    }

    // --- Create order ---
    const order = await Order.create(
      {
        userId: req.user.id,
        totalPrice: totalPrice.toFixed(2),
        status: 'pending',
      },
      { transaction }
    );

    // --- Create order items and decrement stock ---
    const orderItemsData = [];
    for (const product of products) {
      const quantity = itemMap.get(product.id);
      orderItemsData.push({
        orderId: order.id,
        productId: product.id,
        quantity,
        unitPrice: product.price,
      });

      // Decrement stock
      await product.update({ stock: product.stock - quantity }, { transaction });
    }

    await OrderItem.bulkCreate(orderItemsData, { transaction });

    await transaction.commit();

    // Return order with items populated
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'imageUrl', 'isRestricted'] }],
        },
      ],
    });

    return res.status(201).json({ message: 'Order placed successfully', order: createdOrder });
  } catch (err) {
    await transaction.rollback();
    console.error('createOrder error:', err);
    return res.status(500).json({ message: 'Failed to create order' });
  }
};

/**
 * GET /api/orders
 * Returns the authenticated user's own orders with items.
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'imageUrl', 'isRestricted'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error('getUserOrders error:', err);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * GET /api/orders/admin
 * Admin only. Returns all orders from all users.
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'hasGunLicense', 'age'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'isRestricted'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error('getAllOrders error:', err);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * PATCH /api/orders/:id/status
 * Admin only. Updates order status.
 * Body: { status }
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    return res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
