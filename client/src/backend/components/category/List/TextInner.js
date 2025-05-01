import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import Text from "global/components/text";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
import { withTranslation } from "react-i18next";

class TextInner extends Component {
  static displayName = "Category.List.Texts.Text";

  static propTypes = {
    text: PropTypes.object.isRequired,
    dragHandleProps: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired,
    category: PropTypes.object,
    index: PropTypes.number.isRequired,
    itemCount: PropTypes.number.isRequired,
    categoryIndex: PropTypes.number.isRequired,
    categoryCount: PropTypes.number.isRequired,
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.popoverDisclosureRef = React.createRef();
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

  onDelete = (event) => {
    event.preventDefault();
    this.callbacks.destroyText(this.text);
  };

  onTextKeyboardMove(action) {
    const { index, categoryIndex } = this.props;

    let destinationIndex;
    let position;

    switch (action) {
      case "up_position":
        destinationIndex = categoryIndex;
        position = index + 1 - 1; // index starts with 0, positions start with 1
        break;
      case "down_position":
        destinationIndex = categoryIndex;
        position = index + 1 + 1; // index starts with 0, positions start with 1
        break;
      case "up_category":
        destinationIndex = categoryIndex - 1;
        position = 1;
        break;
      case "down_category":
        destinationIndex = categoryIndex + 1;
        position = 1;
        break;
      default:
        break;
    }

    this.props.onTextKeyboardMove(
      {
        text: this.text,
        destinationIndex,
        position,
      },
      () => {
        setTimeout(() => {
          // refs are unreliably here due to rerendering caused by ancestor components
          const disclosureToggleEl = document.querySelector(
            `[data-disclosure-toggle-for="${this.text.id}"]`,
          );
          if (disclosureToggleEl) {
            disclosureToggleEl.focus();
          }
        }, 300);
      },
    );
  }

  render() {
    const { index, itemCount, categoryIndex, categoryCount } = this.props;

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
                  __html: this.text.attributes.titleFormatted,
                }}
              />
              <span className="texts-list__subtitle">
                {this.text.attributes.subtitle}
              </span>
              {this.labels.length > 0 && (
                <span className="texts-list__labels">
                  {this.labels.map((label) => (
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
        <div className="texts-list__utility texts-list__utility--draggable">
          <button
            className="texts-list__button texts-list__button--notice"
            onClick={(event) => {
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
            {...this.dragHandleProps}
            tabIndex={-1}
          >
            <Utility.IconComposer icon="grabber32" size={26} />
            <span className="screen-reader-text">
              {this.props.t("projects.category.drag")}
            </span>
          </div>
          <div className="texts-list__keyboard-buttons">
            <PopoverMenu
              disclosure={
                <button
                  ref={this.popoverDisclosureRef}
                  data-disclosure-toggle-for={this.text.id}
                  className="texts-list__button"
                >
                  <Utility.IconComposer icon="arrowUpDown32" size={26} />
                  <span className="screen-reader-text">
                    {this.props.t("actions.dnd.reorder")}
                  </span>
                </button>
              }
              actions={[
                {
                  id: "up",
                  label: this.props.t("actions.dnd.move_up_position"),
                  onClick: () => this.onTextKeyboardMove("up_position"),
                  disabled: index === 0,
                },
                {
                  id: "down",
                  label: this.props.t("actions.dnd.move_down_position"),
                  onClick: () => this.onTextKeyboardMove("down_position"),
                  disabled: index === itemCount - 1,
                },
                {
                  id: "up_category",
                  label: this.props.t("actions.dnd.move_up_category"),
                  onClick: () => this.onTextKeyboardMove("up_category"),
                  disabled: categoryIndex === 0,
                },
                {
                  id: "down_category",
                  label: this.props.t("actions.dnd.move_down_category"),
                  onClick: () => this.onTextKeyboardMove("down_category"),
                  disabled: categoryIndex === categoryCount - 1,
                },
              ]}
            />
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(TextInner);
