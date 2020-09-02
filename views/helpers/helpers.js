const emailLookup = function(users, email){
  for(let item in users){
    if( users[item].email === email){
      return true;
    }
  }
  return false;
}

function generateRandomString() {
  let rand = Math.random().toString(36).substring(7, 1);
  return rand;
}

module.exports = {
  emailLookup,
  generateRandomString
}