import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectHeroCredits extends PureComponent {
  static displayName = "ProjectHero.Credits";

  static propTypes = {
    wrapperClassName: PropTypes.string,
    blockClass: PropTypes.string,
    copy: PropTypes.string.isRequired
  };

  render() {
    if (!this.props.copy) return null;

    return (
      <div className={this.props.wrapperClassName}>
        <div className={`${this.props.blockClass}__credits-block`}>
          <div
            className={`${this.props.blockClass}__credits-text`}
            dangerouslySetInnerHTML={{ __html: this.props.copy }}
          />
        </div>
      </div>
    );
  }
}
