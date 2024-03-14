const NodeCache = require("node-cache");
// Create a cache to store user emails

const userCache = new NodeCache({ stdTTL: 0 });

module.exports.userCache=userCache;