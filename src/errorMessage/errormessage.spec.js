import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme())
const expect = chai.expect;
import { mount } from "enzyme";
import ErrorMessage from './ErrorMessage';



describe('errorMessage function',() => {
    const create_errormessage = (error={required:true},errorspec = {
        required:() => {
            return (<p className="error">please provide data</p>)
        }
    }) => {
        const MockComp = () => {
            return (
                <div>
                {ErrorMessage(errorspec)(error)}
                </div>
            );
        }
        return mount(<MockComp />);
    }

    it(`should return function `,()=>{
        expect(ErrorMessage({
            required:() => {
                return (<p className="error">please provide data</p>)
            }
        })).to.be.a('function');
    });

    it('should render error message according to error',()=>{
        const error = {
            required: true
        };
        const myError = create_errormessage(error);
        expect(myError.find('p.error').length).to.be.equal(1);

        const error2 = {
            required: true,
            minlength:{
                length:4,
                minRequired:10
            }
        };
        const myError2 = create_errormessage(error2,{
            required:() => {
                return (<p className="error">Please provide data</p>)
            },
            minlength:() => {
                return (<p className="error">you fill data with correct length</p>);
            }
        });
        expect(myError2.find('p.error').length).to.be.equal(2);
        expect(myError2.find('p.error').at(0)).to.contain.text('Please provide data');
        expect(myError2.find('p.error').at(1)).to.contain.text('you fill data with correct length');

        const error3 = {
            required: true
        };
        const myError3 = create_errormessage(error3,[{
            rule: "required",
            render: () => {
                return (<p className="error">Please provide data</p>)
            },
        },{
            rule:"minlength",
            render: () => {
                return (<p className="error">you fill data with correct length</p>);
            }
        }]);

        expect(myError3.find('p.error').length).to.be.equal(1);
        expect(myError3.find('p.error').at(0)).to.contain.text('Please provide data');
    });

    it(`should render one div at root`, () =>{
        const myError = create_errormessage();
        expect(myError.find('div').length).to.be.greaterThan(0);
    });

    it(`should render error message with correct length`,()=>{
        const myError = create_errormessage({});
        expect(myError.find(`p.error`).length).to.be.equal(0);
        const myError2 = create_errormessage({
            required:true
        });
        expect(myError2.find(`p.error`).length).to.be.equal(1);

        const myError3 = create_errormessage({
            required:true,
            minlength:true
        },{
            required:()=>{
                return (<p className="error">error</p>)
            },
            minlength:()=>{
                return (<p className="error">error</p>)
            }
        });

        expect(myError3.find(`p.error`).length).to.be.equal(2);
        
        const myError4 = create_errormessage({
            required:true,
        },{
            required:()=>{
                return (<p className="error">error</p>)
            },
            minlength:()=>{
                return (<p className="error">error</p>)
            }
        });

        expect(myError4.find(`p.error`).length).to.be.equal(1);
    });

    it('should be able to render error message with information',()=>{
        const myError = create_errormessage({
            minlength:{
                minRequired:3,
                length:2
            }
        },{
            minlength:(def) => {
                return (<p className="error">you fill data with {def.length} length but it need to {def.minRequired}</p>);
            }
        });

        expect(myError.find('p.error').at(0),"you fill data with 2 length but it need to 3").to.contain.text('you fill data with 2 length but it need to 3');


        const myError2Spec= (name)=>{
            return ErrorMessage({
                required:()=>{
                    return (<p className="error">{name} need to fill</p>);
                },
                minlength:(def)=>{
                    return (<p className="error">{name} need to fill more that or equal {def.minRequired}</p>);
                }
            });
        }
        expect(myError2Spec("myname")).to.be.a('function');
        const myErrorTwo = myError2Spec("myname")({
            required:true,
            minlength:{
                length:3,
                minRequired:4
            }
           
        });

        const MockComp = ()=>{
            return (
                <div>
                    {myErrorTwo}
                </div>
            );
        };
        const mounted_error = mount(<MockComp />);
        expect(mounted_error.find('p.error').length).to.be.equal(2);
        
        expect(mounted_error.find('p.error').at(0),"myname need to fill").to.contain.text('myname need to fill');
        expect(mounted_error.find('p.error').at(1),"myname need to fill more that or equal 4").to.contain.text('myname need to fill more that or equal 4');
    });

    it('can keep setting to variable and can call with diffrenet error',()=>{
        const myError = {
            required:true,
            minlength:{
                minRequired:3,
                length:2
            }
        };

        const myError2 = {
            required:true,
            minlength:{
                minRequired:10,
                length:2
            }
        }

        const myError3 = {
            required:true
        }
        const myErrorSpec= ErrorMessage({
            required:()=>{
                return (<p className="error">this need to fill</p>);
            },
            minlength:(def)=>{
                return (<p className="error">this need to fill more that or equal {def.minRequired}</p>)
            }
        });

        const Mockcomp = ()=>{
            return  (<div>
                <div className="error">
                    {myErrorSpec(myError)}
                </div>
                <div className="error2">
                    {myErrorSpec(myError2)}
                </div>
                <div className="error3">
                    {myErrorSpec(myError3)}
                </div>
            </div>);
           
        }
        
        const mounted_comp = mount(<Mockcomp />);
        expect(mounted_comp.find('div.error').first()).to.have.exactly(2).descendants('p.error');
        expect(mounted_comp.find('div.error').first().find('p.error').at(1)).to.contain.text(`this need to fill more that or equal 3`);
        expect(mounted_comp.find('div.error2').first()).to.have.exactly(2).descendants('p.error');
        expect(mounted_comp.find('div.error2').first().find('p.error').at(1)).to.contain.text(`this need to fill more that or equal 10`);
        
        expect(mounted_comp.find('.error3')).to.have.exactly(1).descendants('p.error');
    });

    it(`can render new error message if error has changed`,()=>{
        const myErrorSpec= ErrorMessage({
            required:()=>{
                return (<p className="error">this need to fill</p>);
            },
            minlength:(def)=>{
                return (<p className="error">this need to fill more that or equal {def.minRequired}</p>)
            }
        });

        const Mockcomp = (props)=>{
            return  (<div>
                {myErrorSpec(props)}
            </div>)
           
        }

        const mounted_comp = mount(<Mockcomp />);
        const myError = {
            required:true,
            minlength:{
                minRequired:3,
                length:2
            }
        };
        mounted_comp.setProps(myError);
        expect(mounted_comp.find('p.error').length).to.be.equal(2);
        expect(mounted_comp.find('p.error').at(1)).to.contain.text('this need to fill more that or equal 3');
        const myError2 = {
            ...myError,
            minlength:{
                minRequired:10,
                length:2
            }
                
            
        }
        mounted_comp.setProps(myError2);
        expect(mounted_comp.find('p.error').at(1),JSON.stringify(myError2)).to.contain.text('this need to fill more that or equal 10');
        
        const myError3 = {
            required:true,
            minlength:false
        };

        mounted_comp.setProps(myError3);
        
        expect(mounted_comp.find('p.error').length,JSON.stringify(myError3)).to.be.equal(1);
        
    });

    it(`should not show error if user didn't provide how to manage it`,()=>{
        const myError = create_errormessage({
            maxlength:{
                length:3,
                maxRequired:4
            },
            required:true
        })

        expect(myError.find('p.error').length).to.be.equal(1);

        const myError2 = create_errormessage({
            maxlength:{
                length:3,
                maxRequired:4
            },
            required:true
        },{})
        expect(myError2.find('p.error').length).to.be.equal(0);

        const myError3 = create_errormessage({
            maxlength:{
                length:3,
                maxRequired:4
            },
            required:true
        },[]);

        expect(myError3.find('p.error').length).to.be.equal(0);
        
    });

    it(`shouldn't show error if user didn't provide error`, ()=>{
        const myError = create_errormessage({});
        expect(myError.find('p.error').length).to.be.equal(0);
        const myError2 = create_errormessage(false);
        expect(myError2.find('p.error').length).to.be.equal(0);
       
    });

    it('can accpet array of object as rule', ()=>{
        const myError = create_errormessage({
            required:true,
            minlength:{
                length:3,
                minRequired:4
            }
        },[
            {
                rule:"required",
                render:()=>{
                    return (<p className="error">Required!</p>)
                }
            },
            {
                rule:"minlength",
                render:(def)=>{
                    return (<p className="error">minlength! it has only {def.length} but require {def.minRequired}</p>);
                }
            }
        ]);

        expect(myError.find('p.error').length).to.be.equal(2);
        expect(myError.find('p.error').at(0)).to.contain.text('Required!');
        expect(myError.find('p.error').at(1)).to.contain.text('minlength! it has only 3 but require 4');
        
    });
});

