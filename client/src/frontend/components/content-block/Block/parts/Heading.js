import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockHeading extends PureComponent {
  static displayName = "Project.Content.Block.Parts.Heading";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    const { title, icon } = this.props;

    return (
      <header className="entity-section-wrapper__heading section-heading">
        <div className="main">
          <i className="manicon" aria-hidden="true">
            <Utility.IconComposer icon={icon} />
          </i>
          <div className="body">
            <h4 className="title">{title}</h4>
          </div>
        </div>
      </header>
    );
  }
}
