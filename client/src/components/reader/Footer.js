import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helper } from 'components/global';

export default class Footer extends Component {

  static propTypes = {
    text: PropTypes.object
  };

  getFooterText(text) {
    if (!text.attributes.rights) return null;
    return (
      <Helper.SimpleFormat text={text.attributes.rights} />
    );
  }

  render() {
    return (
      <footer className="footer-reader">
        <div className="container">
          <div className="rel">
            <section className="colophon">
              <i className="manicon manicon-manifold-logo"></i>
              {this.getFooterText(this.props.text)}<br/>
            </section>
          </div>
        </div>
      </footer>
    );
  }
}
