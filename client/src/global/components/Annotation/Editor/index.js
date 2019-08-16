import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import IconComposer from "global/components/utility/IconComposer";
import connectAndFetch from "utils/connectAndFetch";
import { meAPI, requests } from "api";
import { select } from "utils/entityUtils";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;
import Developer from "global/components/developer";
import isNil from "lodash/isNil";

class AnnotationEditor extends PureComponent {
  static displayName = "Annotation.Editor";

  static fetchData = (getState, dispatch) => {
    const readingGroupsFetch = meAPI.readingGroups();
    const readingGroupsAction = request(
      readingGroupsFetch,
      requests.feMyReadingGroups
    );
    const { promise: one } = dispatch(readingGroupsAction);
    const promises = [one];
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      readingGroups: select(requests.feMyReadingGroups, state.entityStore)
    };
  };

  static propTypes = {
    saveAnnotation: PropTypes.func.isRequired,
    annotation: PropTypes.object,
    cancel: PropTypes.func,
    closeOnSave: PropTypes.bool
  };

  static defaultProps = {
    closeOnSave: true,
    annotation: { attributes: {} }
  };

  constructor(props) {
    super(props);
    this.state = {
      readingGroupId: props.annotation.attributes.readingGroupId || null,
      format: "annotation",
      body: props.annotation.attributes.body || "",
      private: props.annotation.attributes.private || false,
      errors: []
    };
  }

  componentDidMount() {
    if (this.ci) this.ci.focus();
  }

  componentWillUnmount() {
    clearTimeout(this.focusTimeout);
  }

  handleSubmit = event => {
    event.preventDefault();
    const { closeOnSave, saveAnnotation, annotation } = this.props;
    const { errorsIgnored, ...attributes } = this.state;
    const updatedAnnotation = Object.assign({}, annotation, { attributes });
    const promise = saveAnnotation(updatedAnnotation);
    if (closeOnSave && promise) {
      promise.then(
        () => {
          this.handleCancel();
        },
        () => {}
      );
    }
    promise.catch(response => {
      this.handleErrors(response.body.errors);
    });
  };

  handleBodyChange = event => {
    this.setState({ body: event.target.value });
  };

  handleCancel = (event = null) => {
    if (event) event.preventDefault();
    if (this.props.cancel) {
      this.props.cancel(event);
    }
  };

  setPrivacyPublic = eventIgnored => {
    this.setState({ private: false, readingGroupId: null });
  };

  setPrivacyPrivate = eventIgnored => {
    this.setState({ private: true, readingGroupId: null });
  };

  setReadingGroup = (eventIgnored, readingGroup) => {
    this.setState({ readingGroupId: readingGroup.id, private: false });
  };

  handleErrors(errors) {
    this.setState({ errors });
  }

  isSelected(option) {
    const { private: isPrivate, readingGroupId } = this.state;
    if (option === "public" && isNil(readingGroupId) && !isPrivate) return true;
    if (option === "private" && isNil(readingGroupId) && isPrivate) return true;
    if (option === readingGroupId) return true;
    return false;
  }

  render() {
    const privateIcon = (
      <IconComposer
        icon="lock16"
        size={16}
        iconClass={this.lockIconClassNames}
      />
    );

    return (
      <div className="annotation-editor">
        <Developer.Debugger object={this.state} />
        <form onSubmit={this.handleSubmit}>
          <GlobalForm.Errorable
            name="attributes[body]"
            errors={this.state.errors}
            idForError="annotation-textarea-error"
          >
            <label htmlFor="annotation-textarea" className="screen-reader-text">
              Annotate this passage
            </label>
            <textarea
              ref={ci => {
                this.ci = ci;
              }}
              id="annotation-textarea"
              aria-describedby="annotation-textarea-error"
              style={{ width: "100%" }}
              placeholder={"Annotate this passage..."}
              onChange={this.handleBodyChange}
              value={this.state.body}
            />
          </GlobalForm.Errorable>

          <div className="utility">
            {this.props.readingGroups && (
              <ul>
                <li style={this.isSelected("public") ? { color: "red" } : null}>
                  <button type="button" onClick={this.setPrivacyPublic}>
                    My Public Annotations
                  </button>
                </li>
                <li
                  style={this.isSelected("private") ? { color: "red" } : null}
                >
                  <button type="button" onClick={this.setPrivacyPrivate}>
                    My Private Annotations {privateIcon}
                  </button>
                </li>
                {this.props.readingGroups.map(rg => (
                  <li
                    style={this.isSelected(rg.id) ? { color: "red" } : null}
                    key={rg.id}
                  >
                    <button
                      type="button"
                      onClick={event => this.setReadingGroup(event, rg)}
                    >
                      {rg.attributes.name}
                      {rg.attributes.privacy === "private" && privateIcon}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="buttons">
              <button
                onClick={this.handleCancel}
                className="button-primary button-primary--dull"
              >
                <span className="button-primary__text">Cancel</span>
              </button>
              <button className="button-secondary" disabled={!this.state.body}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connectAndFetch(AnnotationEditor);
