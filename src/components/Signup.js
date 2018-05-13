import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import Validator from 'email-validator';
import axios from 'axios';
import '../css/Signup.css';

class Signup extends Component {
  constructor() {
    super();

    this.state = {
      data: {
        email: '',
        password: '',
        confirmP: '',
      },
      terms: false,
      errors: {},
      loading: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onTerm = this.onTerm.bind(this);
  }

  onSubmit() {
    // Validate things, then axios req.
    const errors = this.validate(this.state.data);
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ loading: true });
  }

  onChange(e) {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });
  }

  onTerm(e) {
    this.setState({ terms: !this.state.terms });
  }

  validate(data) {
    const errors = {};
    if (!Validator.validate(data.email)) errors.email = 'Invalid email';
    if (!data.email) errors.email = "Email can't be blank";
    if (!data.password) errors.password = "Password can't be blank";
    if (!data.confirmP) errors.confirmP = 'Must confirm password';
    if (data.confirmP !== data.password) {
      errors.confirmP = "Passwords don't match";
      errors.password = true;
    }
    if (!this.state.terms) errors.terms = true;
    return errors;
  }

  render() {
    const { data, errors } = this.state;
    return (
      <section className="signup">
        <header>
          Signup
        </header>
        <Form onSubmit={this.onSubmit}>
          <Form.Input
            value={data.email}
            name="email"
            type="email"
            id="email"
            onChange={this.onChange}
            label="Email"
            placeholder="example@example.com"
            error={!!errors.email}
          />
          {errors.email && <InlineError text={errors.email} />}
          <Form.Input
            value={data.password}
            name="password"
            type="password"
            id="password"
            onChange={this.onChange}
            label="Password"
            placeholder="Make it strong"
            error={!!errors.password}
          />
          {errors.password && <InlineError text={errors.password} />}
          <Form.Input
            value={data.confirmP}
            name="confirmP"
            type="password"
            id="confirmP"
            onChange={this.onChange}
            label="Confirm Password"
            placeholder="Confirm Password"
            error={!!errors.confirmP}
          />
          {errors.confirmP && <InlineError text={errors.confirmP} />}
          <Form.Checkbox
            className="signup"
            checked={this.state.terms}
            onChange={this.onTerm}
            label="I agree to the terms and conditions."
            error={errors.terms}
          />
          <Form.Group widths="equal">
            <Route render={({ history }) => (
              <Button
                content="Cancel"
                onClick={() => { history.push('/'); }}
                type="button"
                size="huge"
                floated="left"
                fluid
              />
            )}
            />
            <Button
              type="submit"
              size="huge"
              floated="right"
              color="teal"
              loading={this.state.loading}
              fluid
            >
              Submit
            </Button>
          </Form.Group>
        </Form>
      </section>
    );
  }
}
const InlineError = ({ text }) => (
  <span style={{ color: '#ae5856' }}>{text}</span>
);

export default Signup;
