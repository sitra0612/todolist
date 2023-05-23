const bcrypt =require("bcryptjs")

function validateBoth(email,password) {
  // Regular expression for email validation
  if (!email || !password ){
  return false;
  }else{
    return true;
  }
}

function validateAll(name,email,password, age) {
  // Regular expression for email validation
  if (!email || !password ||!name||!age){
  return false;
  }else{
    return true;
  }
}

function validateEmail(email) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // Regular expression for password validation
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

function hash(pass){
  const password= bcrypt.hash(pass, 8);
  
  return password
}

module.exports={validateEmail,validatePassword,validateBoth,validateAll, hash};