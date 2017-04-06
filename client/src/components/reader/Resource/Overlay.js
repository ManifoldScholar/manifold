import React, { PureComponent, PropTypes } from 'react';
import { Resource } from 'components/reader';
import { browserHistory } from 'react-router';
import { linkHelpers as lh } from 'routes';

export default class ResourceOverlay extends PureComponent {

  static propTypes = {
    resource: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(event) {
    const { textId, sectionId } = this.props.params;
    const closeUrl = lh.readerSection(textId, sectionId);
    browserHistory.push(closeUrl);
  }

  render() {

    const { resource } = this.props;

    return (
      <div className="overlay-full-secondary bg-neutral90">
        <div onClick={this.handleClose} className="overlay-close">
          Close
          <i className="manicon manicon-x"></i>
        </div>
        <Resource.Detail
          resource={resource}
          resourceUrl={lh.frontendProjectResource(resource.attributes.projectId, resource.id)}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}
