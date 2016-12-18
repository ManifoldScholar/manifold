import React, { Component, PropTypes } from 'react';

export default class FatalError extends Component {

  static propTypes = {
    title: PropTypes.string,
    detail: PropTypes.string,
    status: PropTypes.any
  }

  render() {
    const error = this.props.error;
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
                {error.status} error. {error.title}
              </h1>
              <p>
                {error.detail}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
