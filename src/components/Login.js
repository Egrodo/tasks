import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Validator from 'email-validator';
import InlineError from './reuse/InlineError';
import '../css/Login.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        email: '',
        password: '',
      },
      errors: {},
      loading: false,
      success: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });
  }

  onSubmit() {
    let errors = this.validate(this.state.data);
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ loading: true });

    const user = { email: this.state.data.email, password: this.state.data.password };
    axios.post('http://localhost:3001/login', user)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ errors: {}, loading: false, success: true });
          // TODO: Session stuffs, then send to /app.
        }
      }).catch((err) => {
        if (err.response.status === 422) {
          errors = this.state.errors;
          errors.email = true;
          errors.password = 'Invalid email / pass';
          this.setState({ errors, loading: false });
        } else console.error(err.response);
      });
  }

  validate(data) {
    const errors = {};

    if (!Validator.validate(data.email)) errors.email = 'Invalid email';
    if (!data.email) errors.email = "Email can't be blank";
    if (!data.password) errors.password = "Password can't be blank";
    return errors;
  }

  render() {
    if (this.state.success) return <Redirect to="/todo" />;
    const { data, errors } = this.state;
    return (
      <section className="login">
        <header>
          Login
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
            placeholder="Enter Password"
            error={!!errors.password}
          />
          {errors.password && <InlineError text={errors.password} />}
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

export default Login;
