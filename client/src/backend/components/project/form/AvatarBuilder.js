import React, { Component } from "react";
import PropTypes from "prop-types";
import withConfirmation from "hoc/withConfirmation";
import Form from "global/components/form";
import setter from "global/components/form/setter";
import GlobalForm from "global/components/form";
import ColorPicker from "./ColorPicker";
import UniqueIcons from "global/components/icon/unique";
import InputError from "global/components/form/InputError";
import classNames from "classnames";
import { withTranslation } from "react-i18next";

class AvatarBuilder extends Component {
  static displayName = "Project.Form.AvatarBuilder";

  static propTypes = {
    label: PropTypes.string,
    confirm: PropTypes.func.isRequired,
    errors: PropTypes.array,
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    wide: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  constructor(props) {
    super(props);
    const hasImage = this.getImage();
    this.state = { useDefault: !hasImage };
  }

  getImage() {
    return (
      this.props.getModelValue("attributes[avatar][data]") ||
      this.props.getModelValue("attributes[avatarStyles][smallSquare]")
    );
  }

  onColorChange = color => {
    this.setAvatarColor(color);
  };

  onUploadChange = image => {
    if (!image) return this.removeAvatar();
    this.setAvatarImage(image);
  };

  setAvatarImage(image) {
    if (!image) return null;
    this.props.setOther(false, "attributes[removeAvatar]");
    this.props.setOther(image, "attributes[avatar]");
  }

  setAvatarColor(color) {
    if (!color) return null;
    this.props.setOther(color.value, "attributes[avatarColor]");
  }

  label() {
    if (this.props.label) return this.props.label;
    return this.props.t("glossary.project_one");
  }

  handleDefaultClick = () => {
    this.setState({ useDefault: true });
  };

  handleCustomClick = () => {
    this.setState({ useDefault: false });
  };

  removeAvatar() {
    this.props.setOther(true, "attributes[removeAvatar]");
    this.props.setOther(null, "attributes[avatarStyles][smallSquare]");
    this.props.setOther(null, "attributes[avatar]");
  }

  renderCoverImage(image) {
    if (!image) return null;
    const title = this.props.getModelValue("attributes[title]");
    return (
      <div
        role="img"
        aria-label={this.props.t("projects.thumbnail.thumbnail_label", {
          title
        })}
        className="preview"
        style={{ backgroundImage: `url(${image})` }}
      />
    );
  }

  renderPlaceholderImage() {
    if (!this.props.getModelValue("attributes[avatarColor]")) return null;
    return (
      <div className="preview">
        <UniqueIcons.ProjectPlaceholderUnique
          color={this.props.getModelValue("attributes[avatarColor]")}
        />
      </div>
    );
  }

  render() {
    const image = this.getImage();

    const uploadClasses = classNames({
      section: true,
      upload: true,
      active: !this.state.useDefault
    });
    const pickerClasses = classNames({
      section: true,
      color: true,
      active: this.state.useDefault
    });
    const t = this.props.t;

    return (
      <>
        <GlobalForm.Errorable
          className={this.props.wide ? "wide" : undefined}
          name="attributes[avatar]"
          errors={this.props.errors}
          label="Avatar"
        >
          <fieldset className="avatar-builder">
            <Form.Label as="legend" label={t("projects.thumbnail.thumbnail")} />
            <div className="grid">
              <div className="section current">
                <span className="label" aria-hidden="true">
                  {t("common.preview")}
                </span>
                <span className="label screen-reader-text">
                  {t("projects.thumbnail.current_thumbnail")}
                </span>
                {this.state.useDefault
                  ? this.renderPlaceholderImage()
                  : this.renderCoverImage(image)}
              </div>
              <div className={pickerClasses}>
                <button
                  className="label"
                  aria-pressed={this.state.useDefault}
                  onClick={this.handleDefaultClick}
                  type="button"
                >
                  <span className="label__indicator" />
                  {t("common.default")}
                </button>
                <ColorPicker
                  onChange={this.onColorChange}
                  value={this.props.getModelValue("attributes[avatarColor]")}
                  label={t("projects.thumbnail.default_thumbnail")}
                  {...this.props}
                  disabled={!this.state.useDefault || this.props.disabled}
                />
              </div>
              <div className={uploadClasses}>
                <button
                  className="label"
                  aria-pressed={!this.state.useDefault}
                  type="button"
                  onClick={this.handleCustomClick}
                >
                  <span className="label__indicator" />
                  {t("common.custom")}
                </button>
                <Form.Upload
                  set={this.onUploadChange}
                  initialValue={this.props.getModelValue(
                    "attributes[avatarStyles][smallSquare]"
                  )}
                  value={this.props.getModelValue("attributes[avatar]")}
                  placeholder="cover"
                  accepts="images"
                  label={t("projects.thumbnail.custom_thumbnail")}
                  labelClass="screen-reader-text"
                  disabled={this.state.useDefault}
                  isBuilder
                />
              </div>
            </div>
            {this.state.useDefault && !!image && (
              <InputError
                errors={[
                  {
                    detail: t("modals.thumbnail_change", {
                      label: this.label()
                    })
                  }
                ]}
              />
            )}
          </fieldset>
        </GlobalForm.Errorable>
        {!this.state.useDefault && (
          <GlobalForm.TextInput
            label={t("projects.thumbnail.alt_label")}
            name="attributes[avatarAltText]"
          />
        )}
      </>
    );
  }
}

export default withTranslation()(withConfirmation(setter(AvatarBuilder)));
