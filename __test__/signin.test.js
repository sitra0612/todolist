const sign= require("../validate.js")
describe("user test",()=>{
  test('does nothing if email right',()=>{
    const e = "tensaeb2016@gmail.com"
    // const{email}= sign.validateEmail(e);
      
   
    expect(sign.validateEmail(e)).toBeTruthy();
    
  });

  test('does nothing if password right',()=>{
    const p= "Tensu123!"
    // const{email}= sign.validateEmail(e);
      
   
    expect(sign.validatePassword(p)).toBeTruthy();
    
  });

  

  test('do not pass if any field is null',()=>{
    const password= ""
    const email= ""
    const name= ""
    const age=""
    
      
   
    expect(sign.validateAll(name,email,password,age)).toBeFalsy();
    
  });

 
});

describe('Password hashing', () => {
  it('should hash a password correctly', () => {
    const password = 'password123';
    const hashedPassword = sign.hash(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toEqual(password);
  });


  
});