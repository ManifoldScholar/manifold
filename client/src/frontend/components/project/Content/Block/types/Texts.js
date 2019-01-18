import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import pick from "lodash/pick";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";
import TextList from "frontend/components/text-list";

export default class ProjectContentBlockTextsBlock extends PureComponent {
  static displayName = "Project.Content.Block.Texts";

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: "Texts",
    icon: "bookStackIsometric"
  };

  get blockTitle() {
    const customTitle = this.props.block.attributes.title;

    return customTitle || this.props.title;
  }

  get blockDescription() {
    return this.props.block.attributes.description;
  }

  get attributeVisibility() {
    return pick(this.props.block.attributes, [
      "showAuthors",
      "showCategoryLabels",
      "showCovers",
      "showDates",
      "showDescriptions",
      "showSubtitles"
    ]);
  }

  get texts() {
    return this.props.project.relationships.texts;
  }

  get textCategories() {
    return this.props.block.relationships.includedCategories;
  }

  get showCategories() {
    return this.textCategories.length > 0;
  }

  render() {
    const blockClass = "entity-section-wrapper";

    return (
      <Wrapper>
        <Heading title={this.blockTitle} icon={this.props.icon} />
        {this.blockDescription && (
          <div className={`${blockClass}__details`}>
            {this.blockDescription && (
              <p
                className="description pad-bottom"
                dangerouslySetInnerHTML={{
                  __html: this.blockDescription
                }}
              />
            )}
          </div>
        )}
        <div className={`${blockClass}__body`}>
          <div className="text-list">
            {this.showCategories ? (
              <TextList.Grouped
                categories={this.textCategories}
                texts={this.texts}
                visibility={this.attributeVisibility}
              />
            ) : (
              <TextList.Ungrouped
                texts={this.texts}
                visibility={this.attributeVisibility}
              />
            )}
          </div>
        </div>
      </Wrapper>
    );
  }
}
