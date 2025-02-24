const https = require("https");

module.exports = {
  "/api": {
    target: "https://localhost:5030",
    secure: false, // Ignora la verificación del certificado SSL
    changeOrigin: true,
    agent: new https.Agent({
      rejectUnauthorized: false, // Ignora los errores de certificado
    }),
  },
};
