const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { lookupUserByEmail, emailLookup, generateRandomString } = require('./views/helpers/helpers')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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
  res.redirect('/urls')
});

app.get('/urls', (req, res)=>{
  const userId = req.cookies['user_id']
  let templateVars = { 
    urls: urlDatabase,
    user: users[userId]
  };
  //console.log(templateVars)
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  const userId = req.cookies['user_id']
  if(!userId){
    res.redirect('/');
  }
  let templateVars = { 
    user: users[userId]
     };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
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
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const generatedUrl = generateRandomString();
  const userId = req.cookies['user_id'];
  urlDatabase[generatedUrl] = {};
  urlDatabase[generatedUrl].longURL = req.body.longURL; 
  urlDatabase[generatedUrl].userID = req.body.userId; 
  res.redirect(`/urls/${generatedUrl}`);
});

app.post('/urls/:shortURL', (req, res)=>{
  const shortURL = req.params.shortURL;
  for(let url in urlDatabase){
    if(url === shortURL)[
      urlDatabase[shortURL].longURL = req.body.newURL
    ]
  }
  res.redirect('/urls');
})

app.post(('/urls/:shortURL/delete'), (req, res)=>{
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
})

app.get('/login', (req, res)=>{
  res.render("urls_login");
})

app.post('/login', (req, res)=>{
  const { email, password } = req.body;
  if(email === '' || password === ''){
    return res.status(400).send('Fields Are Required!');
  }
  const user = lookupUserByEmail(users, email);
  if(!user){
    return res.status(403).send('Email Not Found!');
  }
  if(user.password !== password){
    return res.status(403).send('Wrong Password!');
  }
  res.cookie('user_id', user.id);
  res.redirect('/urls')
})

app.post('/logout', (req, res)=>{
  res.clearCookie('user_id');
  res.redirect('/urls')
})

app.get('/register', (req, res)=>{
  // const userId = req.cookies['user_id']
  // let templateVars = { 
  //   user: users[userId]
  //    };
  res.render('urls_register');
});



app.post('/register', (req, res)=>{
  const { email, password } = req.body;
  if(email === '' || password === ''){
    return res.status(400).send('Fields Are Required!');
  }
  if(emailLookup(users, email)){
    return res.status(400).send('Email Exist!');
  }
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

