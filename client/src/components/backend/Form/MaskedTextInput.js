import React, { Component } from "react";
import PropTypes from "prop-types";
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
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

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

  mask() {
    if (this.props.mask === "currency") {
      return this.currencyMask();
    }
    if (this.props.mask === "hashtag") {
      return this.hashTagMask();
    }
    return this.props.mask;
  }

  render() {
    const mask = this.mask();
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });

    return (
      <div className="form-input">
        <label className={labelClass}>
          {this.props.label}
        </label>
        <Instructions instructions={this.props.instructions} />
        <MaskedInput
          onChange={this.props.onChange}
          value={this.props.value}
          type="text"
          mask={mask}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export default setter(FormMaskedTextInput);
