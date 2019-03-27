import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ListEntitiesListButtonSet extends PureComponent {
  static displayName = "List.Entities.List.ButtonSet";

  static propTypes = {
    buttons: PropTypes.array.isRequired
  };

  get buttons() {
    return this.props.buttons;
  }

  render() {
    return (
      <div className="entity-list__button-set">
        {this.buttons.map((button, i) => React.cloneElement(button, { key: i }))}
      </div>
    )
  }
}
