const express = require("express");
const app = express();

app.get("/prueba", (req, res) => {
  console.log("✅ Ruta de prueba funcionando");
  res.json({ mensaje: "Ruta funcionando correctamente" });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Servidor de prueba en el puerto ${PORT}`));
