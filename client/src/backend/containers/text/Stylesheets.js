import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { stylesheetsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import IconComposer from "global/components/utility/IconComposer";

import Stylesheet from "backend/components/stylesheet";
import withConfirmation from "hoc/withConfirmation";

const { request } = entityStoreActions;

export class TextStylesContainer extends PureComponent {
  static displayName = "Text.Styles";

  static propTypes = {
    text: PropTypes.object,
    dispatch: PropTypes.func,
    refresh: PropTypes.func,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
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

  componentDidMount() {
    this.props.refresh();
  }

  confirmDestroy = stylesheet => {
    const t = this.props.t;
    const heading = t("modals.delete_text");
    const message = t("modals.delete_text_body");
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
    const t = this.props.t;
    return (
      <div>
        <section className="text-category-list-secondary">
          <div className="instructional-copy">
            <p>{t("texts.stylesheets.instructions")}</p>
          </div>

          <div
            className="entity-list__button-set-flex full-width"
            style={{ marginBlockEnd: "16px" }}
          >
            <Link
              className="entity-list__button button-lozenge-secondary"
              to={lh.link("BackendTextStylesheetNew", this.text.id)}
            >
              <IconComposer
                icon="circlePlus32"
                size={18}
                className={classNames(
                  "button-icon-secondary__icon",
                  "button-icon-secondary__icon--large"
                )}
              />
              <span>{t("texts.stylesheets.add_button_label")}</span>
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

export default withTranslation()(withConfirmation(TextStylesContainer));
