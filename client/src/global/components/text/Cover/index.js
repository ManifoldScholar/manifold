import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default class TextCover extends PureComponent {
  static displayName = "Text.Cover";

  static propTypes = {
    text: PropTypes.object.isRequired,
    iconOnly: PropTypes.bool
  };

  static defaultProps = {
    iconOnly: true
  };

  get text() {
    return this.props.text;
  }

  get hasCover() {
    if (this.props.iconOnly) return false;
    return get(this.text.attributes, "coverStyles.small");
  }

  render() {
    return (
      <Styled.Cover $hasCover={this.hasCover}>
        {this.hasCover ? (
          <Styled.Image
            src={this.text.attributes.coverStyles.small}
            alt={"Cover of " + this.text.attributes.titlePlaintext}
          />
        ) : (
          <Utility.IconComposer size={78} icon="textsLoosePages64" />
        )}
      </Styled.Cover>
    );
  }
}
