const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

function generateRandomString() {
  let rand = Math.random().toString(36).substring(7, 1);
  return rand;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
  res.send("Hello!")
});

app.get('/urls', (req, res)=>{
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  let templateVars = { shortURL, longURL };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const generatedUrl = generateRandomString();
  urlDatabase[generatedUrl] = req.body.longURL;  
  res.redirect(`/urls/${generatedUrl}`);
});

app.post('/urls/:shortURL', (req, res)=>{
  const shortURL = req.params.shortURL;
  for(let url in urlDatabase){
    if(url === shortURL)[
      urlDatabase[shortURL] = req.body.newURL
    ]
  }
  res.redirect('/urls');
})

app.post(('/urls/:shortURL/delete'), (req, res)=>{
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
})
app.listen(PORT, ()=>{
  console.log(`Example app listening on port ${PORT}!`);
})