import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import has from "lodash/has";
import classNames from "classnames";

export default class LabelSet extends PureComponent {
  static propTypes = {
    labels: PropTypes.array
  };

  get labels() {
    return this.props.labels;
  }

  labelClassNames(label) {
    const hasLevel = isPlainObject(label) && has(label, "level");
    const isNotice = hasLevel && label.level === "notice";
    const isWarning = hasLevel && label.level === "warning";
    const isError = hasLevel && label.level === "error";

    return classNames({
      "entity-row__label": true,
      "entity-row__label--notice": isNotice,
      "entity-row__label--warning": isWarning,
      "entity-row__label--error": isError
    });
  }

  labelText(label) {
    if (isString(label)) return label;
    if (has(label, "text")) return label.text;
    return label;
  }

  /* eslint-disable react/no-array-index-key */
  render() {
    return (
      <span className="entity-row__labels">
        {this.labels.map((label, index) => (
          <span key={index} className={this.labelClassNames(label)}>
            {this.labelText(label)}
          </span>
        ))}
      </span>
    );
  }
}
