import { useCallback, useMemo, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFormField } from "hooks";
import Errorable from "global/components/form/Errorable";
import PickerComponent from "./PickerComponent";
import isDate from "lodash/isDate";
import { format } from "date-fns/format";
import Instructions from "../Instructions";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";

function DatePicker({
  name,
  label,
  setFormat = "yyyy-MM-dd",
  wide,
  instructions,
  setScreenReaderStatus
}) {
  const id = useId();
  const { t } = useTranslation();
  const { value: rawValue, set, errors } = useFormField(name);

  // The API returns values in UTC, but JS tries to render dates in the user's local
  // timezone. The DatePicker library requires an actual Date object, so we can't just
  // send a UTC string. This function essentially resets the date based on the offset of
  // the user's local timezone.
  const dateUTC = useCallback(date => {
    const adjusted = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(adjusted);
  }, []);

  const value = useMemo(() => {
    if (!rawValue) return null;
    const date = isDate(rawValue) ? rawValue : new Date(rawValue);
    return dateUTC(date);
  }, [rawValue, dateUTC]);

  const handleChange = useCallback(
    date => {
      set(date ? format(date, setFormat) : null);
      setScreenReaderStatus(
        date
          ? t("forms.date_picker.date_change_sr_status", {
              date: format(date, "PPP")
            })
          : t("forms.date_picker.date_clear_sr_status")
      );
    },
    [set, setFormat, setScreenReaderStatus, t]
  );

  return (
    <Errorable
      className={wide ? "wide" : undefined}
      name={name}
      errors={errors}
      label={label}
      idForError={`date-picker-error-${id}`}
    >
      <PickerComponent
        parentId={id}
        inputId={`range-picker-${id}-start-date`}
        value={value}
        onChange={handleChange}
        label={label}
      />
      {instructions && <Instructions instructions={instructions} />}
    </Errorable>
  );
}

DatePicker.displayName = "Form.DatePicker";

DatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  setFormat: PropTypes.string,
  wide: PropTypes.bool,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setScreenReaderStatus: PropTypes.func
};

export default withScreenReaderStatus(DatePicker);
