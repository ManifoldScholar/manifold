import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

export default class Splash extends Component {

  static displayName = "Layout.Splash";

  static propTypes = {
    authenticated: PropTypes.bool,
    toggleSignInUpOverlay: PropTypes.func
  };

  constructor() {
    super();
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(event) {
    event.preventDefault();
    this.props.toggleSignInUpOverlay();
  }

  render() {
    return (
      <section className="bg-accent-primary">
        <div className="container rel">
          <div className="splash-50">
            <div className="left">
              <h2 className="heading-primary">
                {'Welcome to Manifold. An Intuitive, collaborative, ' +
                'open-source platform for scholarly publishing'}
              </h2>
              <p>
                {'With iterative texts, powerful annotation tools, ' +
                'rich media support, and robust community dialogue, ' +
                'Manifold transforms scholarly publications into ' +
                'living digital works.'}
              </p>
              <nav className="buttons">
                <a
                  href="http://manifold.umn.edu/"
                  target="blank"
                  className="button-bare-primary"
                >
                  {'Learn More'}
                </a>
                {!this.props.authenticated ?
                  <Link
                    to="#"
                    onClick={this.handleSignUp}
                    target="blank"
                    className="button-bare-primary"
                  >
                    {'Sign Up'}
                  </Link> : null
                }
              </nav>
            </div>
            <figure className="right">
              <img src="/static/images/browse-splash_manifold-devices.png" />
            </figure>
          </div>
        </div>
      </section>
    );
  }
}
