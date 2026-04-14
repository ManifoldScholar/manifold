import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import ColorPicker from "./ColorPicker";
import UniqueIcons from "global/components/icon/unique";
import classNames from "classnames";
import { FormContext } from "helpers/contexts";
import { brackets2dots } from "utils/string";
import Dialog from "global/components/dialog";
import useConfirmation from "hooks/useConfirmation";

export default function AvatarBuilder({ wide, label: labelProp }) {
  const { t } = useTranslation();
  const { getModelValue, actions } = useContext(FormContext);
  const { confirm, confirmation } = useConfirmation();

  const setField = useCallback(
    (value, name) => {
      if (actions?.setValue) actions.setValue(brackets2dots(name), value);
    },
    [actions]
  );

  const removeAvatar = useCallback(() => {
    setField(true, "attributes[removeAvatar]");
    setField(null, "attributes[avatarStyles][smallSquare]");
    setField(null, "attributes[avatar]");
  }, [setField]);

  const setAvatarImage = useCallback(
    image => {
      if (!image) return;
      setField(false, "attributes[removeAvatar]");
      setField(image, "attributes[avatar]");
    },
    [setField]
  );

  const setAvatarColor = useCallback(
    color => {
      if (!color) return;
      setField(color.value, "attributes[avatarColor]");
    },
    [setField]
  );

  const displayLabel = labelProp || t("glossary.project_one");

  const handleColorChange = useCallback(
    color => {
      confirm({
        heading: t("modals.thumbnail_change", { label: displayLabel }),
        message: t("modals.thumbnail_change_body"),
        callback: closeDialog => {
          removeAvatar();
          setAvatarColor(color);
          closeDialog();
        }
      });
    },
    [confirm, t, displayLabel, removeAvatar, setAvatarColor]
  );

  const onColorChange = useCallback(
    color => {
      if (
        getModelValue("attributes[avatar][data]") ||
        getModelValue("attributes[avatarStyles][smallSquare]")
      ) {
        return handleColorChange(color);
      }
      setAvatarColor(color);
    },
    [getModelValue, handleColorChange, setAvatarColor]
  );

  const onUploadChange = useCallback(
    image => {
      if (!image) return removeAvatar();
      setAvatarImage(image);
    },
    [removeAvatar, setAvatarImage]
  );

  const image =
    getModelValue("attributes[avatar][data]") ||
    getModelValue("attributes[avatarStyles][smallSquare]");

  const uploadClasses = classNames({
    section: true,
    upload: true,
    active: image
  });
  const pickerClasses = classNames({
    section: true,
    color: true,
    active: !image
  });

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Form.Errorable
        className={wide ? "wide" : undefined}
        name="attributes[avatar]"
        label="Avatar"
      >
        <div className="avatar-builder">
          <Form.Label label={t("projects.thumbnail.thumbnail")} />
          <div className="grid">
            <div className="section current">
              <span className="label" aria-hidden="true">
                {t("common.current")}
              </span>
              <span className="label screen-reader-text">
                {t("projects.thumbnail.current_thumbnail")}
              </span>
              {image ? (
                <div
                  role="img"
                  aria-label={t("projects.thumbnail.thumbnail_label", {
                    title: getModelValue("attributes[title]")
                  })}
                  className="preview"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ) : (
                getModelValue("attributes[avatarColor]") && (
                  <div className="preview">
                    <UniqueIcons.ProjectPlaceholderUnique
                      color={getModelValue("attributes[avatarColor]")}
                    />
                  </div>
                )
              )}
            </div>
            <div className={pickerClasses}>
              <span className="label" aria-hidden="true">
                {t("common.default")}
              </span>
              <ColorPicker
                onChange={onColorChange}
                value={getModelValue("attributes[avatarColor]")}
                label={t("projects.thumbnail.default_thumbnail")}
                getModelValue={getModelValue}
              />
            </div>
            <div className={uploadClasses}>
              <span className="label" aria-hidden="true">
                {t("common.custom")}
              </span>
              <Form.Upload
                set={onUploadChange}
                initialValue={getModelValue(
                  "attributes[avatarStyles][smallSquare]"
                )}
                value={getModelValue("attributes[avatar]")}
                placeholder="cover"
                accepts="images"
                label={t("projects.thumbnail.custom_thumbnail")}
                labelClass="screen-reader-text"
                isBuilder
              />
            </div>
          </div>
        </div>
      </Form.Errorable>
      {image && (
        <Form.TextInput
          label={t("projects.thumbnail.alt_label")}
          name="attributes[avatarAltText]"
        />
      )}
    </>
  );
}

AvatarBuilder.displayName = "Project.Form.AvatarBuilder";
