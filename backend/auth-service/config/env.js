require("dotenv").config();

module.exports = {
    PORT: parseInt(process.env.AUTH_PORT || process.env.AUTH_SERVER_PORT || "5000", 10)
};

