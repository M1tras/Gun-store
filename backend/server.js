const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
