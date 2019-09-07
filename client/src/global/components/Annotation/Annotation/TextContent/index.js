import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import Truncated from "./Truncated";
import nl2br from "nl2br";
import classNames from "classnames";
import Authorize from "hoc/authorize";
import IconComposer from "global/components/utility/IconComposer";
import SourceSummary from "../../SourceSummary/index";

export default class AnnotationSelectionWrapper extends PureComponent {
  static displayName = "Annotation.Annotation.TextContent";

  static propTypes = {
    truncate: PropTypes.number,
    subject: PropTypes.string,
    onViewInText: PropTypes.func,
    onAnnotate: PropTypes.func,
    onLogin: PropTypes.func,
    projectTitle: PropTypes.string,
    sectionTitle: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      editorOpen: false
    };
  }

  get viewable() {
    return !!this.props.onViewInText;
  }

  get annotatable() {
    return !!this.props.onAnnotate;
  }

  get canLogin() {
    return !!this.props.onLogin;
  }

  get fullPageFormat() {
    return this.props.displayFormat === "fullPage";
  }

  get selectionTextClassNames() {
    return classNames({
      "annotation-selection__text-container": true,
      "annotation-selection__text-container--dark": this.fullPageFormat,
      "annotation-selection__text-container--light": !this.fullPageFormat,
      "annotation-selection__hover-link": this.viewable
    });
  }

  get iconClassNames() {
    return "annotation-selection__icon";
  }

  get selectionContainerClassNames() {
    return "annotation-selection__container";
  }

  get buttonClassNames() {
    return "annotation-selection__button";
  }

  get wholeSelectionButtonClassNames() {
    return "annotation-selection__button-absolute";
  }

  maybeTruncateSelection() {
    const { subject, truncate, displayFormat } = this.props;
    if (truncate && subject && subject.length > truncate) {
      return (
        <Truncated
          selection={subject}
          truncate={truncate}
          displayFormat={displayFormat}
        />
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: nl2br(subject) }} />;
  }

  render() {
    const { projectTitle, sectionTitle } = this.props;
    return (
      <div className={this.selectionTextClassNames}>
        <div className={this.selectionContainerClassNames}>
          <IconComposer
            icon="socialCite32"
            size="default"
            iconClass={this.iconClassNames}
          />
          {this.maybeTruncateSelection()}
          <SourceSummary
            projectTitle={projectTitle}
            sectionTitle={sectionTitle}
            viewable={this.viewable}
            onClick={this.props.onViewInText}
          />
        </div>
        {this.annotatable && (
          <Fragment>
            <Authorize kind="any">
              <button
                className={this.buttonClassNames}
                onClick={this.props.onAnnotate}
              >
                {"Annotate"}
              </button>
            </Authorize>
            {this.canLogin && (
              <Authorize kind="unauthenticated">
                <button
                  className={this.buttonClassNames}
                  onClick={this.props.onLogin}
                >
                  {"Login to annotate"}
                </button>
              </Authorize>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}
