import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";

export default class IconComputedProjectCollection extends PureComponent {
  static displayName = "IconComputed.ProjectCollection";

  static propTypes = {
    icon: PropTypes.string.isRequired
  };

  static defaultProps = {
    size: 48
  };

  iconForValue(value) {
    const map = {
      "book-stack-vertical": "projectCollections64",
      lamp: "lamp64",
      "new-round": "new64",
      "books-on-shelf": "projects64",
      globe: "globe64",
      touch: "touch64",
      mug: "mug64"
    };
    return map[value];
  }

  render() {
    const { icon, ...childProps } = this.props;
    return (
      <Utility.IconComposer icon={this.iconForValue(icon)} {...childProps} />
    );
  }
}
