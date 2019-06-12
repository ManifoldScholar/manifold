import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import GroupBySubject from "../GroupBy/Subject";
import Editor from "../Editor";
import TextContent from "../Annotation/TextContent";
import UserContent from "../Annotation/UserContent"

export default class GroupedList extends PureComponent {

  static displayName = "Annotation.List.GroupedBySelection";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired,
    annotations: PropTypes.array,
    closeDrawer: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      editorVisible: false
    };
  }

  showEditor = () => {
    this.setState({ editorVisible: true });
  };

  hideEditor = () => {
    this.setState({ editorVisible: false });
  };

  render() {
    const { annotations, saveAnnotation, loginHandler, dispatch } = this.props;

    return (
      <div className="annotation-selection">
        <ul className="selection-list">
          <GroupBySubject
            annotations={annotations}
            render={group => (
              <li key={group.selection.hash} className="annotation-detail">
                <TextContent
                  subject={group.selection.subject}
                  onAnnotate={this.showEditor}
                  onLogin={loginHandler}
                  truncate={250}
                />
                {this.state.editorVisible && (
                  <Editor
                    annotation={{ attributes: {} }}
                    cancel={this.hideEditor}
                    saveAnnotation={attr => saveAnnotation(attr, group)}
                  />
                )}
                <div className="container">
                  <ul className="annotation-list">
                    {group.annotations.map(annotation => {
                      return (
                        <UserContent
                          dispatch={dispatch}
                          key={annotation.id}
                          creator={annotation.relationships.creator}
                          showLogin={loginHandler}
                          annotation={annotation}
                        />
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
          />
        </ul>
      </div>
    )
  }

}
