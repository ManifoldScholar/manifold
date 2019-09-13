import React, { PureComponent } from "react";
import TextContent from "./TextContent";
import UserContent from "./UserContent";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";

class Annotation extends PureComponent {
  static displayName = "Annotation.Annotation";

  defaultVisitHandler(annotation) {
    const {
      relationships: {
        textSection: {
          id,
          attributes: { textSlug }
        }
      }
    } = annotation;
    const { history } = this.props;
    const url = lh.link(
      "readerSection",
      textSlug,
      id,
      `#annotation-${annotation.id}`
    );
    return history.push(url);
  }

  visitHandler = event => {
    event.preventDefault();
    const { annotation, visitHandler } = this.props;
    if (visitHandler) return visitHandler(annotation);
    this.defaultVisitHandler(annotation);
  };

  get annotationListClassNames() {
    return classNames({
      "annotation-list": true,
      "annotation-list--dark": this.props.displayFormat === "fullPage"
    });
  }

  get textSection() {
    return this.props.annotation.relationships.textSection;
  }

  get projectTitle() {
    if (!this.textSection || !this.textSection.attributes) return null;
    return this.props.annotation.relationships.textSection.attributes.textTitle;
  }

  get sectionTitle() {
    if (!this.textSection || !this.textSection.attributes) return null;
    return this.props.annotation.relationships.textSection.attributes.name;
  }

  render() {
    const { annotation, displayFormat } = this.props;
    return (
      <>
        <div className="annotation-selection">
          <TextContent
            {...annotation.attributes}
            projectTitle={this.projectTitle}
            sectionTitle={this.sectionTitle}
            truncate={250}
            onViewInText={this.visitHandler}
            displayFormat={displayFormat}
          />
        </div>
        <ul className={this.annotationListClassNames}>
          <UserContent
            creator={annotation.relationships.creator}
            annotation={annotation}
            includeComments={false}
            includeMarkers={false}
          />
        </ul>
      </>
    );
  }
}

export default withRouter(Annotation);
