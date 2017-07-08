import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Resource } from "components/reader";
import lh from "helpers/linkHandler";

export default class ResourceOverlay extends PureComponent {
  static propTypes = {
    resource: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(eventIgnored) {
    const { textId, sectionId } = this.props.match.params;
    const closeUrl = lh.link("readerSection", textId, sectionId);
    this.props.history.push(closeUrl);
  }

  render() {
    const { resource } = this.props;
    const resourceUrl = lh.link(
      "frontendProjectResource",
      resource.attributes.projectId,
      resource.id
    );

    return (
      <div className="overlay-full-secondary bg-neutral90">
        <div onClick={this.handleClose} className="overlay-close">
          Close
          <i className="manicon manicon-x" />
        </div>
        <Resource.Detail
          resource={resource}
          resourceUrl={resourceUrl}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}
