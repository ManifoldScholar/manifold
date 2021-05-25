import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ContentBlockHeading extends PureComponent {
  static displayName = "ContentBlock.Parts.Heading";

  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  };

  render() {
    const { title, icon, description } = this.props;
    if (!title || !icon) return null;

    return (
      <>
        <header className="entity-section-wrapper__heading section-heading">
          <div className="main">
            <Utility.IconComposer icon={icon} size={56} />
            <div className="body">
              <h2 className="title">{title}</h2>
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
      </>
    );
  }
}
