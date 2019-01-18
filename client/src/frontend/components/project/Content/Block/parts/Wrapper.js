import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ProjectContentBlockWrapper extends PureComponent {
  static displayName = "Project.Content.Block.Wrapper";

  static propTypes = {
    children: PropTypes.node.isRequired,
    additionalClasses: PropTypes.string
  };

  render() {
    return (
      <section className={classNames(this.props.additionalClasses)}>
        <div className="container entity-section-wrapper">
          {this.props.children}
        </div>
      </section>
    );
  }
}
