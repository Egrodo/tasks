import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Route, Redirect } from 'react-router-dom';
import Validator from 'email-validator';
import axios from 'axios';
import InlineError from './reuse/InlineError';
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
      check: false,
      success: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onTerm = this.onTerm.bind(this);
  }

  onSubmit() {
    // Validate things, then axios req.
    let errors = this.validate(this.state.data);
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ loading: true });

    const user = { email: this.state.data.email, password: this.state.data.password };
    axios.post('http://localhost:3001/signup', user)
      .then((res) => {
        if (res.status === 200) {
          // Handle successful login.
          console.log('success');
          this.setState({ errors: {}, loading: false, success: true });
        } else throw new Error('Failed signup');
      }).catch((err) => {
        if (err.response.status === 409) {
          errors = this.state.errors;
          errors.email = 'Email already signed up, try a new one?';
          this.setState({ errors, loading: false });
        }
      });
  }

  onChange(e) {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });
  }

  onTerm() {
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
    if (this.state.success) return <Redirect to="/todo" />;
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

export default Signup;
