import React, { PureComponent } from "react";
import Utility from "frontend/components/utility";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import SourceSummary from "../SourceSummary/index";
import Authorize from "hoc/authorize";

export default class HighlightDetail extends PureComponent {
  static displayName = "Annotation.HighlightAnnotation";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    visitHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      hovering: false
    };
  }

  hoverHandler = hovering => {
    this.setState({ hovering });
  };

  get displayFormat() {
    return this.props.displayFormat;
  }

  render() {
    const { annotation, visitHandler, deleteHandler } = this.props;
    const wrapperClasses = classNames({
      "annotation-selection__text-container": true,
      "annotation-selection__text-container--light": true,
      "annotation-selection__text-container--rounded-corners":
        this.displayFormat === "fullPage",
      "annotation-selection__text-container--hovering": this.state.hovering
    });

    return (
      <div className={wrapperClasses}>
        <div className="annotation-selection__container">
          <IconComposer
            icon="interactHighlight32"
            size="default"
            iconClass="annotation-selection__icon"
          />
          <span className="annotation-selection__highlight-text">
            {annotation.attributes.subject}
          </span>
          <SourceSummary
            includeDate
            includeCreator
            annotation={annotation}
            onClick={visitHandler}
            onHover={this.hoverHandler}
          />
          <Authorize entity={annotation} ability={"delete"}>
            <div className="annotation-selection__action-buttons">
              <Utility.ConfirmableButton
                label="Delete"
                confirmHandler={deleteHandler}
              />
            </div>
          </Authorize>
        </div>
      </div>
    );
  }
}
