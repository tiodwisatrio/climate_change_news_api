const PORT = process.env.PORT || 8080;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nytimes",
    address: "https://www.nytimes.com/section/climate",
    base: "https://www.nytimes.com",
  },
  {
    name: "washingtonpost",
    address: "https://www.washingtonpost.com/climate-environment/",
    base: "https://www.washingtonpost.com",
  },
  {
    name: "independent",
    address: "https://www.independent.co.uk/environment/climate-change/",
    base: "https://www.independent.co.uk",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "cnn",
    address: "https://edition.cnn.com/climate",
    base: "https://edition.cnn.com",
  },
  {
    name: "reuters",
    address: "https://www.reuters.com/news/archive/climate-change",
    base: "https://www.reuters.com",
  },
];

const articles = [];

newspapers.map((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Hello from Express");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

// Mengambil data API berdasarkan ID, dimana ID nya adalah nama media
app.get("/news/:newspaperId", (req, res) => {
  const { newspaperId } = req.params;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const spesificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        spesificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(spesificArticles);
    })
    .catch((error) => console.log(error));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
