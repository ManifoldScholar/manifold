import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
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
            <Link to={attr.externalUrl} className={this.props.buttonClass} target="_blank">
              Visit Page <i className="manicon manicon-arrow-right"></i>
            </Link>
        );
        break;
      default:
        button = (attr.downloadable ?
            <Link to={attr.attachmentUrl} className={this.props.buttonClass} target="_blank">
              Download <i className="manicon manicon-arrow-down"></i>
            </Link>
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
