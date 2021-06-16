import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextList from "frontend/components/content-block/Block/types/Texts";
import pick from "lodash/pick";

export default class ProjectContentBlockTextsBlock extends PureComponent {
  static displayName = "Project.Content.Block.Texts";

  static propTypes = {
    block: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  static get title() {
    return "Texts";
  }

  static get icon() {
    return "textsStacked64";
  }

  get texts() {
    return this.props.project.relationships.texts;
  }

  get includedCategories() {
    return this.props.block.relationships.includedCategories;
  }

  get projectCategories() {
    return this.props.project.relationships.textCategories;
  }

  get categories() {
    if (this.includedCategories.length > 0) return this.includedCategories;
    return this.projectCategories;
  }

  get uncategorizedTexts() {
    return this.filteredOrderedTexts(
      text => !text.relationships || !text.relationships.category
    );
  }

  filteredOrderedTexts(filter) {
    const texts = this.texts.filter(filter).sort((textA, textB) => {
      return textB.attributes.position > textA.attributes.position ? -1 : 1;
    });
    return texts;
  }

  get visibility() {
    return pick(this.props.block.attributes, [
      "showAuthors",
      "showCategoryLabels",
      "showCovers",
      "showDates",
      "showDescriptions",
      "showSubtitles",
      "showUncategorized"
    ]);
  }

  textsForCategory(category) {
    return this.filteredOrderedTexts(text => {
      if (!text.relationships || !text.relationships.category) return false;
      return text.relationships.category.id === category.id;
    });
  }

  render() {
    return (
      <div className="entity-section-wrapper__body">
        <div className="text-list">
          {this.categories.map(category => (
            <TextList
              label={
                this.visibility.showCategoryLabels
                  ? category.attributes.title
                  : null
              }
              texts={this.textsForCategory(category)}
              key={category.id}
              {...this.visibility}
            />
          ))}
          {this.visibility.showUncategorized && (
            <TextList
              label="Uncategorized"
              texts={this.uncategorizedTexts}
              {...this.visibility}
            />
          )}
        </div>
      </div>
    );
  }
}
