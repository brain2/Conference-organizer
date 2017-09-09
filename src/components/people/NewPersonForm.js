import React from 'react';
import {reduxForm, Field} from 'redux-form';
import emailValidator from 'email-validator';
import ErrorField from '../common/ErrorField';

function NewPersonForm(props) {
  
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <Field name="firstName" component={ErrorField} />
        <Field name="lastName" component={ErrorField} />
        <Field name="email" component={ErrorField} />
        <div>
          <input type="submit"/>
        </div>
      </form>
    </div>
  )
}

const validate = ({firstName, lastName, email}) => {
  const errors = {};
  
  if (!email) errors.email = 'email is required';
  else if (!emailValidator.validate(email)) errors.email = 'Invalid email';
  
  if (!firstName) errors.firstName = 'Firstname is required';
  //if (!lastName) errors.lastName = 'Lastname is required';
  
  return errors;
};

export default reduxForm({
  form: 'people',
  validate
})(NewPersonForm);