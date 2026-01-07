import { useState, useRef, useEffect, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { uiReadingGroupActions } from "actions";
import IconComposer from "global/components/utility/IconComposer";
import classNames from "classnames";
import RGMenuItem from "reader/components/annotation/popup/parts/RGMenuItem";

export default function ReadingGroupPicker({
  adjustedReadingGroups = [],
  currentGroupId,
  currentGroupData,
  canEngagePublicly,
  canAccessReadingGroups
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const pickerToggleRef = useRef(null);
  const pickerId = useId();

  const publicLabel = t("navigation.reading_group.my_public_annotations");
  const privateLabel = t("navigation.reading_group.my_private_annotations");

  /* eslint-disable no-nested-ternary */
  const currentGroupName =
    currentGroupId === "public"
      ? publicLabel
      : currentGroupId === "private"
      ? privateLabel
      : currentGroupData?.attributes.name || privateLabel;
  /* eslint-enable no-nested-ternary */

  useEffect(() => {
    const handleClick = event => {
      if (
        !pickerRef.current ||
        pickerRef.current.contains(event.target) ||
        pickerToggleRef.current?.contains(event.target) ||
        !pickerOpen
      )
        return;
      setPickerOpen(false);
    };

    document.addEventListener("mouseup", handleClick, false);
    return () => {
      document.removeEventListener("mouseup", handleClick, false);
    };
  }, [pickerOpen]);

  const setReadingGroup = id => {
    setPickerOpen(false);
    dispatch(uiReadingGroupActions.setAnnotatingReadingGroup(id));
  };

  const isSelected = option => option === currentGroupId;

  const isPrivateGroup = privacy =>
    privacy === "private" || privacy === "anonymous";

  return (
    <div className="annotation-editor__action">
      <div className="annotation-editor__action-label">
        <IconComposer
          icon="readingGroup24"
          size="default"
          className="annotation-editor__action-icon"
        />
        <span id={`${pickerId}-label`}>
          {canAccessReadingGroups
            ? `${t("glossary.reading_group_one")}:`
            : `${t("common.visibility")}`}
        </span>
      </div>
      <select
        aria-labelledby={`${pickerId}-label`}
        className="annotation-editor__group-select"
        onChange={event => setReadingGroup(event.target.value)}
        value={currentGroupId}
      >
        {canEngagePublicly && <option value="public">{publicLabel}</option>}
        <option value="private">{privateLabel}</option>
        {adjustedReadingGroups.length > 0 &&
          adjustedReadingGroups.map(option => (
            <option key={option.id} value={option.id}>
              {option.attributes.name}
            </option>
          ))}
      </select>
      <div className="annotation-editor__group-picker" aria-hidden>
        <button
          ref={pickerToggleRef}
          tabIndex={-1}
          type="button"
          onClick={() => setPickerOpen(!pickerOpen)}
          className="annotation-editor__group-picker-toggle"
        >
          <span className="annotation-editor__group-picker-toggle-text">
            {currentGroupName}
          </span>
          <IconComposer icon="disclosureDown16" size={22} />
        </button>
        <div
          ref={pickerRef}
          tabIndex="-1"
          className={classNames({
            "annotation-group-options": true,
            "annotation-group-options--hidden": !pickerOpen
          })}
        >
          <div className="annotation-group-options__list">
            {canEngagePublicly && (
              <RGMenuItem
                label={publicLabel}
                onClick={() => setReadingGroup("public")}
                selected={isSelected("public")}
              />
            )}
            <RGMenuItem
              label={privateLabel}
              onClick={() => setReadingGroup("private")}
              privateGroup
              selected={isSelected("private")}
            />
            {adjustedReadingGroups.length > 0 &&
              adjustedReadingGroups.map(rg => (
                <RGMenuItem
                  key={rg.id}
                  label={rg.attributes.name}
                  onClick={() => setReadingGroup(rg.id)}
                  privateGroup={isPrivateGroup(rg.attributes.privacy)}
                  selected={isSelected(rg.id)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ReadingGroupPicker.propTypes = {
  adjustedReadingGroups: PropTypes.array,
  currentGroupId: PropTypes.string,
  currentGroupData: PropTypes.object,
  canEngagePublicly: PropTypes.bool,
  canAccessReadingGroups: PropTypes.bool
};
