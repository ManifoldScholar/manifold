import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockIdentity extends PureComponent {
  static displayName = "Project.Content.Block.Parts.Identity";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    return (
      <React.Fragment>
        <Utility.IconComposer icon={this.props.icon} size={50} />
        {this.props.title}
      </React.Fragment>
    );
  }
}
