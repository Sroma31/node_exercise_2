const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/env");

module.exports = createProxyMiddleware({
    target: config.SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/api/v1": ""
    }
});