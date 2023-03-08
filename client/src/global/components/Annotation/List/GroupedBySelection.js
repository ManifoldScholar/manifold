import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import GroupBySubject from "../GroupBy/Subject";
import Editor from "../Editor";
import TextContent from "../Annotation/TextContent";
import UserContent from "../Annotation/UserContent";

export default class GroupedList extends PureComponent {
  static displayName = "Annotation.List.GroupedBySelection";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired,
    annotations: PropTypes.array,
    closeDrawer: PropTypes.func
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

  render() {
    const { annotations, saveAnnotation, loginHandler } = this.props;

    return (
      <div className="annotation-selection">
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
                />
                {this.state.editorVisible && (
                  <Editor
                    annotation={{ attributes: {} }}
                    cancel={this.hideEditor}
                    saveAnnotation={attr => saveAnnotation(attr, group)}
                  />
                )}
                <ul className="annotation-list">
                  {group.annotations.map(annotation => {
                    return (
                      <UserContent
                        key={annotation.id}
                        annotation={annotation}
                        showLogin={loginHandler}
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
