const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1",
  { useNewUrlParser: true }
);

const UsuarioSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);

// handlebars setup
app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  hbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", ".hbs");

/* app.engine(
  ".hbs",
  hbs({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    defaultLayout: "main",
  })
);
 */

app.get("/", async (req, res) => {
  let usuarios = await Usuario.find().lean();
  res.render("index", { usuarios });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/", async (req, res) => {
  const usuario = new Usuario(req.body);
  await usuario.save();
  let usuarios = await Usuario.find().lean();
  res.render("index", { usuarios });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT} ...`)
);
