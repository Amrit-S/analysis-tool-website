require('dotenv').config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '9000'
  }
};