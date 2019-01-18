import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import classNames from "classnames";
import { Icon } from "global/components/svg";

export default class TextCover extends PureComponent {
  static displayName = "Text.Cover";

  static propTypes = {
    text: PropTypes.object.isRequired,
    blockClass: PropTypes.string
  };

  static defaultProps = {
    new: false
  };

  // Since we only have demo icons at this point, thumbnail can either be an image or a
  // placeholder icon
  renderThumbnail(text) {
    let thumbnail = null;
    if (get(text.attributes, "coverStyles.small")) {
      thumbnail = (
        <img
          src={text.attributes.coverStyles.small}
          alt={"Thumbnail image for " + text.attributes.titlePlaintext}
          classNames={classNames(this.props.blockClass)}
        />
      );
    } else {
      thumbnail = (
        <Icon.LoosePages
          size={78}
          iconClass={classNames(this.props.blockClass)}
        />
      );
    }
    return thumbnail;
  }

  render() {
    return this.renderThumbnail(this.props.text);
  }
}
