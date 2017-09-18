# react-craftform
<img src="https://travis-ci.org/Elecweb/react-craftform.svg?branch=master">
<a href='https://coveralls.io/github/Elecweb/react-craftform?branch=master'><img src='https://coveralls.io/repos/github/Elecweb/react-craftform/badge.svg?branch=master' alt='Coverage Status' /></a>

React form library with full customizable.

## Installation
  ``` npm install react-craftform --save```

## Usage
  ```react-craftform``` created with <a href="https://facebook.github.io/react/docs/higher-order-components.html">HOC</a> in mind. ```react-craftform``` provide function called ```withForm``` for providing existing form with power! For example 

```
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

We will explianed what ```withForm``` function does.

## Create Form with withForm
  ```withForm``` take 2 parameters. First parameter it takes is your form component. Second parameter is description about inputs.
  It provide functions for your form component via props.
  Let's take a look at description in second parameter.
  ```
    {
       name:["",["required"]],
       lastname:["myinitalCode"]
    }
  ```
  It's object which property name your form will be used and it's value is array consisting of inital value in first index and validation in second one.
  
  In above code we provide object whose property called ```name``` and ```lastname```. We can use these name to get value and handle `onChange` event
  
  ```
     <input type="text" className="name" onChange={props.form.handleChange("name")} value={props.form.values['name']}/>
     <input type="text" className="code" onChange={props.form.handleChange("lastname")} value={props.form.values['lastname']} 
  ```
  As you can see, we use ```handleChange``` method which provide by ```withform``` for handle change and get value by call ```props.form.values```
  
  ```handleChange``` accect propery name which you provide in description object.
  ```props.form.values``` is object which properties name is same as description.
  
  You can also get error with ```props.form.errors``` object as well. We will explain it in Error message section.
  
## Validation
 You can add validation easily in description object.
 ```
    {
       name:["",["required"]],
       lastname:["myinitalCode"]
    }
 ```
 You can use built-in validator which provide by this library or create your own validator(I promise it's easy).
  ### Built-in validator
  For now there're 3 built-in validator and we'll provide more soon
  you can provide validator with string or function
|       Function      |         String         |
| ------------------- | ---------------------- |
| validator.required  |    "required"          |
| validator.minLength(minRequired)  | -        |
| validator.maxLength(maxRequired)  | -        |
  
  
  ### Custom validator

## Error message

## Use withForm with Container component
