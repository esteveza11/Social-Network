const moment = require('moment');

module.exports = (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
