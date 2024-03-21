const config = require("../config/config");
 
function isTokenExpired(token) {
  try {
    const decoded = jwt.verify(token, config.secretKey);
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
 
    if (decoded.exp < currentTimeInSeconds) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return true;
  }
}
 
module.exports={isTokenExpired};
 