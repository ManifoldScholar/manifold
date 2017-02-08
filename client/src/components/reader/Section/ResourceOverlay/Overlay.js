import React, { PureComponent, PropTypes } from 'react';
import ResourceDetail from './ResourceDetail';

export default class ResourceOverlay extends PureComponent {

  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    return (
      <div className="overlay-full-secondary bg-neutral90">
        <div className="overlay-close">
          Close
          <i className="manicon manicon-x"></i>
        </div>
        <ResourceDetail
            resource={this.props.resource}
        />
      </div>
    );
  }
}
