import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { stylesheetsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import IconComposer from "global/components/utility/IconComposer";

import Stylesheet from "backend/components/stylesheet";
import withConfirmation from "hoc/with-confirmation";

const { request } = entityStoreActions;

export class TextStylesContainer extends PureComponent {
  static displayName = "Text.Styles";

  static propTypes = {
    text: PropTypes.object,
    dispatch: PropTypes.func,
    refresh: PropTypes.func,
    confirm: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  get text() {
    return this.props.text;
  }

  get stylesheets() {
    return this.text.relationships.stylesheets;
  }

  get callbacks() {
    return {
      updatePosition: this.updatePosition,
      confirmDestroy: this.confirmDestroy
    };
  }

  get buttonClasses() {
    return classNames(
      "buttons-icon-horizontal__button",
      "button-icon-secondary"
    );
  }

  confirmDestroy = stylesheet => {
    const heading = "Are you sure you want to delete this stylesheet?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, () => this.destroy(stylesheet));
  };

  destroy = stylesheet => {
    const call = stylesheetsAPI.destroy(stylesheet.id);
    const options = { removes: stylesheet };
    const stylesheetRequest = request(
      call,
      requests.beStylesheetDestroy,
      options
    );
    this.props.dispatch(stylesheetRequest).promise.then(() => {
      this.props.refresh();
    });
  };

  updatePosition = (stylesheet, newPos) => {
    const changes = {
      attributes: { position: newPos }
    };
    const call = stylesheetsAPI.update(stylesheet.id, changes);
    const options = { notificationScope: "none" };
    const stylesheetRequest = request(
      call,
      requests.beStylesheetUpdate,
      options
    );
    this.props.dispatch(stylesheetRequest).promise.then(() => {
      this.props.refresh();
    });
  };

  render() {
    return (
      <div>
        <section className="text-category-list-secondary">
          <div className="instructional-copy">
            <p>
              {`Stylesheets are applied to texts in the order listed below.
              "Ingested" stylesheets are part of the source document and are
              copied into Manifold (with some modification) during text
              ingestion. "User" stylesheets are those that have been created
              after the initial ingestion. To override styles in the source
              document, create a new stylesheet and move it to the bottom of the
              list.`}
            </p>
          </div>

          <div className="buttons-icon-horizontal maintain">
            <Link
              className={this.buttonClasses}
              to={lh.link("BackendTextStylesheetNew", this.text.id)}
            >
              <IconComposer
                icon="plus16"
                size={18}
                iconClass={classNames(
                  "button-icon-secondary__icon",
                  "button-icon-secondary__icon--large"
                )}
              />
              <span>Add a New Stylesheet</span>
            </Link>
          </div>

          <Stylesheet.List
            stylesheets={this.stylesheets}
            text={this.text}
            callbacks={this.callbacks}
          />
        </section>
      </div>
    );
  }
}

export default withConfirmation(TextStylesContainer);
