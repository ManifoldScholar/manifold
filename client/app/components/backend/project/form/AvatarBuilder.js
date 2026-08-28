import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import Form from "components/global/form";
import ColorPicker from "./ColorPicker";
import UniqueIcons from "components/global/icon/unique";
import classNames from "classnames";
import { FormContext } from "contexts";
import { brackets2dots } from "utils/string";
import { breakpoints } from "theme/styles/variables/media";

export default function AvatarBuilder({ wide, label: labelProp }) {
  const { t } = useTranslation();
  const id = useId();
  const { getModelValue, actions } = useContext(FormContext);

  const defaultTab = useRef(null);
  const customTab = useRef(null);

  const image =
    getModelValue("attributes[avatar][data]") ||
    getModelValue("attributes[avatarStyles][smallSquare]");

  const [useDefault, setUseDefault] = useState(() => !image);
  const [vertical, setVertical] = useState(false);

  // The sections, and thus the tabs, stack vertically below this breakpoint;
  // it must match the grid layout switch in the avatarBuilder theme styles.
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[95]})`);
    const setOrientation = event => setVertical(!event.matches);
    setOrientation(mediaQuery);
    mediaQuery.addEventListener("change", setOrientation);
    return () => mediaQuery.removeEventListener("change", setOrientation);
  }, []);

  const setField = useCallback(
    (value, name) => {
      if (actions?.setValue) actions.setValue(brackets2dots(name), value);
    },
    [actions]
  );

  const onColorChange = useCallback(
    color => {
      if (!color) return;
      setField(color.value, "attributes[avatarColor]");
    },
    [setField]
  );

  const handleDefaultClick = useCallback(() => {
    setUseDefault(true);
    // Flag the avatar for removal, but don't remove the image from the form
    setField(true, "attributes[removeAvatar]");
  }, [setField]);

  const handleCustomClick = useCallback(() => {
    setUseDefault(false);
    setField(false, "attributes[removeAvatar]");
  }, [setField]);

  // Selection follows focus (automatic activation), per the APG tabs pattern.
  const handleTabKeyDown = event => {
    const [prevKey, nextKey] = vertical
      ? ["ArrowUp", "ArrowDown"]
      : ["ArrowLeft", "ArrowRight"];
    let selectDefault;
    if (event.key === prevKey || event.key === nextKey) {
      selectDefault = !useDefault;
    } else if (event.key === "Home") {
      selectDefault = true;
    } else if (event.key === "End") {
      selectDefault = false;
    } else {
      return;
    }
    event.preventDefault();
    const tab = selectDefault ? defaultTab : customTab;
    if (tab.current) tab.current.focus();
    if (selectDefault === useDefault) return;
    if (selectDefault) {
      handleDefaultClick();
    } else {
      handleCustomClick();
    }
  };

  const displayLabel = labelProp || t("glossary.project_one");
  const avatarColor = getModelValue("attributes[avatarColor]");

  const renderCoverImage = () => {
    if (!image) return null;
    return (
      <div
        role="img"
        aria-label={t("projects.thumbnail.thumbnail_label", {
          title: getModelValue("attributes[title]")
        })}
        className="preview"
        style={{ backgroundImage: `url(${image})` }}
      />
    );
  };

  const renderPlaceholderImage = () => {
    if (!avatarColor) return null;
    return (
      <div className="preview">
        <UniqueIcons.ProjectPlaceholderUnique color={avatarColor} />
      </div>
    );
  };

  const uploadClasses = classNames({
    section: true,
    upload: true,
    active: !useDefault
  });
  const pickerClasses = classNames({
    section: true,
    color: true,
    active: useDefault
  });

  return (
    <>
      <Form.Errorable
        className={wide ? "wide" : undefined}
        name="attributes[avatar]"
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
              {useDefault ? renderPlaceholderImage() : renderCoverImage()}
            </div>
            {/* The visual design draws each tab inside a bordered box shared
                with its panel, but a tablist may not contain tabpanels. The
                buttons therefore live in a real tablist and are absolutely
                positioned over the section boxes via grid-area placement; a
                hidden spacer button inside each section reserves the space
                where its tab renders. */}
            <div
              role="tablist"
              className="tablist"
              aria-label={t("projects.thumbnail.type_label")}
              aria-orientation={vertical ? "vertical" : undefined}
            >
              <button
                ref={defaultTab}
                id={`${id}-default-tab`}
                role="tab"
                className="label tab-default"
                aria-selected={useDefault}
                aria-controls={`${id}-default-panel`}
                tabIndex={useDefault ? 0 : -1}
                onClick={handleDefaultClick}
                onKeyDown={handleTabKeyDown}
                type="button"
              >
                {t("common.default")}
              </button>
              <button
                ref={customTab}
                id={`${id}-custom-tab`}
                role="tab"
                className="label tab-custom"
                aria-selected={!useDefault}
                aria-controls={`${id}-custom-panel`}
                tabIndex={!useDefault ? 0 : -1}
                onClick={handleCustomClick}
                onKeyDown={handleTabKeyDown}
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
                inert={!useDefault ? "" : undefined}
              >
                <ColorPicker
                  onChange={onColorChange}
                  value={avatarColor}
                  label={t("projects.thumbnail.default_thumbnail")}
                  getModelValue={getModelValue}
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
                inert={useDefault ? "" : undefined}
              >
                <Form.Upload
                  name="attributes[avatar]"
                  readFrom="attributes[avatarStyles][smallSquare]"
                  remove="attributes[removeAvatar]"
                  placeholder="cover"
                  accepts="images"
                  label={t("projects.thumbnail.custom_thumbnail")}
                  labelClass="screen-reader-text"
                  isBuilder
                />
              </div>
            </div>
          </div>
          {useDefault && !!image && (
            <Form.InputError
              errors={[
                {
                  detail: t("modals.thumbnail_change", { label: displayLabel })
                }
              ]}
            />
          )}
        </fieldset>
      </Form.Errorable>
      {!useDefault && (
        <Form.TextInput
          label={t("projects.thumbnail.alt_label")}
          name="attributes[avatarAltText]"
        />
      )}
    </>
  );
}

AvatarBuilder.displayName = "Project.Form.AvatarBuilder";
