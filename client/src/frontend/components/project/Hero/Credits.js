import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectHeroCredits extends PureComponent {
  static displayName = "ProjectHero.Credits";

  static propTypes = {
    blockClass: PropTypes.string,
    copy: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className={`${this.props.blockClass}__credits-block`}>
        <div
          className={`${this.props.blockClass}__credits-text`}
          dangerouslySetInnerHTML={{ __html: this.props.copy }}
        />
      </div>
    );
  }
}
