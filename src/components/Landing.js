import React from 'react';
import TodoContainer from './TodoContainer';
import '../css/Landing.css';

const Landing = () => (
  <main>
    <section>
      <header>
        Current Assignments
      </header>
      <TodoContainer />
    </section>
  </main>
);


export default Landing;
