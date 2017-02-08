import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import FormattedDate from 'components/global/FormattedDate';
import Icon from './Icon'

export default class ResourceTitle extends Component {

  static displayName = "Resource.Title";

  static propTypes = {
    resource: PropTypes.object,
    showIcon: PropTypes.bool,
  };

  static defaultProps = {
    showIcon: true,
    showDate: true
  };

  render() {
    const attr = this.props.resource.attributes;

    return (
      <header className="resource-title">
        {this.props.showIcon ?
          <figure className={`resource-icon ${attr.kind}`}>
            <Icon.Composer kind={attr.kind}/>
          </figure> : null
        }
        <h1>
          {attr.title}
        </h1>
        {this.props.showDate ?
          <span className="resource-date">
            <FormattedDate
                format="MMMM, YYYY"
                date={attr.createdAt}
            />
          </span> : null
        }
      </header>
    );
  }
}