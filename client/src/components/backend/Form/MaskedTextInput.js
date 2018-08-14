import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
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
    id: PropTypes.string,
    wide: PropTypes.bool
  };

  static defaultProps = {
    id: uniqueId("masked-text-")
  };

  constructor() {
    super();
    this.placeholderChar = "\u005F"; // react-text-mask default "_"
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
      const wordChar = /^[A-Za-z0-9_.;()/]$/;
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
      <div className={inputClasses}>
        <label htmlFor={this.props.id} className={labelClass}>
          {this.props.label}
        </label>
        <Instructions instructions={this.props.instructions} />
        <MaskedInput
          onChange={this.props.onChange}
          value={this.props.value}
          id={this.props.id}
          type="text"
          mask={mask}
          placeholder={this.props.placeholder}
          placeholderChar={this.placeholderChar}
        />
      </div>
    );
  }
}

export default setter(FormMaskedTextInput);
