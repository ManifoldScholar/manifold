import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer-reader">
        <div className="container">
          <section className="colophon">
            <i className="manicon manicon-manifold-logo"></i>
            <p>
              {'© Gary Hall and contributors. All rights reserved.'}<br/>
              {'Published with permission by the University of Minnesota Press.'}
            </p>
          </section>
        </div>
      </footer>
    );
  }
}
