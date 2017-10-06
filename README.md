# react-craftform
<img src="https://travis-ci.org/Elecweb/react-craftform.svg?branch=master">
<a href='https://coveralls.io/github/Elecweb/react-craftform?branch=master'><img src='https://coveralls.io/repos/github/Elecweb/react-craftform/badge.svg?branch=master' alt='Coverage Status' /></a>

React form library with full customizable and extensible. This library help you create form with your own style.

This library doesn't add any style to your form component. It let style of form to your imagination.

## Installation
  ` npm install react-craftform --save`

## Usage
  `react-craftform` created with <a href="https://facebook.github.io/react/docs/higher-order-components.html">HOC</a> in mind. `react-craftform` provide function called `withForm` for providing existing form power!

```javascript
import React from 'react';
import {withForm, validator, hasError} from 'react-craftform';

const MyForm = (props) => {
  return (
     <form>
          <section className="name_section">
              <label>Name</label>
              <input type="text" className="name" onChange={props.form.handleChange("name")} value={props.form.values['name']}/>
          </section>
          <p>Name Value: {props.form.values['name']} </p>
          <section className="code_section">
              <label>Last Name</label>
              <input type="text" className="code" onChange={props.form.handleChange("lastname")} value={props.form.values['lastname']} />
              
          </section>
          <p>LastName Value: {props.form.values['lastname']} </p>
          {hasError(props.form.errors) ? "There is an error" : "No Error, Huley"}
      </form>
  );
}

export default withForm(MyForm,{
  name:["",["required"]],
  lastname:["myinitalCode"]
});
```
<a href="https://embed.plnkr.co/3nYKo6aLileEJa9fjwFV/">Plunker</a>

## Creating form with `withForm`
  `withForm` take 2 parameters. First parameter it takes is your form component. Second parameter is description about your controls.
  
  Let's take a look at `withForm` function.
  
  ```javascript
   export default withForm(MyForm,{
      name:["",["required"]],
      lastname:["myinitilCode"]
   });
  ```
  `MyForm` component will receive object called `forn` via `props` for managing control (eg. handling `onChange` event, geting value and errors).
  
  Second parameter is object which property name is your control name. Each control name's value is array which for specifying initial value at index `0` and Validators at index `1`.
  
  In above code, we tell `withForm` that it has 2 controls which name are `name` and `lastname`. `name` control have no initial value
  and is required and `lastname` control have initial value which is "initialCode" and is opional.
  
## Handling change on input
  `withForm` doesn't update value for you so that you can customize as you want. Instead, it help you by providing `form` object via props with have method for update value.
  
  `form` props has `handleChange` method for updating value. `handleChange` accept control name.
  
  ```html
     <input type="text" className="name" onChange={props.form.handleChange("name")} value={props.form.values['name']}/>
     <input type="text" className="code" onChange={props.form.handleChange("lastname")} value={props.form.values['lastname']} />
  ```
  
## Getting value of control
   You can get value of control by call `props.form.values[controlname]`. 
   
   As above exmaple, we pass `props.form.values['name']` to input attribute `value` for `name` control and  `props.form.values['lastname']` for `lastname` control.
  
## Validation
 You can add validator easily in description object.
 ```javascript
    import { validator } from 'react-craftform';
    
    ...
    
    export default withForm(MyForm,{
      name:["",["required",validator.minLength3)]],
      lastname:["myinitilCode",validator.maxLength(3)]
    });
 ```
