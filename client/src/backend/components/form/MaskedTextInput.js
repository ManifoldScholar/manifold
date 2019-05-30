import React, { Component } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import fill from "lodash/fill";
import setter from "./setter";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "./Instructions";

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
    wide: PropTypes.bool
  };

  constructor() {
    super();
    this.placeholderChar = "\u005F"; // react-text-mask default "_"
  }

  get idPrefix() {
    return "masked-text";
  }

  currencyMask() {
    return createNumberMask({
      prefix: "$",
      allowDecimal: true
    });
  }

  hashTagMask() {
    return raw => {
      const wordChar = /^[A-Za-z0-9-]$/;
      const notWordChar = /[^A-Za-z0-9-]/g;
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
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputClasses = classnames({
      "form-input": true,
      wide: this.props.wide
    });

    return (
      <UID name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <div className={inputClasses}>
            <label htmlFor={id} className={labelClass}>
              {this.props.label}
            </label>
            <MaskedInput
              onChange={this.props.onChange}
              value={this.props.value}
              id={id}
              type="text"
              mask={mask}
              placeholder={this.props.placeholder}
              placeholderChar={this.placeholderChar}
              onClick={this.props.onClick}
            />
            <Instructions instructions={this.props.instructions} />
          </div>
        )}
      </UID>
    );
  }
}

export default setter(FormMaskedTextInput);
