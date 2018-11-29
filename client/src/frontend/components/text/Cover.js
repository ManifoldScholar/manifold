import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Text from "global/components/text";
import get from "lodash/get";

export default class TextCover extends PureComponent {
  static displayName = "Text.Thumbnail";

  static propTypes = {
    text: PropTypes.object.isRequired
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
        />
      );
    } else {
      thumbnail = <Text.Placeholder />;
    }
    return thumbnail;
  }

  render() {
    return this.renderThumbnail(this.props.text);
  }
}
