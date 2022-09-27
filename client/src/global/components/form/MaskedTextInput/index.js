import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import fill from "lodash/fill";
import setter from "../setter";
import isString from "lodash/isString";
import Instructions from "../Instructions";
import FieldWrapper from "../FieldWrapper";
import BaseLabel from "../BaseLabel";
import * as Styled from "../BaseInput/styles";

class FormMaskedTextInput extends Component {
  static displayName = "Form.MaskedTextInput";

  static propTypes = {
    mask: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.array.isRequired
    ]),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClick: PropTypes.func,
    wide: PropTypes.bool,
    autoComplete: PropTypes.string
  };

  static defaultProps = {
    autoComplete: "off"
  };

  constructor() {
    super();
    this.placeholderChar = "\u005F"; // react-text-mask default "_"
  }

  get idPrefix() {
    return "masked-text";
  }

  get idForInstructionsPrefix() {
    return "masked-text-instructions";
  }

  currencyMask() {
    return createNumberMask({
      prefix: "$",
      allowDecimal: true
    });
  }

  hashTagMask() {
    return raw => {
      // eslint-disable-next-line
      const wordChar = /^#?[^\s!@#$%^&*()=+.\/,[{]};:'"?><]+$/;
      // eslint-disable-next-line
      const notWordChar = /[\s!@#$%^&*()=+.\/,[{]};:'"?><]+/g;
      const adjusted = raw.replace(notWordChar, "").replace("_", "");
      const length = adjusted.length;
      let mask = Array(length);
      mask.unshift("#");
      fill(mask, wordChar, 1);
      if (mask.length === 1) mask = [/#/];
      return mask;
    };
  }

  doiMask() {
    return raw => {
      const base = "https://doi.org/10.".split("");
      const wordChar = /^[A-Za-z0-9_.;()\-/]$/;
      const adjusted = raw.replace(/\s/g, "");
      const length = adjusted.length;
      let mask =
        length >= base.length ? Array(length - base.length) : Array(length);
      mask.unshift(...base);
      fill(mask, wordChar, base.length);
      if (mask.length === base.length) mask = base;
      return mask;
    };
  }

  mask() {
    switch (this.props.mask) {
      case "currency":
        return this.currencyMask();
      case "hashtag":
        return this.hashTagMask();
      case "doi":
        this.placeholderChar = "\u2000"; // white-space because we allow "_" in DOI
        return this.doiMask();
      default:
        return this.props.mask;
    }
  }

  render() {
    const mask = this.mask();

    return (
      <UIDConsumer>
        {id => (
          <FieldWrapper className={this.props.wide ? "wide" : undefined}>
            <BaseLabel
              id={`${this.idPrefix}-${id}`}
              hasInstructions={isString(this.props.instructions)}
              label={this.props.label}
            />
            <Styled.SecondaryInput
              as={MaskedInput}
              onChange={this.props.onChange}
              value={this.props.value}
              id={`${this.idPrefix}-${id}`}
              type="text"
              mask={mask}
              placeholder={this.props.placeholder}
              placeholderChar={this.placeholderChar}
              onClick={this.props.onClick}
              aria-describedby={`${this.idForInstructionsPrefix}-${id}`}
              autoComplete={this.props.autoComplete}
            />
            <Instructions
              instructions={this.props.instructions}
              id={`${this.idForInstructionsPrefix}-${id}`}
            />
          </FieldWrapper>
        )}
      </UIDConsumer>
    );
  }
}

export default setter(FormMaskedTextInput);
