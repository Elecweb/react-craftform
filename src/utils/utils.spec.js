import chai from 'chai';
const expect = chai.expect;
import { validateControl, hasError, ShowWhenDirty } from './utils';
import errorMessage from './../errorMessage/ErrorMessage';
import { minLength } from './../validator/validator';
import withForm from './../withForm/WithForm';
import React from 'react';
import { mount } from "enzyme";
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

    describe("showWhenDirty component", () => {
        let andProp;
        const errorSpec = (controlname,isDirty) => {
            return errorMessage({
                required: () => {
                    return <ShowWhenDirty and={andProp} dirty={isDirty} ><p className="error">{controlname}</p></ShowWhenDirty>
                },
            })
        }

        let mockForm = (props) => {
            return (
                <div>
                    <input type="text" />
                    {errorSpec('name',props.form.dirtys['name'])(props.form.errors['name'])}
                </div>
            )
        }
        
        let mounted_withForm;
        beforeEach(() => {
            const WithFormMock = withForm(mockForm,{
                name:[undefined,['required']]
            });
            mounted_withForm = mount(<WithFormMock />);
        });
        it(`should render error message when control is dirty and 'and' prop is true`, () => {
            andProp = true;
            expect(mounted_withForm.find(mockForm).find('.error')).to.have.length(0);
            mounted_withForm.find(mockForm).props().form.handleValue('name')('',true);
            expect(mounted_withForm.find(mockForm).props().form.dirtys.name).to.be.true;
            expect(mounted_withForm.find(mockForm).find('.error')).to.have.length(1);
        });

        it(`shouldn't render error message when 'and' prop is false.`, () => {
            andProp = false;
            expect(mounted_withForm.find(mockForm).find('.error')).to.have.length(0);
            mounted_withForm.find(mockForm).props().form.handleValue('name')('',true);
            expect(mounted_withForm.find(mockForm).props().form.dirtys.name).to.be.true;
            expect(mounted_withForm.find(mockForm).find('.error')).to.have.length(0);
        });

        it(`should render error message when 'and' prop isn't defined`, () => {
            andProp = undefined;
            expect(mounted_withForm.find(mockForm).find('.error')).to.have.length(0);
            mounted_withForm.find(mockForm).props().form.handleValue('name')('',true);
            expect(mounted_withForm.find(mockForm).props().form.dirtys.name).to.be.true;
            expect(mounted_withForm.find(mockForm).find('.error')).to.have.length(1);
        });
    });
});