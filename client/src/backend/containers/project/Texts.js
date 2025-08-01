import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import withConfirmation from "hoc/withConfirmation";
import { entityStoreActions, notificationActions } from "actions";
import { textsAPI, textCategoriesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import Authorize from "hoc/Authorize";
import Category from "backend/components/category";
import { Link } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";

const { request } = entityStoreActions;

export class ProjectTextsContainer extends Component {
  static displayName = "Project.Texts";

  static propTypes = {
    project: PropTypes.object,
    projectResponse: PropTypes.object,
    dispatch: PropTypes.func,
    refresh: PropTypes.func,
    confirm: PropTypes.func.isRequired,
    route: PropTypes.object,
    match: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  static getDerivedStateFromProps(props, state = {}) {
    if (
      props.projectResponse === state.response &&
      props.project.relationships.textCategories.length ===
        state.categories.length
    )
      return null;
    return {
      categories: props.project.relationships.textCategories.slice(0),
      texts: props.project.relationships.texts.slice(0),
      response: props.projectResponse
    };
  }

  constructor(props) {
    super(props);
    this.state = this.constructor.getDerivedStateFromProps(props, {
      categories: []
    });
  }

  get project() {
    return this.props.project;
  }

  get callbacks() {
    return {
      destroyCategory: this.handleCategoryDestroy,
      destroyText: this.handleTextDestroy,
      updateCategoryPosition: this.updateCategoryPosition,
      updateTextCategoryAndPosition: this.updateTextCategoryAndPosition
    };
  }

  get buttonClasses() {
    return classNames("entity-list__button", "button-lozenge-secondary");
  }

  handleCategoryDestroy = category => {
    const t = this.props.t;
    const heading = t("modals.delete_category");
    const message = t("modals.delete_category_body");
    this.props.confirm(heading, message, () => this.destroyCategory(category));
  };

  handleTextDestroy = text => {
    const t = this.props.t;
    const heading = t("modals.delete_text");
    const message = t("modals.delete_text_body");
    this.props.confirm(heading, message, () => this.destroyText(text));
  };

  updateCategoryPositionInternal(category, position) {
    const categories = this.state.categories.filter(c => c.id !== category.id);
    categories.splice(position - 1, 0, category);
    this.setState({ categories });
  }

  updateCategoryPosition = (category, position, callback, announce) => {
    this.updateCategoryPositionInternal(category, position);
    const changes = {
      attributes: { position }
    };
    const call = textCategoriesAPI.update(category.id, changes);
    const options = { noTouch: true, notificationScope: "none" };
    const categoryRequest = request(
      call,
      requests.beTextCategoryUpdate,
      options
    );
    this.props.dispatch(categoryRequest).promise.then(() => {
      this.props.refresh();

      if (announce) {
        const announcement = this.props.t("actions.dnd.moved_to_position", {
          title: category.attributes.title,
          position
        });
        this.props.setScreenReaderStatus(announcement);
      }

      if (callback && typeof callback === "function") {
        callback();
      }
    });
  };

  updateTextCategoryAndPosition = (
    text,
    category,
    position,
    callback,
    announce
  ) => {
    let catPayload;
    if (category) {
      catPayload = { id: category.id, type: "categories" };
    } else {
      catPayload = null;
    }
    const changes = {
      relationships: { category: { data: catPayload } },
      attributes: { position }
    };
    this.updateTextCategoryAndPositionInternal(text, category, changes);

    const call = textsAPI.update(text.id, changes);
    const options = { noTouch: true };
    const categoryRequest = request(call, requests.beTextUpdate, options);

    this.props.dispatch(categoryRequest).promise.then(() => {
      this.props.refresh();

      if (announce) {
        const announcement = this.props.t("actions.dnd.moved_to_category", {
          title: text.attributes.title,
          category: `${category?.attributes.title || "Uncategorized"}`,
          position
        });
        this.props.setScreenReaderStatus(announcement);
      }

      if (callback && typeof callback === "function") {
        callback();
      }
    });
  };

  updateTextCategoryAndPositionInternal(text, category, changes) {
    const texts = this.state.texts.filter(t => t.id !== text.id);
    const clone = cloneDeep(this.state.texts.find(t => t.id === text.id));
    clone.attributes = Object.assign(clone.attributes, changes.attributes);
    clone.relationships.category = changes.relationships.category.data;
    texts.splice(clone.attributes.position - 1, 0, clone);
    this.setState({ texts });
  }

  destroyCategory = category => {
    const call = textCategoriesAPI.destroy(category.id);
    const categoryRequest = request(call, requests.beTextCategoryDestroy);
    this.props.dispatch(categoryRequest).promise.then(() => {
      this.props.refresh();
    });
  };

  notifyDestroy(text) {
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `TEXT_DESTROYED_${text.id}`,
      heading: t("notifications.text_delete"),
      body: t("notifications.text_delete_body", {
        title: text.attributes.titlePlaintext
      }),
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  destroyText(text) {
    const call = textsAPI.destroy(text.id);
    const options = { removes: text };
    const textRequest = request(call, requests.beTextDestroy, options);
    this.props.dispatch(textRequest).promise.then(() => {
      this.props.refresh();
      this.notifyDestroy(text);
    });
  }

  childRoutes() {
    const { refresh } = this.props;
    const closeUrl = lh.link("backendProjectTexts", this.project.id);

    const { routes, ...route } = this.props.route;
    const drawerRoutes = { ...route, routes: routes.filter(r => !r.ingest) };
    const ingestRoute = { ...route, routes: [routes.find(r => r.ingest)] };

    return (
      <>
        {childRoutes(ingestRoute, {
          drawer: true,
          drawerProps: {
            lockScroll: "always",
            wide: true,
            lockScrollClickCloses: false,
            closeUrl,
            context: "ingestion"
          },
          childProps: { refresh, project: this.project }
        })}
        {childRoutes(drawerRoutes, {
          drawer: true,
          drawerProps: {
            lockScroll: "always",
            wide: true,
            lockScrollClickCloses: false,
            closeUrl
          },
          childProps: { refresh, project: this.project }
        })}
      </>
    );
  }

  render() {
    if (!this.project) return null;
    const t = this.props.t;

    return (
      <Authorize
        entity={this.project}
        ability="manageTexts"
        failureNotification
        failureRedirect={lh.link("backendProject", this.project.id)}
      >
        <>
          {this.childRoutes()}

          <div className="entity-list__button-set-flex">
            <Link
              to={lh.link("backendProjectTextsIngestionsNew", this.project.id)}
              className={this.buttonClasses}
            >
              <span className="screen-reader-text">
                {t("texts.add_text_label")}
              </span>
              <IconComposer
                icon="export24"
                size={16}
                className={classNames(
                  "button-icon-secondary__icon",
                  "button-icon-secondary__icon--large"
                )}
              />
              <span className="full" aria-hidden="true">
                {t("texts.ingest_button_label")}
              </span>
            </Link>
            <Link
              to={lh.link("backendProjectTextsCreate", this.project.id)}
              className={this.buttonClasses}
            >
              <span className="screen-reader-text">
                {t("texts.create_button_label")}
              </span>
              <IconComposer
                icon="copy24"
                size={16}
                className={classNames(
                  "button-icon-secondary__icon",
                  "button-icon-secondary__icon--large"
                )}
              />
              <span className="full" aria-hidden="true">
                {t("texts.create_button_label")}
              </span>
            </Link>
            <Link
              to={lh.link("backendProjectCategoriesNew", this.project.id)}
              className={this.buttonClasses}
            >
              <span className="screen-reader-text">
                {t("texts.create_category_button_label")}
              </span>
              <IconComposer
                icon="circlePlus32"
                size={18}
                className={classNames(
                  "button-icon-secondary__icon",
                  "button-icon-secondary__icon--large"
                )}
              />
              <span className="full" aria-hidden="true">
                {t("texts.create_category_button_label")}
              </span>
            </Link>
          </div>

          <Category.List
            categories={this.state.categories}
            texts={this.state.texts}
            project={this.project}
            callbacks={this.callbacks}
            setScreenReaderStatus={this.props.setScreenReaderStatus}
          />
          {this.props.renderLiveRegion("alert")}
        </>
      </Authorize>
    );
  }
}

export default withTranslation()(
  withScreenReaderStatus(
    withConfirmation(connectAndFetch(ProjectTextsContainer)),
    false
  )
);
