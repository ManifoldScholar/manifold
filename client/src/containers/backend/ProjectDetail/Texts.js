import React, { PureComponent, PropTypes } from 'react';
import { Form, Dialog } from 'components/backend';
import { Text } from 'components/global';
import { Text as globalText } from 'components/global';
import { Link } from 'react-router';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, textsAPI, textCategoriesAPI } from 'api';
import FormattedDate from 'components/global/FormattedDate';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectDetailTexts extends PureComponent {

  static displayName = "ProjectDetail.Texts";
  static activeNavItem = "texts";

  static mapStateToProps(state, ownProps) {
    return {
      moveTextResponse: get(state.entityStore.responses, requests.beTextUpdate),
      moveCategoryResponse: get(state.entityStore.responses, requests.beTextCategoryUpdate)
    };
  }

  static propTypes = {
    project: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  publishedTexts() {
    const published = this.props.project.relationships.publishedText;
    if (published) return [published];
    return [];
  }

  categoryTexts(category) {
    return this.texts().filter((text) => {
      return text.relationships.category === category
        && text.id !== this.publishedTextId(this.props);
    });
  }

  uncategorizedTexts() {
    return this.texts().filter((text) => {
      return !text.relationships.category && text.id !== this.publishedTextId(this.props);
    });
  }

  publishedTextId(props) {
    return get(props, 'project.relationships.publishedText.id');
  }

  isUncategorizedText(text) {
    return text.relationships.category === null;
  }

  isPublishedText(text) {
    return this.publishedTextId(this.props) === text.id;
  }

  updateTextCategoryAndPosition(text, category, newPos) {
    let catPayload;
    if (category) {
      catPayload = { id: category.id, type: "categories" };
    } else {
      catPayload = null;
    }
    const changes = {
      relationships: { category: { data: catPayload } },
      attributes: { position: newPos }
    };
    const call = textsAPI.update(text.id, changes);
    const categoryRequest = request(call, requests.beTextUpdate);
    this.props.dispatch(categoryRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  updateCategoryPosition(category, newPos) {
    const changes = {
      attributes: { position: newPos }
    };
    const call = textCategoriesAPI.update(category.id, changes);
    const categoryRequest = request(call, requests.beTextCategoryUpdate);
    this.props.dispatch(categoryRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  destroyCategory(category) {
    const call = textCategoriesAPI.destroy(category.id);
    const categoryRequest = request(call, requests.beTextCategoryDestroy);
    this.props.dispatch(categoryRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  destroyText(text) {
    const call = textsAPI.destroy(text.id);
    const textRequest = request(call, requests.beTextDestroy);
    this.props.dispatch(textRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  handleTextPublish(text) {
    const changes = {
      relationships: { publishedText: { data: { id: text.id, type: "texts" } } },
    };
    const call = projectsAPI.update(this.props.project.id, changes);
    const projectRequest = request(call, requests.beProjectUpdate);
    this.props.dispatch(projectRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  handleTextUnpublish(text) {
    const changes = {
      relationships: { publishedText: { data: null } },
    };
    const call = projectsAPI.update(this.props.project.id, changes);
    const projectRequest = request(call, requests.beProjectUpdate);
    this.props.dispatch(projectRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  positionInCategory(text) {
    if (this.isPublishedText(text)) return 1;
    if (text.relationships.category) {
      const index = this.categoryTexts(text.relationships.category).findIndex((compare) => {
        return compare.id === text.id;
      });
      return index + 1;
    }
    const index = this.uncategorizedTexts().findIndex((compare) => {
      return compare.id === text.id;
    });
    return index + 1;
  }

  categories() {
    return this.props.project.relationships.textCategories;
  }

  texts() {
    return this.props.project.relationships.texts;
  }

  canShowTextUp(text) {
    if (this.isPublishedText(text)) return false;
    return true;
  }

  canShowTextDown(text) {
    if (this.isPublishedText(text)) return true;
    if (!this.isUncategorizedText(text)) return true;
    return !this.isLastInCategory(text);
  }

  canShowCategoryUp(category) {
    const index = this.categoryIndex(category, this.categories());
    if (index === 0) return false;
    return true;
  }

  canShowCategoryDown(category) {
    const index = this.categoryIndex(category, this.categories());
    if (index + 1 === this.categories().length) return false;
    return true;
  }

  categoryIndex(category, categories) {
    return categories.findIndex((compare) => compare.id === category.id);
  }

  isLastInCategory(text) {
    if (this.isPublishedText(text)) return true;
    let length;
    if (this.isUncategorizedText(text)) {
      length = this.uncategorizedTexts().length;
    } else {
      length = this.categoryTexts(text.relationships.category).length;
    }
    if (this.positionInCategory(text) === length) return true;
    return false;
  }

  previousCategory(text) {
    const category = text.relationships.category;
    if (this.isUncategorizedText(text)) {
      return this.categories()[this.categories().length - 1];
    }
    if (this.isPublishedText(text)) return null;
    if (this.categoryIndex(category, this.categories()) === 0) return "published";
    return this.categories()[this.categoryIndex(category, this.categories()) - 1];
  }

  nextCategory(text) {
    const category = text.relationships.category;
    if (this.isUncategorizedText(text)) return null;
    if (this.isPublishedText(text)) return this.categories()[0];
    return this.categories()[this.categoryIndex(category, this.categories()) + 1];
  }

  handleTextUp(event, text) {
    const position = this.positionInCategory(text);
    let targetCategory = text.relationships.category;
    let move = "up";
    if (position === 1) {
      targetCategory = this.previousCategory(text);
      if (targetCategory === "published") return this.handleTextPublish(text);
      move = "bottom";
    }
    this.updateTextCategoryAndPosition(text, targetCategory, move);
  }

  handleTextDown(event, text) {
    const position = this.positionInCategory(text);
    let targetCategory = text.relationships.category;
    let move = "down";
    if (this.isPublishedText(text)) return this.handleTextUnpublish(text);
    if (this.isUncategorizedText(text)) targetCategory = null;
    if (this.isLastInCategory(text)) {
      targetCategory = this.nextCategory(text);
      move = "top";
    }
    this.updateTextCategoryAndPosition(text, targetCategory, move);
  }

  handleCategoryUp(event, category) {
    const categoryIndex = this.categoryIndex(category, this.categories());
    if (categoryIndex === 0) return;
    this.updateCategoryPosition(category, "up");
  }

  handleCategoryDown(event, category) {
    const categoryIndex = this.categoryIndex(category, this.categories());
    if (categoryIndex + 1 === this.categories().length) return;
    this.updateCategoryPosition(category, "down");
  }

  handleCategoryDestroy(event, category) {
    const heading = "Are you sure you want to delete this category?";
    const message = "Any texts belonging to this category will become uncategorized.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(() => {
      this.destroyCategory(category);
      this.closeDialog();
    }, () => { this.closeDialog(); });
  }

  handleTextDestroy(event, text) {
    const heading = "Are you sure you want to delete this text?";
    const message = "All annotations and highlights of this text will also be deleted. " +
      "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(() => {
      this.destroyText(text);
      this.closeDialog();
    }, () => { this.closeDialog(); });
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  renderTexts(texts) {
    let renderedTexts;
    if (texts.length === 0) {
      renderedTexts = (<li key="0">
        <p className="group-empty">
          {'No texts have been added to this category'}
        </p>
      </li>);
    } else {
      renderedTexts = texts.map((text) => {
        return (
          <li key={text.id}>
            <div>
              <Link to={`/backend/text/${text.id}`} className="asset-thumb">
                <figure className="asset-image">
                  <Text.Placeholder/>
                </figure>

                <div className="asset-description">
                  <h3 className="asset-title">
                    {text.attributes.title}
                    <span className="subtitle">
                      {text.attributes.subtitle}
                    </span>
                  </h3>
                  <datetime className="asset-date">
                    <FormattedDate
                      prefix="Added"
                      format="MMMM, YYYY"
                      date={text.attributes.createdAt}
                    />
                  </datetime>
                  <span className="asset-state">Hidden</span>
                </div>
              </Link>

              <div className="text-category-list-utility">
                <Link
                  className="button"
                  to={`/backend/text/${text.id}`}
                >
                  {'Edit'}
                </Link>
                {
                 this.canShowTextUp(text) ?
                   <button onClick={(event) => { this.handleTextUp(event, text); }}>
                     <i className="manicon manicon-arrow-up"></i>
                   </button>
                   :
                   <button style={{ visibility: "hidden" }} >
                     <i className="manicon manicon-arrow-up"></i>
                   </button>
                }
                {
                  this.canShowTextDown(text) ?
                    <button onClick={(event) => { this.handleTextDown(event, text); }}>
                      <i className="manicon manicon-arrow-down"></i>
                    </button>
                  :
                    <button style={{ visibility: "hidden" }} >
                      <i className="manicon manicon-arrow-down"></i>
                    </button>
                }
                <button onClick={(event) => { this.handleTextDestroy(event, text); }}>
                  <i className="manicon manicon-x"></i>
                </button>
              </div>
            </div>
          </li>
        );
      });
    }
    return (
      <ul className="texts-group">
        {renderedTexts}
      </ul>
    );
  }

  render() {
    const categories = this.categories();
    const project = this.props.project;
    const refresh = this.props.refresh;
    if (!project) return null;

    return (
      <section>

        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
          : null
        }

        {
          this.props.children ?
          React.cloneElement(this.props.children, { project, refresh })
          : null
        }

        <div className="buttons-icon-horizontal">
          {/*
           <button className="button-icon-secondary">
           <i className="manicon manicon-plus"></i>Add a new text
           </button>
          */}
          <Link
            to={`/backend/project/${project.id}/texts/category/new`}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-plus"></i>Create a new category
          </Link>
        </div>

        <section className="text-category-list-secondary">
          <div className="text-category">
            <header>
              <h4 className="category-title highlight">Published</h4>
            </header>
            {this.renderTexts(this.publishedTexts())}
          </div>
          {categories.map((category) => {
            return (
              <div key={category.id} className="text-category">
                <header>
                  <h4 className="category-title">
                    <span>Category:</span>
                    {category.attributes.title}
                  </h4>
                  <div className="text-category-list-utility">
                    <Link
                      className="button"
                      to={`/backend/project/${project.id}/texts/category/${category.id}/edit`}
                    >{'edit'}</Link>
                    {
                      this.canShowCategoryUp(category) ?
                        <button onClick={(event) => { this.handleCategoryUp(event, category); }}>
                          <i className="manicon manicon-arrow-up"></i>
                        </button>
                      :
                        <button style={{ visibility: "hidden" }} >
                          <i className="manicon manicon-arrow-up"></i>
                        </button>
                    }
                    {
                      this.canShowCategoryDown(category) ?
                        <button onClick={(event) => { this.handleCategoryDown(event, category); }}>
                          <i className="manicon manicon-arrow-down"></i>
                        </button>
                      :
                        <button style={{ visibility: "hidden" }} >
                          <i className="manicon manicon-arrow-down"></i>
                        </button>
                    }
                    <button onClick={(event) => { this.handleCategoryDestroy(event, category); }}>
                      <i className="manicon manicon-x"></i>
                    </button>
                  </div>
                </header>
                {this.renderTexts(this.categoryTexts(category))}
              </div>
            );
          })}
          <div className="text-category">
            <header>
              <h4 className="category-title notice">Uncategorized</h4>
            </header>
            {this.renderTexts(this.uncategorizedTexts())}
          </div>
        </section>
      </section>
    );
  }
}

export default connect(
  ProjectDetailTexts.mapStateToProps
)(ProjectDetailTexts);

