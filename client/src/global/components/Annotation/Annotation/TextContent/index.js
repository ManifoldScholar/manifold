import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import Truncated from "./Truncated";
import nl2br from "nl2br";

import Authorize from "hoc/authorize";
import IconComposer from "global/components/utility/IconComposer";

export default class AnnotationSelectionWrapper extends PureComponent {

  static displayName = "Annotation.Annotation.TextContent";

  static propTypes = {
    truncate: PropTypes.number,
    subject: PropTypes.string,
    onViewInText: PropTypes.func,
    onAnnotate: PropTypes.func,
    onLogin: PropTypes.func
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

  get selectionTextClassNames() {
    return "annotation-selection__text";
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

  maybeTruncateSelection() {
    const { subject, truncate } = this.props;
    if (truncate && subject && subject.length > truncate) {
      return <Truncated selection={subject} truncate={truncate} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: nl2br(subject) }} />;
  }

  render() {
    return (
      <div className={this.selectionTextClassNames}>
        <div className={this.selectionContainerClassNames}>
          <IconComposer
            icon="socialCite32"
            size="default"
            iconClass={this.iconClassNames}
          />
          {this.maybeTruncateSelection()}
        </div>
        {this.viewable && (
          <button className={this.buttonClassNames} onClick={this.props.onViewInText}>
            {"View In Text"}
          </button>
        )}
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
