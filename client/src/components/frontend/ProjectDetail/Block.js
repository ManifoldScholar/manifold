import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Utility } from "components/global";
import { Event } from "components/frontend";

export default class ProjectDetailBlock extends PureComponent {
  static displayName = "ProjectDetail.Block";

  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
  };

  render() {
    const { title, icon, children } = this.props;

    return (
      <section>
        <div className="container entity-section-wrapper">
          <header className="section-heading">
            <div className="main">
              {icon && (
                <i className="manicon" aria-hidden="true">
                  <Utility.IconComposer icon={icon} />
                </i>
              )}
              <div className="body">
                <h4 className="title">{title}</h4>
              </div>
            </div>
          </header>
          {children}
        </div>
      </section>
    );
  }
}
