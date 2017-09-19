# react-craftform
<img src="https://travis-ci.org/Elecweb/react-craftform.svg?branch=master">
<a href='https://coveralls.io/github/Elecweb/react-craftform?branch=master'><img src='https://coveralls.io/repos/github/Elecweb/react-craftform/badge.svg?branch=master' alt='Coverage Status' /></a>

React form library with full customizable.

## Installation
  ``` npm install react-craftform --save```

## Usage
  ```react-craftform``` created with <a href="https://facebook.github.io/react/docs/higher-order-components.html">HOC</a> in mind. ```react-craftform``` provide function called ```withForm``` for providing existing form with power!

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
//add example

## Create form with `withForm`
  `withForm` take 2 parameters. First parameter it takes is your form component. Second parameter is description about your controls.
  
  Let's take a look at `withForm`.
  
  ```javascript
   export default withForm(MyForm,{
      name:["",["required"]],
      lastname:["myinitilCode"]
    });
  ```
  `MyForm` component recieve function via `props` for managing control (eg. handling `onChange` event, geting value and error).
  
  Second parameter is object which property name is your control name. Each control name's value is array which specify inital value at index `0` and Validators in index `1`.
  
  In above code we tell `withForm` that it has 2 controls which name are `name` and `lastname`. `name` control have no initial value
  and is required. `lastname` control have initial value "initialCode" and is opional.
  
## Handling change on input
  withForm doesn't update value for you so that you can customize as you want. Instead, it help you by providing `form` via props with function for update value.
  In `form` props, there's `handleChange` method for update value. `handleChange` accept control name.
  
  ```html
     <input type="text" className="name" onChange={props.form.handleChange("name")} value={props.form.values['name']}/>
     <input type="text" className="code" onChange={props.form.handleChange("lastname")} value={props.form.values['lastname']} />
  ```
  
## Getting value
    You can get value of control in `props.form.values[controlname]`. As above exmaple, we pass `props.form.values['name']` to input attribute value for `name` control and  `props.form.values['lastname']` for `lastname` control.
  
## Validation
 You can add validation easily in description object.
 ```
    import { validator } from 'react-craftform';
    
    ...
    
    export default withForm(MyForm,{
      name:["",["required",validator.minLength3)]],
      lastname:["myinitilCode",validator.maxLength(3)]
    });
 ```
 You can use built-in validator which provide by this library or create your own validator (I promise it's easy).
 
 Error object will be generated according to specified validation. You can get error object in ```props.form.errors[controlname]```.


Error object has property name indicating what validation that control violate and it's value is detail you can leverage.
 
 As above example, there'll be inital error for `name` and `lastname` controls.
 
 ```javascript
  props.form.errors['name']; // { required: true, minLength: {length: 0, minRequired:3 }}
  props.form.errors['lastname']; // { maxLength:{length: 12, maxRequired:3 }}
 ```
 
 You can use error object for showing error message and/or prevent submit if there's an error. We will explain in <a>Error message</a> section and <a>preventing user submit</a> form section
 
  ### Built-in validator
  
|       Function      |         String         |  error object
| ------------------- | ---------------------- | ------- |
| validator.required  |    "required"          |   { required:true }      |
| validator.minLength(minRequired)  | - |  { minLength:{ length:3, minRequired:4 } `length` is current length of control |
| validator.maxLength(maxRequired)  | - |  { maxLength:{ length:6, maxRequired:4 } `length` is current length of control | 
  
  
  ### Custom validator 
  
  Validator is just a function. You can provide your own easily. 
   ```javascript
    import { validator } from 'react-craftform';
    
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
 
 In the above example, we create function called `haveToBeCat` which will be called and provide current value of control to first parameter by library. 
 When create your own custom validator, just remember 2 things
 
  1) if value is valid, just return false
  2) if value is invalid, return object which propery name is meaningful name. You will be use the name for showing error message. 
  
 You can refactor `haveToBeCat` to be more reuseable.
 
 ```javascript
    const haveToBeSomething = (word) => {
        return (val) => {
            if(val === word){
                return false;
            }else{
                return {
                    havetoBeCat:true
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
 
## Error message
 You can provide error message by call `errorMessage` function. it accpet one parameter and return another function which accept error object and return component we provide. It use <a href="https://www.sitepoint.com/currying-in-functional-javascript/" >currying function style.</a>
 
```javascript
  import React from 'react';
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
### Get rid of duplicated code
There's duplicated code. You can get rid of it by creating function and return invoking `errorMessage` function. 

```javascript
const errorSpec = () => {
    return errorMessage({
        minLength:()=>{
            return (<p>Please fill control with 5 length</p>);
        },
        required:()=>{
            return (<p>Please fill input</p>);
        }
    });
};

const MyForm = (props) => {
  return (
     <form>
          <section className="name_section">
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
      </form>
  );
}
```
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

### Showing error with custom validation
It's the same as built-in validation. Let me show you
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
  
It's easy but there's one problem, error message for `havetoBeSomething` assume to be "cat". How about "dog"? Luckily we can handle this issue in easy way.

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

`errorMessage` will provide corresponding error object in parameter of function. So you can use it for providing more meaningful error message. 
`validator.minLength` and `validator.maxLength` are also provide error object which have `length` for current length and `minRequired` and `maxRequired` respectively for indicating min length and max length it require

## Use withForm with Container component

## case

## on Submit
