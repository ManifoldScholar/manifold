import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import withConfirmation from "hoc/with-confirmation";
import { entityStoreActions } from "actions";
import { textsAPI, textCategoriesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import Authorize from "hoc/authorize";
import Category from "backend/components/category";
import { Link } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";

const { request } = entityStoreActions;

export class ProjectTextsContainer extends Component {
  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  static displayName = "Project.Texts";

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

  static propTypes = {
    project: PropTypes.object,
    projectResponse: PropTypes.object,
    dispatch: PropTypes.func,
    refresh: PropTypes.func,
    confirm: PropTypes.func.isRequired,
    route: PropTypes.object,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.constructor.getDerivedStateFromProps(props, {
      categories: []
    });
  }

  get callbacks() {
    return {
      destroyCategory: this.handleCategoryDestroy,
      destroyText: this.handleTextDestroy,
      updateCategoryPosition: this.updateCategoryPosition,
      updateTextCategoryAndPosition: this.updateTextCategoryAndPosition
    };
  }

  get project() {
    return this.props.project;
  }

  handleCategoryDestroy = category => {
    const heading = "Are you sure you want to delete this category?";
    const message =
      "Any texts belonging to this category will become uncategorized.";
    this.props.confirm(heading, message, () => this.destroyCategory(category));
  };

  handleTextDestroy = text => {
    const heading = "Are you sure you want to delete this text?";
    const message =
      "All annotations and highlights of this text will also be deleted. " +
      "This action cannot be undone.";
    this.props.confirm(heading, message, () => this.destroyText(text));
  };

  updateCategoryPosition = (category, position) => {
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
    });
  };

  destroyCategory = category => {
    const call = textCategoriesAPI.destroy(category.id);
    const categoryRequest = request(call, requests.beTextCategoryDestroy);
    this.props.dispatch(categoryRequest).promise.then(() => {
      this.props.refresh();
    });
  };

  updateTextCategoryAndPosition = (text, category, position) => {
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
    });
  };

  updateCategoryPositionInternal(category, position) {
    const categories = this.state.categories.filter(c => c.id !== category.id);
    categories.splice(position - 1, 0, category);
    this.setState({ categories });
  }

  destroyText(text) {
    const call = textsAPI.destroy(text.id);
    const textRequest = request(call, requests.beTextDestroy);
    this.props.dispatch(textRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  childRoutes() {
    const { refresh } = this.props;
    const closeUrl = lh.link("backendProjectTexts", this.project.id);

    return childRoutes(this.props.route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        lockScrollClickCloses: false,
        closeUrl
      },
      childProps: { refresh, project: this.project }
    });
  }

  updateTextCategoryAndPositionInternal(text, category, changes) {
    const texts = this.state.texts.filter(t => t.id !== text.id);
    const clone = cloneDeep(this.state.texts.find(t => t.id === text.id));
    clone.attributes = Object.assign(clone.attributes, changes.attributes);
    clone.relationships.category = changes.relationships.category.data;
    texts.splice(clone.attributes.position - 1, 0, clone);
    this.setState({ texts });
  }

  render() {
    if (!this.project) return null;
    return (
      <Authorize
        entity={this.project}
        ability="manageTexts"
        failureNotification
        failureRedirect={lh.link("backendProject", this.project.id)}
      >
        <React.Fragment>
          {this.childRoutes()}

          <div className="buttons-icon-horizontal maintain">
            <Link
              to={lh.link("backendProjectTextsIngestionsNew", this.project.id)}
              className="button-icon-secondary"
            >
              <span className="screen-reader-text">Add a new text</span>
              <i className="manicon manicon-plus" aria-hidden="true" />
              <span className="full" aria-hidden="true">
                Add a new text
              </span>
              <span className="abbreviated" aria-hidden="true">
                Text
              </span>
            </Link>

            <Link
              to={lh.link("backendProjectCategoriesNew", this.project.id)}
              className="button-icon-secondary"
            >
              <span className="screen-reader-text">Add a new category</span>
              <i className="manicon manicon-plus" aria-hidden="true" />
              <span className="full" aria-hidden="true">
                Create a new category
              </span>
              <span className="abbreviated" aria-hidden="true">
                Category
              </span>
            </Link>
          </div>

          <Category.List
            categories={this.state.categories}
            texts={this.state.texts}
            project={this.project}
            callbacks={this.callbacks}
          />
        </React.Fragment>
      </Authorize>
    );
  }
}

export default withConfirmation(connectAndFetch(ProjectTextsContainer));
