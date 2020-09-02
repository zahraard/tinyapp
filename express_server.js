const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
app.get('/', (req, res)=>{
  res.send("Hello!")
});

app.get('/urls', (req, res)=>{
  const userId = req.cookies['user_id']
  let templateVars = { 
    urls: urlDatabase,
    user: users[userId]
  };
  console.log(templateVars)
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  const userId = req.cookies['user_id']
  let templateVars = { 
    user: users[userId]
     };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const userId = req.cookies['user_id']
  let templateVars = { 
    shortURL,
    longURL,
    user: users[userId]
     };
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
  console.log(urlDatabase);  // Log the POST request body to the console
  res.redirect(`/urls/${generatedUrl}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post('/urls/:shortURL', (req, res)=>{
  const shortURL = req.params.shortURL;
  for(let url in urlDatabase){
    if(url === shortURL)[
      urlDatabase[shortURL] = req.body.newURL
    ]
  }
  console.log('url: ',urlDatabase)
  res.redirect('/urls');
})

app.post(('/urls/:shortURL/delete'), (req, res)=>{
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  console.log('url: ',urlDatabase)
  res.redirect('/urls');
})

app.post('/login', (req, res)=>{
  const username = req.body.username;

  //res.cookie('username', username);
  res.redirect('/urls')
})

app.post('/logout', (req, res)=>{
  res.clearCookie('user_id');
  res.redirect('/urls')
})

app.get('/register', (req, res)=>{
  const userId = req.cookies['user_id']
  let templateVars = { 
    user: users[userId]
     };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res)=>{
  const { email, password } = req.body;
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password
  }
  res.cookie('user_id', id);
  res.redirect('/urls')
})

app.listen(PORT, ()=>{
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  let rand = Math.random().toString(36).substring(7, 1);
  return rand;
}