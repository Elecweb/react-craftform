# react-craftform
<img src="https://travis-ci.org/Elecweb/react-craftform.svg?branch=master">
<a href='https://coveralls.io/github/Elecweb/react-craftform?branch=master'><img src='https://coveralls.io/repos/github/Elecweb/react-craftform/badge.svg?branch=master' alt='Coverage Status' /></a>

React form library with full customizable.

## Installation
  ``` npm install react-craftform --save```

## Usage
  ```react-craftform``` created with <a href="https://facebook.github.io/react/docs/higher-order-components.html">HOC</a> in mind. ```react-craftform``` provide method call ```withForm``` for providing existing form with power! For example 

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
## Create Form with withForm
  
## Validation
  ### Built-in validator
  
  ### Custom validator

## Error message

## Use withForm with Container component
