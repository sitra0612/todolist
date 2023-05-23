const sign= require("../validate.js")

test('do not pass if email and password are null',()=>{
  const p= ""
  const e= ""
  // const{email}= sign.validateEmail(e);
    
 
  expect(sign.validateBoth(e,p)).toBeFalsy();
  
});