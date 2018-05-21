import React from 'react';
import { Link } from 'react-router-dom';

const notFound = () => {
  return (
    <section className="notFound">
      <header>
        404
      </header>
      <article>
        Sorry, this is an invalid URL. Wanna go <Link to="/">home</Link> instead?
      </article>
    </section>
  );
};

export default notFound;
