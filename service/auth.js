const jwt=require("jsonwebtoken");
const secret="charan@123";

function setUser(user){
  return jwt.sign({
    _id:user.id,
    email:user.email,
  },
  secret);
}

function getUser(token){
  if(!token) return null;
  try{
    return jwt.verify(token, secret);
  }
  catch{
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};