import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Truncated from "./Truncated";
import nl2br from "nl2br";
import classNames from "classnames";
import Authorize from "hoc/authorize";
import IconComposer from "global/components/utility/IconComposer";
import SourceSummary from "../SourceSummary";

export default class AnnotationSelectionWrapper extends PureComponent {
  static displayName = "Annotation.Annotation.TextContent";

  static propTypes = {
    annotation: PropTypes.object,
    selection: PropTypes.string.isRequired,
    displayFormat: PropTypes.string,
    truncate: PropTypes.number,
    visitHandler: PropTypes.func,
    onAnnotate: PropTypes.func,
    onLogin: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      editorOpen: false,
      hovering: false
    };
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

  hoverHandler = hovering => {
    this.setState({ hovering });
  };

  maybeTruncateSelection() {
    const { truncate, displayFormat, selection } = this.props;
    if (truncate && selection && selection.length > truncate) {
      return (
        <Truncated
          selection={selection}
          truncate={truncate}
          displayFormat={displayFormat}
        />
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: nl2br(selection) }} />;
  }

  render() {
    const { annotation } = this.props;
    const wrapperClasses = classNames({
      "annotation-selection__text-container": true,
      "annotation-selection__text-container--dark": this.fullPageFormat,
      "annotation-selection__text-container--light": !this.fullPageFormat,
      "annotation-selection__text-container--hovering": this.state.hovering
    });

    return (
      <div className={wrapperClasses}>
        <div className="annotation-selection__container">
          <IconComposer
            icon="socialCite32"
            size="default"
            iconClass="annotation-selection__icon"
          />
          {this.maybeTruncateSelection()}
          <SourceSummary
            annotation={annotation}
            onClick={this.props.visitHandler}
            onHover={this.hoverHandler}
          />
        </div>
        {this.annotatable && (
          <>
            <Authorize kind="any">
              <button
                className="annotation-selection__button"
                onClick={this.props.onAnnotate}
              >
                {"Annotate"}
              </button>
            </Authorize>
            {this.canLogin && (
              <Authorize kind="unauthenticated">
                <button
                  className="annotation-selection__button"
                  onClick={this.props.onLogin}
                >
                  {"Login to annotate"}
                </button>
              </Authorize>
            )}
          </>
        )}
      </div>
    );
  }
}
