import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class DashboardPanel extends PureComponent {
  static displayName = "Layout.DashboardPanel";

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    title: PropTypes.node,
    icon: PropTypes.string
  };

  get title() {
    return this.props.title;
  }

  get icon() {
    return this.props.icon;
  }

  render() {
    return (
      <div className="dashboard-panel">
        {this.title && (
          <header className="section-heading-secondary">
            <h2>
              {this.icon && <Utility.IconComposer icon={this.icon} />}
              {this.title}
            </h2>
          </header>
        )}
        <div className="panel">{this.props.children}</div>
      </div>
    );
  }
}
