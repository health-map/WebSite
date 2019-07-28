const DBManager = require('db-manager');
const redis = new DBManager.Redis();
module.exports = redis;