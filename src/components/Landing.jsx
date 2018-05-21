import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import '../css/Landing.css';

class Landing extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <section className="landing">
        <header>
          Task Manager
        </header>
        <article className="desc">
          Welcome to Task Manager, a simple and stylistic way to manage and
           schedule your daily tasks. Made using React, Express, and Mongo by
          <a href="https://noahyamamoto.com" target="_blank" rel="noreferrer noopener"> Noah Yamamoto</a>.
        </article>
        <nav>
          <Link to="/login">
            <Button content="Login" size="huge" color="teal" fluid />
          </Link>
          <Link to="/signup">
            <Button content="Signup" size="huge" fluid />
          </Link>
        </nav>
      </section>
    );
  }
}

export default Landing;
