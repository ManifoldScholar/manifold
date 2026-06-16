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
import { UIDConsumer } from "react-uid";
import { withTranslation } from "react-i18next";
import { breakpoints } from "theme/styles/variables/media";

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
    this.state = { useDefault: !hasImage, vertical: false };
    this.defaultTab = React.createRef();
    this.customTab = React.createRef();
  }

  componentDidMount() {
    // The sections, and thus the tabs, stack vertically below this breakpoint;
    // it must match the grid layout switch in the avatarBuilder theme styles.
    this.mediaQuery = window.matchMedia(`(min-width: ${breakpoints[95]})`);
    this.setOrientation(this.mediaQuery);
    this.mediaQuery.addEventListener("change", this.setOrientation);
  }

  componentWillUnmount() {
    this.mediaQuery.removeEventListener("change", this.setOrientation);
  }

  setOrientation = event => {
    this.setState({ vertical: !event.matches });
  };

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
    // Flag the avatar for removal, but don't remove the image from the form
    this.props.setOther(true, "attributes[removeAvatar]");
  };

  handleCustomClick = () => {
    this.setState({ useDefault: false });
    // Make sure the removeAvatar flag is set to false
    this.props.setOther(false, "attributes[removeAvatar]");
  };

  // Selection follows focus (automatic activation), per the APG tabs pattern.
  // Arrow keys follow the tablist's visual orientation at each breakpoint.
  handleTabKeyDown = event => {
    const [prevKey, nextKey] = this.state.vertical
      ? ["ArrowUp", "ArrowDown"]
      : ["ArrowLeft", "ArrowRight"];
    let selectDefault;
    if (event.key === prevKey || event.key === nextKey) {
      selectDefault = !this.state.useDefault;
    } else if (event.key === "Home") {
      selectDefault = true;
    } else if (event.key === "End") {
      selectDefault = false;
    } else {
      return;
    }
    event.preventDefault();
    const tab = selectDefault ? this.defaultTab : this.customTab;
    if (tab.current) tab.current.focus();
    if (selectDefault === this.state.useDefault) return;
    if (selectDefault) {
      this.handleDefaultClick();
    } else {
      this.handleCustomClick();
    }
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
      <UIDConsumer name={id => `avatar-builder-${id}`}>
        {id => (
          <>
            <GlobalForm.Errorable
              className={this.props.wide ? "wide" : undefined}
              name="attributes[avatar]"
              errors={this.props.errors}
              label="Avatar"
            >
              <fieldset className="avatar-builder">
                <Form.Label
                  as="legend"
                  label={t("projects.thumbnail.thumbnail")}
                />
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
                  {/* The visual design draws each tab inside a bordered box
                      shared with its panel, but a tablist may not contain
                      tabpanels. The buttons therefore live in a real tablist
                      and are absolutely positioned over the section boxes via
                      grid-area placement; a hidden spacer button inside each
                      section reserves the space where its tab renders. */}
                  <div
                    role="tablist"
                    className="tablist"
                    aria-label={t("projects.thumbnail.type_label")}
                    aria-orientation={
                      this.state.vertical ? "vertical" : undefined
                    }
                  >
                    <button
                      ref={this.defaultTab}
                      id={`${id}-default-tab`}
                      role="tab"
                      className="label tab-default"
                      aria-selected={this.state.useDefault}
                      aria-controls={`${id}-default-panel`}
                      tabIndex={this.state.useDefault ? 0 : -1}
                      onClick={this.handleDefaultClick}
                      onKeyDown={this.handleTabKeyDown}
                      type="button"
                    >
                      {t("common.default")}
                    </button>
                    <button
                      ref={this.customTab}
                      id={`${id}-custom-tab`}
                      role="tab"
                      className="label tab-custom"
                      aria-selected={!this.state.useDefault}
                      aria-controls={`${id}-custom-panel`}
                      tabIndex={!this.state.useDefault ? 0 : -1}
                      onClick={this.handleCustomClick}
                      onKeyDown={this.handleTabKeyDown}
                      type="button"
                    >
                      {t("common.custom")}
                    </button>
                  </div>
                  <div className={pickerClasses}>
                    <button
                      className="label spacer"
                      aria-hidden="true"
                      tabIndex={-1}
                      type="button"
                    >
                      {t("common.default")}
                    </button>
                    <div
                      id={`${id}-default-panel`}
                      role="tabpanel"
                      aria-labelledby={`${id}-default-tab`}
                      className="section-inner"
                      inert={!this.state.useDefault ? "" : undefined}
                    >
                      <ColorPicker
                        onChange={this.onColorChange}
                        value={this.props.getModelValue(
                          "attributes[avatarColor]"
                        )}
                        label={t("projects.thumbnail.default_thumbnail")}
                        {...this.props}
                      />
                    </div>
                  </div>
                  <div className={uploadClasses}>
                    <button
                      className="label spacer"
                      aria-hidden="true"
                      tabIndex={-1}
                      type="button"
                    >
                      {t("common.custom")}
                    </button>
                    <div
                      id={`${id}-custom-panel`}
                      role="tabpanel"
                      aria-labelledby={`${id}-custom-tab`}
                      className="section-inner"
                      inert={this.state.useDefault ? "" : undefined}
                    >
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
                        isBuilder
                      />
                    </div>
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
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(withConfirmation(setter(AvatarBuilder)));
