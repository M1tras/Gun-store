const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Product = require('./Product')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);

// Associations
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
};
