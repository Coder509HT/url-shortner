require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const ShortUrl = require("./models/ShortUrl");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find({});
  res.render("index", { shortUrls: shortUrls });
});

app.get("/:short", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.short });

  if (shortUrl === null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.listen(process.env.PORT);

mongoose.connect(process.env.DATABASE_LINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
