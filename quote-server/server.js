// server.js
// This is where your node app starts

//load the 'express' module which makes writing webservers easy
import express, { response } from "express";
//load the quotes JSON
import quotes from "./quotes.json" assert { type: "json" };

const app = express();
// Now register handlers for some routes:
//   /                  - Return some helpful welcome info (text)
//   /quotes            - Should return all quotes (json)
//   /quotes/random     - Should return ONE quote (json)
app.get("/", (request, response) => {
  response.send("Neill's Quote Server!  Ask me for /quotes/random, or /quotes");
});

//START OF YOUR CODE...
app.get("/quotes", (request, response) => {
  response.send(quotes);
});
app.get("/quotes/random", (request, response) => {
  const randomQuotes = pickFromArray(quotes);
  response.send(randomQuotes);
});
app.get("/quotes/search", (request, response) => {
  const searchTerm = request.query.term ? request.query.term.toLowerCase() : "";

  if (!searchTerm) {
    return response.json([]);
  }
  const results = quotes.filter((quote) => {
    const quoteText = quote.quote ? quote.quote.toLowerCase() : "";
    const quoteAuthor = quote.author ? quote.author.toLowerCase() : "";
    return quoteText.includes(searchTerm) || quoteAuthor.includes(searchTerm);
  });
  response.json(results);
});
//...END OF YOUR CODE

//You can use this function to pick one element at random from a given array
//example: pickFromArray([1,2,3,4]), or
//example: pickFromArray(myContactsArray)
//
const pickFromArray = (arrayofQuotes) =>
  arrayofQuotes[Math.floor(Math.random() * arrayofQuotes.length)];

//Start our server so that it listens for HTTP requests!
const listener = app.listen(3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
