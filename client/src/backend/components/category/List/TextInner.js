import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import Text from "global/components/text";
import Utility from "global/components/utility";
import { withTranslation } from "react-i18next";

class TextInner extends Component {
  static displayName = "Category.List.Texts.Text";

  static propTypes = {
    text: PropTypes.object.isRequired,
    dragHandleProps: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired,
    category: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      dragHandleFocused: false,
      keyboardButtonFocused: false
    };
  }

  get text() {
    return this.props.text;
  }

  get category() {
    return this.props.category;
  }

  get callbacks() {
    return this.props.callbacks;
  }

  get dragHandleProps() {
    return this.props.dragHandleProps;
  }

  get labels() {
    const labels = [];
    if (this.text.attributes.ignoreAccessRestrictions)
      labels.push("unrestricted");
    return labels;
  }

  onDelete = event => {
    event.preventDefault();
    this.callbacks.destroyText(this.text);
  };

  onTextKeyboardMove(direction) {
    this.props.onTextKeyboardMove({
      text: this.text,
      sourceId: this.category?.id || "uncategorized",
      direction
    });
  }

  render() {
    return (
      <>
        <Link
          to={lh.link("backendText", this.text.id)}
          className="texts-list__details"
        >
          <div className="texts-list__icon">
            <Text.Cover text={this.text} iconOnly={false} />
          </div>
          <div className="texts-list__title-wrapper">
            <h3 className="texts-list__title">
              <span
                dangerouslySetInnerHTML={{
                  __html: this.text.attributes.titleFormatted
                }}
              />
              <span className="texts-list__subtitle">
                {this.text.attributes.subtitle}
              </span>
              {this.labels.length > 0 && (
                <span className="texts-list__labels">
                  {this.labels.map(label => (
                    <span key={label} className="texts-list__label">
                      {label}
                    </span>
                  ))}
                </span>
              )}
            </h3>
            <span className="texts-list__date">
              <FormattedDate
                prefix={this.props.t("dates.added_title_case")}
                format="MMMM, yyyy"
                date={this.text.attributes.createdAt}
              />
            </span>
          </div>
        </Link>
        <div
          className={classNames({
            "texts-list__utility": true,
            "texts-list__utility--keyboard-buttons-visible":
              this.state.dragHandleFocused || this.state.keyboardButtonFocused
          })}
        >
          <button
            className="texts-list__button texts-list__button--notice"
            onClick={event => {
              this.onDelete(event);
            }}
          >
            <Utility.IconComposer icon="delete32" size={26} />
            <span className="screen-reader-text">
              {this.props.t("projects.category.delete_text")}
            </span>
          </button>
          <Link
            to={lh.link("backendText", this.text.id)}
            className="texts-list__button"
          >
            <Utility.IconComposer icon="annotate32" size={26} />
            <span className="screen-reader-text">
              {this.props.t("projects.category.edit_text")}
            </span>
          </Link>

          <div
            className="texts-list__button texts-list__drag-handle"
            onFocus={() => this.setState({ dragHandleFocused: true })}
            onBlur={() => this.setState({ dragHandleFocused: false })}
            {...this.dragHandleProps}
          >
            <Utility.IconComposer icon="grabber32" size={26} />
            <span className="screen-reader-text">
              {this.props.t("projects.category.drag")}
            </span>
          </div>
          <div className="texts-list__keyboard-buttons">
            <button
              onClick={() => this.onTextKeyboardMove("up")}
              onFocus={() => this.setState({ keyboardButtonFocused: true })}
              onBlur={() => this.setState({ keyboardButtonFocused: false })}
              className="texts-list__button"
            >
              <Utility.IconComposer icon="arrowUp32" size={26} />
              <span className="screen-reader-text">
                {this.props.t("projects.category.move_up")}
              </span>
            </button>
            <button
              onClick={() => this.onTextKeyboardMove("down")}
              onFocus={() => this.setState({ keyboardButtonFocused: true })}
              onBlur={() => this.setState({ keyboardButtonFocused: false })}
              className="texts-list__button"
            >
              <Utility.IconComposer icon="arrowDown32" size={26} />
              <span className="screen-reader-text">
                {this.props.t("projects.category.move_down")}
              </span>
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(TextInner);
