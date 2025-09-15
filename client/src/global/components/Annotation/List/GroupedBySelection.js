import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import PropTypes from "prop-types";
import GroupBySubject from "../GroupBy/Subject";
import Editor from "../Editor";
import TextContent from "../Annotation/TextContent";
import UserContent from "../Annotation/UserContent";
import { uiVisibilityActions } from "actions";
import * as Styled from "./styles";

export default class GroupedList extends PureComponent {
  static displayName = "Annotation.List.GroupedBySelection";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired,
    focusHandler: PropTypes.func,
    annotations: PropTypes.array,
    closeDrawer: PropTypes.func,
    showUnverifiedWarning: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      editorVisible: false
    };
    this.annotateToggleRef = React.createRef();
  }

  showEditor = () => {
    this.setState({ editorVisible: true });
  };

  hideEditor = () => {
    this.setState({ editorVisible: false }, () => {
      if (this.annotateToggleRef.current)
        this.annotateToggleRef.current.focus();
    });
  };

  hasComments = group => {
    return group.annotations?.some(
      annotation => (annotation?.attributes?.commentsCount || 0) > 0
    );
  };

  onProfileClick = () =>
    this.props.dispatch(uiVisibilityActions.visibilityShow("signInUpOverlay"));

  render() {
    const {
      annotations,
      saveAnnotation,
      loginHandler,
      showUnverifiedWarning,
      closeDrawer
    } = this.props;

    return (
      <div className="annotation-selection">
        {showUnverifiedWarning && (
          <Styled.UnverifiedMessage>
            <Trans
              i18nKey="messages.unverified_to_comment"
              components={[
                <Styled.ProfileButton
                  type="button"
                  onClick={this.onProfileClick}
                />
              ]}
            />
          </Styled.UnverifiedMessage>
        )}
        <ul className="selection-list">
          <GroupBySubject
            annotations={annotations}
            render={group => (
              <li key={group.selection.hash} className="annotation-detail">
                <TextContent
                  annotation={group.annotation}
                  selection={group.selection.subject}
                  onAnnotate={this.showEditor}
                  onLogin={loginHandler}
                  annotateToggleRef={this.annotateToggleRef}
                  focusHandler={this.props.focusHandler}
                />
                {this.state.editorVisible && (
                  <Editor
                    annotation={{ attributes: {} }}
                    cancel={this.hideEditor}
                    saveAnnotation={attr => saveAnnotation(attr, group)}
                  />
                )}
                <ul
                  className="annotation-list"
                  {...(group.annotations.length > 1 || this.hasComments(group)
                    ? {}
                    : { role: "presentation" })}
                >
                  {group.annotations.map(annotation => {
                    return (
                      <UserContent
                        key={annotation.id}
                        annotation={annotation}
                        showLogin={loginHandler}
                        closeDrawer={closeDrawer}
                      />
                    );
                  })}
                </ul>
              </li>
            )}
          />
        </ul>
      </div>
    );
  }
}
