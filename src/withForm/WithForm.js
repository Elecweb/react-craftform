import React from 'react';
import { validateControl,isObject } from './../utils/utils';
const withForm = function(Wrappedcomp,controls, formpropname="form"){
    if(!isObject(controls) || Object.keys(controls).length <= 0){
        throw new Error('you need to provide controls in secocde parameter');
    }
    return class WithFormComponent extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                values:{},
                errors:{},
                rules:{}
            }

            Object.keys(controls).map((name) =>{
                this.state.rules[name] = controls[name][1] ? controls[name][1] : [];
                if(props.prefill && props.prefill[name]){
                    this.state.values[name] = props.prefill[name];
                }else{
                    this.state.values[name] = controls[name][0];
                }
                

                this.state.errors[name] = validateControl(this.state.values[name],this.state.rules[name],name);
            });
        }

        updateValue(name,value){
            const newValues = {
                [name]:value
            };
            const newErrors = {
                [name]:validateControl(value,this.state.rules[name],name)
            };
            this.setState(({errors={},values={}})=>{
                return {
                    errors:{
                        ...errors,
                        ...newErrors
                    },
                    values:{
                        ...values,
                        ...newValues
                    }
                }
            });
        }
        

        render(){
            const formProp = {
                [formpropname]:{
                    ...this.state,
                    handleChange:(name)=>{
                        return (event)=>{
                            let value;
                            if(event.target.type == "checkbox"){
                                value = event.target.checked;
                            }else{
                                value = event.target.value;
                            }
                            
                            this.updateValue.bind(this)(name,value);
                        }
                         
                    },
                    handleValue:(name) => {
                        return (value)=>{
                            this.updateValue.bind(this)(name,value)
                        }
                    }
                }
            }

            return (<Wrappedcomp {...formProp} {...this.props} />);
        }
    }
}

export default withForm;