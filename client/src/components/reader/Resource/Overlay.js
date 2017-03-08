import React, { PureComponent, PropTypes } from 'react';
import { Resource } from 'components/reader';
import { browserHistory } from 'react-router';

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
    const closeUrl = `/read/${textId}/section/${sectionId}`;
    browserHistory.push(closeUrl);
  }

  render() {
    return (
      <div className="overlay-full-secondary bg-neutral90">
        <div onClick={this.handleClose} className="overlay-close">
          Close
          <i className="manicon manicon-x"></i>
        </div>
        <Resource.Detail
          resource={this.props.resource}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}
