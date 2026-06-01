const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/products  - public
router.get('/', getAll);

// GET /api/products/:id  - public
router.get('/:id', getById);

// POST /api/products  - admin only
router.post('/', verifyToken, isAdmin, create);

// PUT /api/products/:id  - admin only
router.put('/:id', verifyToken, isAdmin, update);

// DELETE /api/products/:id  - admin only
router.delete('/:id', verifyToken, isAdmin, remove);

module.exports = router;
