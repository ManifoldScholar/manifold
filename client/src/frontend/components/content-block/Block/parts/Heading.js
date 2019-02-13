import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockHeading extends PureComponent {
  static displayName = "Project.Content.Block.Parts.Heading";

  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  };

  render() {
    const { title, icon, description } = this.props;
    if (!title || !icon) return null;

    return (
      <React.Fragment>
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
        {description && (
          <div className="entity-section-wrapper__details">
            <div
              className="description pad-bottom"
              dangerouslySetInnerHTML={{
                __html: description
              }}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}
