import * as validator from './validator';
import chai from 'chai';
const expect = chai.expect;

describe('Validator function', () => {

    describe('required',()=>{
        it(`should return object if it's undefined, null or empty string`, () => {
            const actualempty = validator.required("");
            const actualnull = validator.required(null);
            const actualundefined = validator.required(undefined);
            const expected = {
                required:true
            }
            expect(actualempty).to.deep.equal(expected);
            expect(actualnull).to.deep.equal(expected);
            expect(actualundefined).to.deep.equal(expected);
        });
        it(`should return false if it's valid`, () => {
            const actual = validator.required("test");
            const expected = false;
            expect(actual).to.deep.equal(expected);
        });
    });

    describe('minLength', () => {
        it(`should return object if length text is less than specified`, () => {
            const minLength4 = validator.minLength(4);
            const actual2len = minLength4("12");
            const expected2len = {
                minLength:{
                    length:2,
                    minRequired:4
                }
            };

            const actual0len = minLength4("");
            const expected0len = {
                minLength:{
                    length:0,
                    minRequired:4
                }
            };

            expect(actual2len).to.deep.equal(expected2len);
            expect(actual0len).to.deep.equal(expected0len);
        });

        it(`should return object with length value is 0 if value is null or undefined`,() => {
            const minLength4 = validator.minLength(4);
            const actualundefined =  minLength4(undefined);
            const actualnull =  minLength4(null);
            const expected0len = {
                minLength:{
                    length:0,
                    minRequired:4
                }
            };
            
            expect(actualundefined).to.deep.equal(expected0len);
            expect(actualnull).to.deep.equal(expected0len);
        });

        it('should return false if length text is more than specified', () => {
            const minLength4 = validator.minLength(4);
            const actual4len = minLength4("1234");
            const actual9len = minLength4("123456789");
            

            expect(actual4len).to.be.false;
            expect(actual9len).to.be.false;
        });
    });

    describe('maxLength', () => {
        (`should return object if length text is less than specified`, () => {
            const maxLength4 = validator.maxLength(4);
            const actual5len = maxLength4("12345");
            const expected4len = {
                maxLength:{
                    length:5,
                    maxRequired:4
                }
            };

            expect(actual5len).to.deep.equal(expected4len);
        });

        it(`should return object with length value is 0 if value is null or undefined`,() => {
            const maxLength4 = validator.maxLength(4);
            const actualundefined =  maxLength4(undefined);
            const actualnull =  maxLength4(null);
            const expected0len = {
                maxLength:{
                    length:0,
                    maxRequired:4
                }
            };
            
            expect(actualundefined).to.deep.equal(expected0len);
            expect(actualnull).to.deep.equal(expected0len);
        });

        it('should return false if length text is less than specified', () => {
            const maxLength4 = validator.maxLength(4);
            const actual2len = maxLength4("12");
            const actual4len = maxLength4("1234");
            

            expect(actual2len).to.be.false;
            expect(actual4len).to.be.false;
        });

    });

    describe('email', () => {
        it('should return true if email is valid', () => {
            const actual = validator.email('test@test.com');
            expect(actual).to.be.false;
        });

        it('should return false if email is invalid', () => {
            const mockemail_1 = 'test.com';
            const actual_1 = validator.email(mockemail_1);

            const mockemail_2 = 'test.com';
            const actual_2 = validator.email(mockemail_2);
            
            const mockemail_3 = 'test@.com';
            const actual_3 = validator.email(mockemail_3);

            const getExpectedError = (email) => {
                return {
                    email:{
                        current:email
                    }
                }
            }

            expect(actual_1).to.deep.equal(getExpectedError(mockemail_1));
            expect(actual_2).to.deep.equal(getExpectedError(mockemail_2));
            expect(actual_3).to.deep.equal(getExpectedError(mockemail_3));
            
        })
    }); 
}); 