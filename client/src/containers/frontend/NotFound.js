import React, { Component } from 'react';
import { throttle } from 'lodash';

export default class NotFound extends Component {
  render() {
    return (
      <section className="error-page" ref="fillHeight">
        <div className="error-wrapper">
          <div className="container">
            <header>
              <div className="stop-sign">
                <i className="manicon manicon-octagon"></i>
                <i className="manicon manicon-bang"></i>
              </div>
              <h3>
                {'We\'re at a bit of a loose end.'}<br/>
                {'Frightfully sorry.'}
              </h3>
            </header>

            <div className="error-description">
              <h1>
                404 error. The System is Down.
              </h1>
              <p>
                Etiam porta sem malesuada magna mollis euismod.
                Aenean lacinia bibendum nulla sed consectetur.
                Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                Maecenas faucibus mollis interdum. Fusce dapibus,
                tellus ac cursus commodo, tortor mauris condimentum nibh,
                ut fermentum massa justo sit amet risus.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
