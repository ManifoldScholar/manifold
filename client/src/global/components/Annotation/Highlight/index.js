import React, { PureComponent } from "react";
import Utility from "frontend/components/utility";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import classNames from "classnames";
import SourceSummary from "../SourceSummary/index";
import Authorize from "hoc/authorize";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router";

const { request } = entityStoreActions;

class HighlightDetail extends PureComponent {
  static displayName = "Annotation.Highlight";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    visitHandler: PropTypes.func
  };

  deleteAnnotation = () => {
    const { annotation } = this.props;
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    return res.promise;
  };

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

  get displayFormat() {
    return this.props.displayFormat;
  }

  get containerClassNames() {
    return classNames({
      "annotation-selection__text-container": true,
      "annotation-selection__text-container--light": true,
      "annotation-selection__text-container--rounded-corners":
        this.displayFormat === "fullPage",
      "annotation-selection__hover-link": this.viewable
    });
  }

  get textSection() {
    return this.props.annotation.relationships.textSection;
  }

  get projectTitle() {
    if (!this.textSection || !this.textSection.attributes) return null;
    return this.textSection.attributes.textTitle;
  }

  get sectionTitle() {
    if (!this.textSection || !this.textSection.attributes) return null;
    return this.textSection.attributes.name;
  }

  get user() {
    return this.props.annotation.relationships.creator.attributes.fullName;
  }

  get highlightDate() {
    return this.props.annotation.attributes.createdAt;
  }

  render() {
    const annotation = this.props.annotation;
    return (
      <div className={this.containerClassNames}>
        <button
          className="annotation-selection__button-absolute"
          onClick={this.visitHandler}
          aria-label="View selection within text."
        />
        <span className="annotation-selection__highlight-text">
          {annotation.attributes.subject}
        </span>
        <SourceSummary
          user={this.user}
          projectTitle={this.projectTitle}
          sectionTitle={this.sectionTitle}
          highlightDate={this.highlightDate}
          viewable={this.viewable}
        />
        <Authorize entity={annotation} ability={"delete"}>
          <div className="annotation-selection__action-buttons">
            <Utility.ConfirmableButton
              label="Delete"
              confirmHandler={this.deleteAnnotation}
            />
          </div>
        </Authorize>
      </div>
    );
  }
}

export default connect()(withRouter(HighlightDetail));
