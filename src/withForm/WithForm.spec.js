import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
chai.use(chaiEnzyme())
const expect = chai.expect;
import { mount,shallow } from "enzyme";

import WithForm from './WithForm';


const MockComp = (props)=>{
    const submit = ()=>{
        props.onFormSubmit("data");
    };
    return (
        <form onSubmit={submit}>
            <button type="submit">submit</button>
        </form>
    );
};

const MockCheckboxComp = (props) => {
    return (
        <form>
            <input type="checkbox" checked={props.form.values.checkboxtest} onChange={props.form.handleChange('checkboxtest')} id="checkboxtest"/>
        </form>
    );
}
describe(`WithForm HOC`, ()=>{
    let onFormSubmit;
    const create_mockComp = (props={}, controls = {
        name:["",["required"]],
        code:["",["required"]]
    }, formpropname) =>{
        const WithFormMockComp = WithForm(MockComp, controls, formpropname);
        return mount(<WithFormMockComp {...props} onFormSubmit={onFormSubmit} />);
    };

    beforeEach(()=>{
        onFormSubmit = sinon.stub();
    });

    afterEach(()=>{
        onFormSubmit.reset();
    });

    it('should render wrapped component',()=>{
        const mockComp = create_mockComp();
        expect(mockComp.find(MockComp).length).to.be.equal(1);
    });

    it('should create values, rules and errors according to provided controls',()=>{
        const mockComp = create_mockComp({},{
            name:["namevalue",["required"]],
            code:["codevalue",["required"]]
        });

        expect(mockComp.state('values')).to.deep.equals({
            name:"namevalue",
            code:"codevalue"
        });

        expect(mockComp.state('rules')).to.deep.equals({
            name:["required"],
            code:["required"]
        });

        expect(mockComp.state("errors")).to.deep.equals({
            name:false,
            code:false
        });

        const mockCompNoRule = create_mockComp({},{
            name:["namevalue"],
            code:["codevalue"]
        });

        expect(mockCompNoRule.state('values')).to.deep.equals({
            name:"namevalue",
            code:"codevalue"
        });

        expect(mockCompNoRule.state('rules')).to.deep.equals({
            name:[],
            code:[]
        });

        expect(mockCompNoRule.state("errors")).to.deep.equals({
            name:false,
            code:false
        });

    });

    it(`should throw an error when controls is undefined or empty object`,()=>{
        expect(()=>{
            create_mockComp({},{});
        }).to.throw();
       
    });

    it(`"updatevalue" can update value correctly`, ()=> {
        const mockComp = create_mockComp({},{
            name:["",["required"]],
            code:[""]
        });
        const mockComp_inc =  mockComp.instance();

        expect(mockComp.state('values')).to.deep.equals({
            name:"",
            code:""
        });
        expect(mockComp.state('errors')).to.deep.equals({
            name:{required:true},
            code:false
        });

        mockComp_inc.updateValue("name","namevalue");
        mockComp_inc.updateValue("code","codevalue");

        expect(mockComp.state('values')).to.deep.equals({
            name:"namevalue",
            code:"codevalue"
        });
        expect(mockComp.state('errors')).to.deep.equals({
            name:false,
            code:false
        });
    });

    it(`can pass props in withForm component and wrapped form can recieve the same props`, () => {
        const wrappedcomp = create_mockComp({propone:"propone", proptwo: "proptwo"},{
            name:["",["required"]],
            code:["wow"]
        });
        const props = wrappedcomp.find(MockComp).props();
        expect(props.propone).to.be.equal("propone");
        expect(props.proptwo).to.be.equal("proptwo");
    });

    it('wrapped comp recieved "form" props from wrapper component', () => {
        const wrappedcomp = create_mockComp({},{
            name:["",["required"]],
            code:["wow"]
        });
        const wrappedcomp_props = wrappedcomp.find(MockComp).props();
        expect(wrappedcomp_props.form.values).to.deep.equals({
            name:"",
            code:"wow"
        });

        expect(wrappedcomp_props.form.errors).to.deep.equals({
            name:{
                required:true
            },
            code:false
        });

        expect(wrappedcomp_props.form.handleChange,"handleChange").to.be.a('function');

    });

    it(`default prop name is form`, () => {
        const wrappedcomp = create_mockComp({},{
            name:["",["required"]],
            code:["wow"]
        });

        const wrappedcomp_props = wrappedcomp.find(MockComp).props();
        expect(wrappedcomp_props.form).to.be.an('object');

    });

    it(`can change prop "form" to be anything`, () => {
        const wrappedcomp = create_mockComp({},{
            name:["",["required"]],
            code:["wow"]
        },"changedform");

        const wrappedcomp_props = wrappedcomp.find(MockComp).props();
        expect(wrappedcomp_props.form).to.be.undefined;
        expect(wrappedcomp_props.changedform).to.be.an('object');

    });

    it(`should call "props.onFormSubmit" function when click submit on wrapped component`, ()=> {
        const wrappedcomp = create_mockComp({},{
            name:["",["required"]],
            code:["wow"]
        });
        wrappedcomp.find(MockComp).find('button[type="submit"]').first().simulate("submit");
        expect(onFormSubmit.calledOnce).to.be.true;
    });

    it('should be able to pass initial value via props',() => {
        const wrappedcomp = create_mockComp({
            prefill:{
                name:"myname",
                code:"mycode"
            }
        },{
            name:["",["required"]],
            code:["wow"]
        });

        expect(wrappedcomp.state('values').name).to.be.equal("myname");
        expect(wrappedcomp.state('values').code).to.be.equal("mycode");
    });

    it('should be able to handle checkbox correctly', () => {
        const checkboxcontrol = {
            checkboxtest:[false],
        };  
        const WithFormCheckbox = WithForm(MockCheckboxComp, checkboxcontrol);        
        const FormCheckMockComp = mount(<WithFormCheckbox />);
        expect(FormCheckMockComp.find(MockCheckboxComp).props().form.values.checkboxtest).to.be.false;
        FormCheckMockComp.find(MockCheckboxComp).find('#checkboxtest').first().simulate('change',{target:{checked:true,type:"checkbox"}});
        expect(FormCheckMockComp.find(MockCheckboxComp).props().form.values.checkboxtest).to.be.true;
        FormCheckMockComp.find(MockCheckboxComp).find('#checkboxtest').first().simulate('change',{target:{checked:false,type:"checkbox"}});
        expect(FormCheckMockComp.find(MockCheckboxComp).props().form.values.checkboxtest).to.be.false;
        
    });
});