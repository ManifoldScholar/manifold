import { useId } from "react";
import { useTranslation } from "react-i18next";
import GlobalForm from "global/components/form";
import classNames from "classnames";
import IconComputed from "global/components/icon-computed";
import { useFormField } from "hooks";

export default function IconPicker() {
  const { t } = useTranslation();
  const id = useId();
  const { value: selected, set } = useFormField("attributes[icon]");

  const icons = [
    "book-stack-vertical",
    "lamp",
    "new-round",
    "books-on-shelf",
    "globe",
    "touch",
    "mug"
  ];

  const screenreader = icon => {
    switch (icon) {
      case "book-stack-vertical":
        return t("project_collections.book_stack_icon");
      case "lamp":
        return t("project_collections.lamp_icon");
      case "new-round":
        return t("project_collections.new_icon");
      case "books-on-shelf":
        return t("project_collections.book_shelf_icon");
      case "globe":
        return t("project_collections.globe_icon");
      case "touch":
        return t("project_collections.touch_icon");
      case "mug":
        return t("project_collections.mug_icon");
      default:
        return null;
    }
  };

  const handleIconChange = icon => set(icon);

  const maybeClear = icon => {
    if (selected === icon) {
      set(null);
      document.activeElement.blur();
    }
  };

  const renderIcon = icon => {
    const isSelected = selected === icon;
    const labelClasses = classNames({
      "icon-picker__item": true,
      "icon-picker__item--active": isSelected
    });
    return (
      <label key={icon} className={labelClasses}>
        <span className="screen-reader-text">{screenreader(icon)}</span>
        <input
          type="radio"
          value={icon}
          name={`icon-picker-${id}`}
          checked={isSelected}
          onClick={() => maybeClear(icon)}
          onChange={() => handleIconChange(icon)}
          className="icon-picker__input"
        />
        <IconComputed.ProjectCollection icon={icon} size={48} />
      </label>
    );
  };

  return (
    <div className="icon-picker">
      <GlobalForm.Errorable
        name="attributes[icon]"
        idForError={`icon-picker-${id}`}
      >
        <GlobalForm.Label
          htmlFor={`icon-picker-${id}`}
          label={t("project_collections.collection_icon")}
        />
        <div>
          <span className="screen-reader-text">
            {t("project_collections.collection_icon_instructions")}
          </span>
          <div
            role="group"
            id={`icon-picker-${id}`}
            className="icon-picker__list"
          >
            {icons.map(icon => renderIcon(icon))}
          </div>
        </div>
      </GlobalForm.Errorable>
    </div>
  );
}

IconPicker.displayName = "ProjectCollection.Form.IconPicker";
