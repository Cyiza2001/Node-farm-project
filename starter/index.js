const fs = require("fs");
const http = require("http");
// const { json } = require("stream/consumers");
const url = require("url");
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `urakabwa sha`;
// fs.writeFileSync("./txt/output.txt", textOut);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
//function
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME}/g, product.productName);
  output = output.replace(/{%IMAGE}/g, product.image);
  output = output.replace(/{%QUANTITY}/g, product.quantity);
  output = output.replace(/{%NUTRIENTS}/g, product.nutrients);
  output = output.replace(/{%PRICE}/g, product.price);
  output = output.replace(/{%ID}/g, product.id);
  output = output.replace(/{%FROM}/g, product.image);
  output = output.replace(/{%DESCRIPTION}/g, product.image);
  if (!product.organic)
    output = output.replace(/{%NOT__ORGANIC}/g, "not-organic");
  return output;
};
const server = http.createServer((req, res) => {
  console.log(req.url);
  const PathName = req.url;
  //the overview
  if (PathName === "/" || PathName === "/overview") {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const template = tempOverview.replace("{%PRODUCTCARDS}", cardsHtml);
    res.end(template);
  }
  //the API
  else if (PathName === "/API") {
    res.end(data);
  }
  //the product
  else if (PathName === "/product") {
    res.end("this is a product");
  }
  ///the page not found
  else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>page not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("listening from the server on port 8000");
});
