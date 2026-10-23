require("dotenv").config();

module.exports = {
    PORT: parseInt(process.env.API_SERVER_PORT || "5000", 10)
};
