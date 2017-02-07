import React, { PureComponent, PropTypes } from 'react';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import classNames from 'classnames';
import { Resource } from 'components/frontend';

export default class ResourceViewerSingle extends PureComponent {

  static displayName = "ResourceViewer.Single";

  static propTypes = {
    resource: PropTypes.object,
  };

  render() {
    const resource = this.props.resource;
    const variant = "smallLandscape";

    return (
        <div
            className="group-thumbnail"
        >
          <Resource.Thumbnail
            resource={resource}
            showTitle={false}
            showKind={false}
            variant={variant}
            additionalClasses="minimal preview"
          />
        </div>
    );
  }
}
