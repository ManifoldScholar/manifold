import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { UID } from "react-uid";
import classNames from "classnames";
import ReadingGroupOption from "reader/components/annotation/Popup/parts/ReadingGroupOption";
import withReadingGroups from "hoc/with-reading-groups";
import { ReaderContext } from "helpers/contexts";
import withCurrentUser from "hoc/with-current-user";

class AnnotationEditor extends PureComponent {
  static displayName = "Annotation.Editor";

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

  static contextType = ReaderContext;

  constructor(props) {
    super(props);
    this.state = {
      format: "annotation",
      body: props.annotation.attributes.body || "",
      errors: [],
      pickerOpen: false
    };
  }

  UNSAFE_componentWillMount() {
    const { annotation } = this.props;
    if (annotation.id) {
      this.setReadingGroupFromAnnotationEdit();
    }
  }

  componentDidMount() {
    if (this.ci) this.ci.focus();
    document.addEventListener("mouseup", this.handleClick, false);
  }

  componentWillUnmount() {
    clearTimeout(this.focusTimeout);
    document.removeEventListener("mouseup", this.handleClick, false);
  }

  get readingGroups() {
    return this.props.readingGroups;
  }

  get canAccessReadingGroups() {
    const { currentUser } = this.props;
    if (!currentUser) return false;
    return currentUser.attributes.classAbilities.readingGroup.read;
  }

  get canEngagePublicly() {
    return this.context.attributes.abilities.engagePublicly;
  }

  get hasReadingGroups() {
    return this.readingGroups && this.readingGroups.length > 0;
  }

  get idPrefix() {
    return "annotation-picker";
  }

  get publicLabel() {
    return "My Public Annotations";
  }

  get privateLabel() {
    return "My Private Annotations";
  }

  get currentGroupName() {
    if (this.props.currentReadingGroup === "public") return this.publicLabel;
    if (this.props.currentReadingGroup === "private") return this.privateLabel;

    const currentGroup = this.readingGroups.find(
      group => group.id === this.props.currentReadingGroup
    );

    if (!currentGroup) return this.setReadingGroup("private");
    return currentGroup.attributes.name;
  }

  setReadingGroupFromAnnotationEdit() {
    const { annotation } = this.props;
    if (annotation.attributes.readingGroupId) {
      this.props.setReadingGroup(annotation.attributes.readingGroupId);
    } else if (annotation.attributes.private) {
      this.props.setReadingGroup("private");
    } else {
      this.props.setReadingGroup("public");
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const {
      currentReadingGroup,
      closeOnSave,
      saveAnnotation,
      annotation
    } = this.props;
    const { errorsIgnored, ...attributes } = this.state;
    const mutableAttributes = { ...attributes };
    mutableAttributes.private = currentReadingGroup === "private";
    if (currentReadingGroup !== "private" && currentReadingGroup !== "public") {
      mutableAttributes.readingGroupId = currentReadingGroup;
    } else {
      mutableAttributes.readingGroupId = null;
    }
    const updatedAnnotation = { ...annotation, attributes: mutableAttributes };

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

  handleClick = event => {
    if (
      this.picker.contains(event.target) ||
      this.pickerToggle.contains(event.target) ||
      !this.state.pickerOpen
    )
      return;
    this.setState({ pickerOpen: false });
  };

  setReadingGroup = id => {
    this.setState({ pickerOpen: false });
    this.props.setReadingGroup(id);
  };

  handleErrors(errors) {
    this.setState({ errors });
  }

  isSelected(option) {
    if (option === this.props.currentReadingGroup) return true;
    return false;
  }

  isPrivateGroup(privacy) {
    return privacy === "private" || privacy === "anonymous";
  }

  renderSRSelect(id) {
    return (
      <select
        aria-labelledby={`${id}-label`}
        className="screen-reader-text"
        onChange={event => this.setReadingGroup(event.target.value)}
        value={this.props.currentReadingGroup}
      >
        {this.canEngagePublicly && (
          <option value="public">{this.publicLabel}</option>
        )}
        <option value="private">{this.privateLabel}</option>
        {this.hasReadingGroups &&
          this.readingGroups.map(option => (
            <option key={option.id} value={option.id}>
              {option.attributes.name}
            </option>
          ))}
      </select>
    );
  }

  renderOptions() {
    return (
      <div
        ref={picker => (this.picker = picker)}
        tabIndex="-1"
        className={classNames({
          "annotation-group-options": true,
          "annotation-group-options--popup": true,
          "annotation-group-options--light": true,
          "annotation-group-options--hidden": !this.state.pickerOpen
        })}
      >
        <ul className="annotation-group-options__list">
          {this.canEngagePublicly && (
            <ReadingGroupOption
              label={this.publicLabel}
              onClick={() => this.setReadingGroup("public")}
              selected={this.isSelected("public")}
            />
          )}
          <ReadingGroupOption
            label={this.privateLabel}
            onClick={() => this.setReadingGroup("private")}
            privateGroup
            selected={this.isSelected("private")}
          />
          {this.hasReadingGroups &&
            this.readingGroups.map(rg => (
              <ReadingGroupOption
                key={rg.id}
                label={rg.attributes.name}
                onClick={() => this.setReadingGroup(rg.id)}
                privateGroup={this.isPrivateGroup(rg.attributes.privacy)}
                selected={this.isSelected(rg.id)}
              />
            ))}
        </ul>
        {this.canAccessReadingGroups && (
          <div className="annotation-group-options__footer">
            <Link
              to={lh.link("frontendReadingGroups")}
              className="annotation-group-options__link"
            >
              <span className="annotation-group-options__link-text">
                Manage Groups
              </span>
              <IconComposer
                icon="link24"
                size="default"
                iconClass="annotation-group-options__icon annotation-group-options__icon--link"
              />
            </Link>
          </div>
        )}
      </div>
    );
  }

  renderGroupPicker() {
    return (
      <div className="annotation-editor__group-picker" aria-hidden>
        <button
          ref={pickerToggle => (this.pickerToggle = pickerToggle)}
          tabIndex={-1}
          type="button"
          onClick={() => this.setState({ pickerOpen: !this.state.pickerOpen })}
          className="annotation-editor__group-picker-toggle"
        >
          <span className="annotation-editor__group-picker-toggle-text">
            {this.currentGroupName}
          </span>
          <IconComposer icon="disclosureDown16" size={22} />
        </button>
        {this.renderOptions()}
      </div>
    );
  }

  render() {
    return (
      <div className="annotation-editor">
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
              className="annotation-editor__textarea"
            />
          </GlobalForm.Errorable>

          <div className="annotation-editor__actions">
            {(this.canAccessReadingGroups || this.canEngagePublicly) && (
              <UID name={id => `${this.idPrefix}-${id}`}>
                {id => (
                  <div className="annotation-editor__action">
                    <div className="annotation-editor__action-label">
                      <IconComposer
                        icon="readingGroup24"
                        size="default"
                        iconClass="annotation-editor__action-icon"
                      />
                      <span id={`${id}-label`}>
                        {this.canAccessReadingGroups
                          ? "Reading Group:"
                          : "Visibility:"}
                      </span>
                    </div>

                    {this.renderGroupPicker()}
                    {this.renderSRSelect(id)}
                  </div>
                )}
              </UID>
            )}
            <div className="annotation-editor__buttons">
              <button
                onClick={this.handleCancel}
                className="button-primary button-primary--gray"
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

export default withReadingGroups(withCurrentUser(AnnotationEditor));
