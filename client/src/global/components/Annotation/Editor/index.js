import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import GlobalForm from "global/components/form";
import IconComposer from "global/components/utility/IconComposer";
import { UIDConsumer } from "react-uid";
import classNames from "classnames";
import RGMenuItem from "reader/components/annotation/popup/parts/RGMenuItem";
import { ReaderContext } from "helpers/contexts";
import withCurrentUser from "hoc/withCurrentUser";
import withReadingGroups from "hoc/withReadingGroups";
import * as Styled from "./styles";

class AnnotationEditor extends PureComponent {
  static displayName = "Annotation.Editor";

  static propTypes = {
    saveAnnotation: PropTypes.func.isRequired,
    annotation: PropTypes.object,
    cancel: PropTypes.func,
    closeOnSave: PropTypes.bool,
    t: PropTypes.func
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
    if (!this.shouldShowReadingGroups) return;

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
    document.removeEventListener("mouseup", this.handleClick, false);
  }

  get readingGroups() {
    return this.props.readingGroups;
  }

  get shouldShowReadingGroups() {
    if (!this.hasReaderContext) return false;
    return this.canAccessReadingGroups || this.canEngagePublicly;
  }

  get canAccessReadingGroups() {
    const { currentUser } = this.props;
    if (!currentUser) return false;
    return currentUser.attributes.classAbilities.readingGroup.read;
  }

  get hasReaderContext() {
    return !!this.context;
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
    return this.props.t("navigation.reading_group.my_public_annotations");
  }

  get privateLabel() {
    return this.props.t("navigation.reading_group.my_private_annotations");
  }

  get currentGroupObject() {
    if (
      this.props.currentAnnotatingReadingGroup === "public" ||
      this.props.currentAnnotatingReadingGroup === "private" ||
      !this.props.currentAnnotatingReadingGroup
    )
      return null;

    return this.readingGroups.find(
      group => group.id === this.props.currentAnnotatingReadingGroup
    );
  }

  get currentGroupName() {
    if (this.props.currentAnnotatingReadingGroup === "public")
      return this.publicLabel;
    if (this.props.currentAnnotatingReadingGroup === "private")
      return this.privateLabel;

    const currentGroup = this.currentGroupObject;

    if (!currentGroup) return this.setReadingGroup("private");
    return currentGroup.attributes.name;
  }

  get showUnverifiedMessage() {
    const established = this.props.currentUser?.attributes.established;
    const trusted = this.props.currentUser?.attributes.trusted;

    if (established || trusted) return false;

    const currentGroup = this.props.currentAnnotatingReadingGroup;

    if (currentGroup === "private") return false;
    if (currentGroup === "public") return true;

    return this.currentGroupObject?.attributes.privacy === "public";
  }

  get disableSubmit() {
    if (/^\s*$/.test(this.state.body)) return true;

    return this.showUnverifiedMessage;
  }

  setReadingGroupFromAnnotationEdit() {
    const { annotation } = this.props;
    if (annotation.attributes.readingGroupId) {
      this.setReadingGroup(annotation.attributes.readingGroupId);
    } else if (annotation.attributes.private) {
      this.setReadingGroup("private");
    } else {
      this.setReadingGroup("public");
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    const {
      currentAnnotatingReadingGroup,
      closeOnSave,
      saveAnnotation,
      annotation
    } = this.props;

    const { errorsIgnored, ...attributes } = this.state;
    const mutableAttributes = { ...attributes };
    mutableAttributes.private = currentAnnotatingReadingGroup === "private";
    if (
      currentAnnotatingReadingGroup !== "private" &&
      currentAnnotatingReadingGroup !== "public"
    ) {
      mutableAttributes.readingGroupId = currentAnnotatingReadingGroup;
    } else {
      mutableAttributes.readingGroupId = null;
    }
    const updatedAnnotation = { ...annotation, attributes: mutableAttributes };

    try {
      await saveAnnotation(updatedAnnotation);

      if (closeOnSave) this.handleCancel();
    } catch (err) {
      this.handleErrors(err.body.errors);
    }
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
      !this.picker ||
      this.picker.contains(event.target) ||
      this.pickerToggle.contains(event.target) ||
      !this.state.pickerOpen
    )
      return;
    this.setState({ pickerOpen: false });
  };

