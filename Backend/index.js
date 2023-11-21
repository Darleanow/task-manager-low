// Express package
const express = require("express");


// App settings
const app = express();
const PORT = 3333;

// App bootup
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
