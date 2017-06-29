import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Utility, Resource } from 'components/frontend';

export default class ResourceDetail extends Component {

  static displayName = "Resource.Detail";

  static propTypes = {
    attributes: PropTypes.object,
    buttonClass: PropTypes.string
  };

  static defaultProps = {
    buttonClass: 'button-primary'
  };

  renderButton(attr) {
    let button;
    switch (attr.kind.toLowerCase()) {
      case "link":
        button = (
            <a
              href={attr.externalUrl}
              className={this.props.buttonClass}
              target="_blank"
            >
              Visit Page <i className="manicon manicon-arrow-right"></i>
            </a>
        );
        break;
      default:
        button = (attr.downloadable ?
            <a
              href={attr.attachmentStyles.original}
              className={this.props.buttonClass}
              target="_blank"
            >
              Download <i className="manicon manicon-arrow-down"></i>
            </a>
            : null
        );
        break;
    }

    return button;
  }

  render() {
    return this.renderButton(this.props.attributes);
  }
}
