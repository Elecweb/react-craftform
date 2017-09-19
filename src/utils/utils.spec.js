import chai from 'chai';
const expect = chai.expect;
import { validateControl, hasError } from './utils';
import { minLength } from './../validator/validator';
describe('Utility',() => {
    describe('validateControl function', () => {
        it('should return correct error array if there`s an error', ()=>{
            const actualValue = validateControl('', 'required' ,'testname');
            const expectValue = {required:true};

            expect(actualValue).to.deep.equals(expectValue);
            expect(actualValue).to.be.an('object');
        });

        it(`should return "false" if it's correct`, ()=>{
            const actualValue = validateControl('test', 'required' ,'testname');

            expect(actualValue).to.be.false;
        });

        it(`should return "false" if it's correct with array rule`, ()=>{
            const actualValue = validateControl('test', ['required',minLength(3)] ,'testname');

            expect(actualValue).to.be.false;
        });

        it('should be able to handle custom function rule',()=>{
            const customRule = (val) => {
                if(val === 'chkvalue'){
                    return false;   
                }else{
                    return {
                        customRule:true
                    }
                }
            }
            const minlength = (length) => {
                return (val)=>{
                    if(val.length >= length){
                        return false;
                    }else{
                        return {
                            minlength:true
                        }
                    }
                };
            };
            const actualValue = validateControl('test', ['required',customRule] ,'testname');
            expect(actualValue,"actualValue").to.deep.equals({
                customRule:true
            });

            const actualValue2 = validateControl('', ['required',customRule] ,'testname');
            expect(actualValue2,"actualValue2").to.deep.equals({
                required:true,
                customRule:true
            });

            const actualValue3 = validateControl('23', ['required',customRule,minlength(3)] ,'testname');
            expect(actualValue3,"actualValue3").to.deep.equals({
                minlength:true,
                customRule:true
            });
        });

        it(`should throw an error if provided rule isn't correct`,()=>{
            expect(()=>{
                validateControl('test', ['requiredincorrect'] ,'testname');
            }).to.throw();
            

            
        });
    });
    describe('hasError function', () => {
        it(`should return 'false' if there's no error`, ()=>{
            const actualValue = hasError({
                name:false,
                code:false
            });
            const actualValue2 = hasError(undefined);
            const actualValue3 = hasError({
                name:undefined,
                code:undefined
            });
            const actualValue4 = hasError({});

            expect(actualValue, "object of empty array").to.be.false;
            expect(actualValue2, "undefined value").to.be.false;
            expect(actualValue3, "object of undefined").to.be.false;
            expect(actualValue4, "empty object").to.be.false;
        });

        it(`should return 'true' if there's error`, ()=>{
            const actualValue = hasError({
                name:{
                    required:true   
                },
                code:false
            });

            const actualValue1 = hasError({
                name:{
                    required:true   
                },
                code:{
                    minlength:{
                        minRequired:3,
                        length:2
                    }
                }
            });
            expect(actualValue).to.be.true;
            expect(actualValue1).to.be.true;
        });
    }); 
});