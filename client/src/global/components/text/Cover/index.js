import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import get from "lodash/get";
import Utility from "global/components/utility";
import * as Styled from "./styles";

class TextCover extends PureComponent {
  static displayName = "Text.Cover";

  static propTypes = {
    text: PropTypes.object.isRequired,
    iconOnly: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    iconOnly: false
  };

  get text() {
    return this.props.text;
  }

  get hasCover() {
    if (this.props.iconOnly) return false;
    return get(this.text.attributes, "coverStyles.small");
  }

  get altText() {
    return (
      this.text.attributes.coverAltText ||
      this.props.t("img_alts.entity_cover", {
        entity: this.text.attributes.titlePlaintext
      })
    );
  }

  render() {
    return (
      <Styled.Cover $hasCover={this.hasCover}>
        {this.hasCover ? (
          <Styled.Image
            src={this.text.attributes.coverStyles.small}
            alt={this.altText}
          />
        ) : (
          <Utility.IconComposer size={78} icon="textsLoosePages64" />
        )}
      </Styled.Cover>
    );
  }
}

export default withTranslation()(TextCover);
