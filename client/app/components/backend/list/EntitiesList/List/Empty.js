import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withTranslation } from "react-i18next";

class ListEntitiesListEmpty extends PureComponent {
  static displayName = "List.Entities.List.Empty";

  static propTypes = {
    message: PropTypes.node,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"]),
    t: PropTypes.func
  };

  get message() {
    const t = this.props.t;
    if (this.props.message) {
      return this.props.message;
    } else {
      return t("messages.no_results");
    }
  }

  render() {
    const { listStyle } = this.props;

    const wrapperClasses = classNames({
      "entity-list__empty-message": true,
      "entity-list__empty-message--well": listStyle === "well"
    });

    return <div className={wrapperClasses}>{this.message}</div>;
  }
}

export default withTranslation()(ListEntitiesListEmpty);
