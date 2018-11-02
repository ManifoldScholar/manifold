import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { TextList } from "components/frontend";

export default class ProjectDetailTexts extends PureComponent {
  static displayName = "ProjectDetail.Texts";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  render() {
    const project = this.props.project;
    const { publishedText, texts, textCategories } = project.relationships;
    const excludes = [];
    if (publishedText) {
      // excludes.push(publishedText.id);
    }

    return (
      <div className="entities text-list">
        {publishedText ? <TextList.Published text={publishedText} /> : null}
        <TextList.Grouped
          excludeIds={excludes}
          categories={textCategories}
          texts={texts}
        />
      </div>
    );
  }
}
