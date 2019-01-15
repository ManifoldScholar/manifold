import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockWrapper extends PureComponent {
  static displayName = "Project.Content.Block.Wrapper";

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <section>
        <div className="container entity-section-wrapper">
          {this.props.children}
        </div>
      </section>
    );
  }
}