  setReadingGroup = id => {
    this.setState({ pickerOpen: false });
    this.props.setAnnotatingReadingGroup(id);
  };

  handleErrors(errors) {
    this.setState({ errors });
  }

  isSelected(option) {
    if (option === this.props.currentAnnotatingReadingGroup) return true;
    return false;
  }

  isPrivateGroup(privacy) {
    return privacy === "private" || privacy === "anonymous";
  }

  renderSRSelect(id) {
    return (
      <select
        aria-labelledby={`${id}-label`}
        className="annotation-editor__group-select"
        onChange={event => this.setReadingGroup(event.target.value)}
        value={this.props.currentAnnotatingReadingGroup}
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
          "annotation-group-options--hidden": !this.state.pickerOpen
        })}
      >
        <div className="annotation-group-options__list">
          {this.canEngagePublicly && (
            <RGMenuItem
              label={this.publicLabel}
              onClick={() => this.setReadingGroup("public")}
              selected={this.isSelected("public")}
            />
          )}
          <RGMenuItem
            label={this.privateLabel}
            onClick={() => this.setReadingGroup("private")}
            privateGroup
            selected={this.isSelected("private")}
          />
          {this.hasReadingGroups &&
            this.readingGroups.map(rg => (
              <RGMenuItem
                key={rg.id}
                label={rg.attributes.name}
                onClick={() => this.setReadingGroup(rg.id)}
                privateGroup={this.isPrivateGroup(rg.attributes.privacy)}
                selected={this.isSelected(rg.id)}
              />
            ))}
        </div>
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
    const t = this.props.t;
    return (
      <div className="annotation-editor">
        <form onSubmit={this.handleSubmit}>
          <GlobalForm.Errorable
            name="attributes[body]"
            errors={this.state.errors}
            idForError="annotation-textarea-error"
          >
            <label htmlFor="annotation-textarea" className="screen-reader-text">
              {t("reader.actions.annotate_passage")}
            </label>
            <textarea
              ref={ci => {
                this.ci = ci;
              }}
              id="annotation-textarea"
              aria-describedby="annotation-textarea-error"
              style={{ width: "100%" }}
              placeholder={`${t("reader.actions.annotate_passage")}...`}
              onChange={this.handleBodyChange}
              value={this.state.body}
              className="annotation-editor__textarea"
            />
          </GlobalForm.Errorable>

          <div className="annotation-editor__actions">
            {this.shouldShowReadingGroups && (
              <UIDConsumer name={id => `${this.idPrefix}-${id}`}>
                {id => (
                  <div className="annotation-editor__action">
                    <div className="annotation-editor__action-label">
                      <IconComposer
                        icon="readingGroup24"
                        size="default"
                        className="annotation-editor__action-icon"
                      />
                      <span id={`${id}-label`}>
                        {this.canAccessReadingGroups
                          ? `${t("glossary.reading_group_one")}:`
                          : `${t("common.visibility")}`}
                      </span>
                    </div>
                    {this.renderSRSelect(id)}
                    {this.renderGroupPicker()}
                  </div>
                )}
              </UIDConsumer>
            )}
            <div className="annotation-editor__buttons">
              <button
                onClick={this.handleCancel}
                className="button-primary button-primary--gray"
              >
                <span className="button-primary__text">
                  {t("actions.cancel")}
                </span>
              </button>
              <button
                className="button-secondary"
                disabled={this.disableSubmit}
              >
                {t("actions.save")}
              </button>
            </div>
          </div>
        </form>
        {this.showUnverifiedMessage && (
          <Styled.UnverifiedMessage>
            {t("reader.notes.unverified_message")}
          </Styled.UnverifiedMessage>
        )}
      </div>
    );
  }
}

export default withTranslation()(
  withReadingGroups(withCurrentUser(AnnotationEditor))
);
