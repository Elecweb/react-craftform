/* exported validateControl */
import React from 'react';
import * as Rule from './../validator/validator';
export const minLength = (min) => {
    return (val)=>{
        if(val.length >= min){
            return false;
        }else{
            return {
                minLength:{
                    length:val.length,
                    minRequired:min
                }
            }
        }
    };
};
const useBuiltinRule = (rule,inputvalue) =>{
    switch(rule){
        case "required":
            return Rule.required(inputvalue);
        case "email":
            return Rule.email(inputvalue);
        default:
            throw new Error(`rule isn't correct, you need to pass function if it's custom rul`);
    }
};
const inspectError = (rules, inputvalue) => {
    let error = {};
    rules = rules.filter((rule)=>{
        return typeof rule !== 'undefined'; 
    });
    rules.map((rule) => {
        if(typeof rule === "string"){
            error = {
                ...error,
                ...useBuiltinRule(rule,inputvalue)
            }
        }
        else if(typeof rule === "function"){
            error = {
                ...error,
                ...rule(inputvalue)
            }
        }else{
            throw new Error(`rule isn't correct, you need to pass function if it's custom rul`);
        }
    });
    const filteredError = {};
    Object.keys(error).map((key)=>{
        if(error[key]){
            filteredError[key] = error[key];
        }
    });
    return Object.keys(filteredError).length > 0 ? filteredError : false;
}

export const validateControl = (inputvalue, rules) => {
    if(!Array.isArray(rules)){
        rules = [rules];
    }
    return inspectError(rules,inputvalue);
    
}

export const hasError = (errors) => {
    if(errors){
        const errorskeys = Object.keys(errors).filter((error)=>{
            if(errors[error]){
                return true;
            }
        });
        return errorskeys.length == 0 ? false : true;
    }else{
        return false;
    }
}

export const isObject = (obj) => {
    return obj === Object(obj);
}


export const bindControlToRule = (rules,values) => {
    return rules.map((rule)=>{
        
        if(typeof rule === 'function'){
        
            return rule.bind({
                controls:{
                    values
                }
            });
        }else{
            return rule;
        }
        
    });
}

export const ShowWhenDirty = ({children,and = true,dirty,or}) => {
    if((dirty && and) || or){
        return React.Children.only(children);
    }else{
        return (null);
    }
}