import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class NameWithArrow extends React.PureComponent {
  static propTypes = {
  };

  get name() {
    return this.props.name;
  }

  get hoverArrowClassNames() {
    return "table__hover-arrow";
  }

  get nameContainerClassNames() {
    return "table__name-container"
  }

  render() {
    return (
      <React.Fragment>
        <span className={this.nameContainerClassNames}>
          {this.name}
        </span>
        <Utility.IconComposer
          icon="arrowRight16"
          size={18}
          iconClass={this.hoverArrowClassNames}
        />
      </React.Fragment>
    )
  }
}