You can use built-in validator provided by this library or create your own validator (I promise it's easy).
>> add example
### Error object
Error object will be generated according to specified validators. 
You can get error object in ```props.form.errors[controlname]```.

Error object has property name indicating what validator that control violate and it's value is detail about the error you can leverage (eg. showing more meaningful error message)
 
 
 As above example, there'll be initial error for `name` and `lastname` controls.
 
 ```javascript
  props.form.errors['name']; // { required: true, minLength: {length: 0, minRequired:3 }}
  props.form.errors['lastname']; // { maxLength:{length: 12, maxRequired:3 }}
 ```
 
 You can use error object for showing in error message and/or prevent submit if there's an error. We will explain in <a href="https://github.com/Elecweb/react-craftform/blob/master/README.md#error-message">Error message section</a> and <a href="https://github.com/Elecweb/react-craftform/blob/master/README.md#preventing-submit-form-if-theres-an-error">preventing user submit form section</a>
 
  ### Built-in validator
  
|       Function      |         String         |  example of error object
| ------------------- | ---------------------- | ------- |
| validator.required  |    "required"          |   { required:true }      |
| validator.minLength(minRequired)  | - |  { minLength:{ length:3, minRequired:4 } `length` is current length of control |
| validator.maxLength(maxRequired)  | - |  { maxLength:{ length:6, maxRequired:4 } `length` is current length of control | 
  
  
  ### Custom validator 
  
  Validator is just a function. You can provide your own easily. 
   ```javascript    
    ...
    const haveToBeCat = (val) => {
      if(val === "cat"){ 
          return false;
      }else{
          return {
              havetoBeCat:true
          }
      }
    };
   
    export default withForm(MyForm,{
      name:["",[haveToBeCat]],
      lastname:["myinitilCode",validator.maxLength(3)]
    });
 ```
 
 In the above example, we create function called `haveToBeCat`. It will be called and provided current value of control to first parameter by library so you can use it to check current value against your specified rule.
 
When create your own custom validator, just remember 2 things
 
  1) if value is valid, just return false.
  2) if value is invalid, return object which propery name is meaningful name. You will be use that name for showing error message. 
 
 `haveToBeCat` works great but you can refactor `haveToBeCat` to be more reuseable.
 
 ```javascript
    const haveToBeSomething = (word) => {
        return (val) => {
            if(val === word){
                return false;
            }else{
                return {
                     havetoBeSomething:{
                       expectedValue:word,
                       value:val
                      }
                }
            }
        }

    };

    const haveToBeCat = haveToBeSomething("cat");
    const haveToBeDog = haveToBeSomething("dog");
   
    export default withForm(MyForm,{
      name:["",[haveToBeCat]],
      lastname:["myinitilCode",haveToBeDog]
    });
   ```
   
May functional programing be with you.
 
## Showing error message
 You can provide error message by calling `errorMessage` function. It accept one parameter and return another function which accept error object and return component we provide. It use <a href="https://www.sitepoint.com/currying-in-functional-javascript/" >currying function style</a>.
 
If you're confused, don't worry just let code exlain itself.
 
```javascript
  ...
  import {withForm, validator, hasError, errorMessage} from 'react-craftform';

  const MyForm = (props) => {
    return (
     <form>
          <section className="name_section">
              <label>Name</label>
              <input type="text" className="name" onChange={props.form.handleChange("name")} value={props.form.values['name']}/>
          </section>
          <p>Name Value: {props.form.values['name']} </p>
          {
            errorMessage({
                minLength:()=>{
                    return (<p>Please fill control with 5 length</p>);
                },
                required:()=>{
                    return (<p>Please fill input</p>);
                },        
            })(props.form.errors['name'])
          }
          <section className="code_section">
              <label>Last Name</label>
              <input type="text" className="code" onChange={props.form.handleChange("lastname")} value={props.form.values['lastname']} />
              
          </section>
          <p>LastName Value: {props.form.values['lastname']} </p>
          {
            errorMessage({
                minLength:()=>{
                    return (<p>Please fill control with 5 length</p>);
                },
                required:()=>{
                    return (<p>Please fill input</p>);
                },        
            })(props.form.errors['lastname'])
          }
      </form>
  );
}

export default withForm(MyForm,{
  name:["",["required"]],
  lastname:["",[validator.minLength(5)]]
});

```
>> add example

### Get rid of duplicated code
It works great but there's duplicated code for `name` and `lastname` controls. You can get rid of it by creating function and return invoking `errorMessage` function. 

```javascript
const errorSpec =  errorMessage({
    minLength:()=>{
        return (<p>Please fill control with 5 length</p>);
    },
    required:()=>{
        return (<p>Please fill input</p>);
    }
});

const MyForm = (props) => {
  return (
     <form>
          <section className="name_section">
              <label>Name</label>
              <input type="text" className="name" onChange={props.form.handleChange("name")} value={props.form.values['name']}/>
          </section>
          <p>Name Value: {props.form.values['name']} </p>
          {
            errorSpec(props.form.errors['name'])
          }
          <section className="code_section">
              <label>Last Name</label>
              <input type="text" className="code" onChange={props.form.handleChange("lastname")} value={props.form.values['lastname']} />
              
          </section>
          <p>LastName Value: {props.form.values['lastname']} </p>
          {
            errorSpec(props.form.errors['lastname'])
          }
      </form>
  );
}
```
>> add example
Just assign variable to `errorMessage` with how to render error message.

### Showing error with information

You can provide information easily for showing error message

```javascript
const errorSpec = (name) => {
    return errorMessage({
        minLength:()=>{
            return (<p>Please fill control {name} with 5 length</p>);
        },
        required:()=>{
            return (<p>Please fill control {name}</p>);
        }
    });
};

...
const MyForm = (props) => {
         return (
          ...
          {
            errorSpec('name')(props.form.errors['name'])
          }
          ..
          )
}
```
>> add example

### Showing error message with custom validator

It's the same as built-in validator. Let me show you

 ```javascript
    const haveToBeSomething = (word) => {
        return (val) => {
            if(val === word){
                return false;
            }else{
                return {
                    havetoBeSomething:{
                      expectedValue:word,
                      value:val
                    }
                }
            }
        }

    };

    const haveToBeCat = haveToBeSomething("cat");
    const haveToBeDog  haveToBeSomething("dog");
   
    const errorSpec = () => {
        return errorMessage({
            ...
            havetoBeSomething:() => {
                return (<p>Please fill cat!</p>)
            }
        });
    };
   ```
 >> add example
  
It's easy but there's one problem, error message for `havetoBeSomething` assume to be "cat". How about "dog"? 

Luckily we can handle this issue in easy way.


### Using error object for more meaningful error message

```javascript
     const errorSpec = () => {
        return errorMessage({
            ...
            havetoBeSomething:(def) => {
                return (<p>Please fill {def.expectedValue}! Now you provide {def.value}</p>)
            }
        });
    };
```
>> add example
`errorMessage` will be provided corresponding error object in parameter of function. So you can use it for providing more meaningful error message. 

`validator.minLength` and `validator.maxLength` are also provide error object. you can look at <a href="https://github.com/Elecweb/react-craftform/blob/master/README.md#built-in-validator">here</a>

## How to handle form submit

`withForm` doesn't handle submit form. We want you to have full control. 

Provided props to `withForm` component will go to your form component as well. So you can add callback for `onSubmit` event via props.

```javascript
const MyForm = (props) => {
  const onSubmit = (evt) => {
    evt.preventDefault();
    props.onSubmit(props.form.values);
  };
  return (
     <form onSubmit={onSubmit}>
          <section className="name_section" >
              <label>Name</label>
              <input type="text" className="name" onChange={props.form.handleChange("name")} value={props.form.values['name']}/>
          </section>
          <p>Name Value: {props.form.values['name']} </p>
          {
            errorSpec()(props.form.errors['name'])
          }
          <section className="code_section">
              <label>Last Name</label>
              <input type="text" className="code" onChange={props.form.handleChange("lastname")} value={props.form.values['lastname']} />
              
          </section>
          <p>LastName Value: {props.form.values['lastname']} </p>
          {
            errorSpec()(props.form.errors['lastname'])
          }
          <button type="submit">Submit</button>
      </form>
  );
}
```

>> add example
There's no difference for handling form in normal way, except you can get value from `props.form.values` which it's object whose properies is control name and it's value is corresponding control value.

### Preventing form submit if there's an error

You can check there's an error easily with `hasError` function.

```javascript
 ...
 const MyForm = (props) => {
  const onSubmit = (evt) => {
    evt.preventDefault();
    if(hasError(props.form.errors)){
        window.alert("There's an error");
    }else{
        props.onSubmit(props.form.values);
    }
    
  };
  return (
     <form onSubmit={onSubmit}>
     ...
  );
}
```
>> add example



