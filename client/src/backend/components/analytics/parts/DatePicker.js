import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import MaskedInput from "react-text-mask";
import Header from "global/components/form/DatePicker/Header";
import Utility from "global/components/utility";

function DatePicker({ parentId, inputId, value, onChange, label }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const locale = t("date_fns", { returnObjects: true });
  registerLocale(i18n.language, locale);

  const placeholderChar = "\u005F";
  const mask = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];

  // Due to a11y issues with the date picker, we render this custom text input, which does a couple things:
  // * disables the default click handler on the input that would normally open the picker
  // * adds a button that opens or closes the picker based on state. this button is hidden from
  //   screen readers and not tabbable; we rely on the text input alone for SR users
  // * uses forwardRef to resolve warning thrown by ReactDatePicker trying to pass ref to functional component
  const CustomInput = forwardRef(
    ({ value: inputValue, onChange: onInputChange, onClick, onBlur }, ref) => (
      <div ref={ref} className="range-picker__date-input">
        <label htmlFor={inputId} className="range-picker__label">
          {label}
        </label>
        <div className="range-picker__input-wrapper">
          <MaskedInput
            id={inputId}
            value={inputValue}
            type="text"
            guide
            mask={mask}
            placeholder="mm/dd/yyyy"
            placeholderChar={placeholderChar}
            autoComplete="off"
            className="range-picker__input"
            onChange={onInputChange}
            onClick={() => {}}
          />
          <button
            onClick={() => {
              pickerOpen ? onBlur() : onClick();
            }}
            aria-hidden
            tabIndex={-1}
            className="range-picker__picker-toggle"
          >
            <Utility.IconComposer icon="disclosureDown32" size={32} />
          </button>
        </div>
      </div>
    )
  );

  return (
    <>
      <ReactDatePicker
        renderCustomHeader={props => <Header uid={parentId} {...props} />}
        selected={value}
        onChange={onChange}
        onCalendarOpen={() => setPickerOpen(true)}
        onCalendarClose={() => setPickerOpen(false)}
        customInput={<CustomInput />}
        dropdownMode="scroll"
        dateformat="P"
        locale={i18n.language}
        popperContainer={({ children, className }) => (
          <div aria-hidden className={className}>
            {children}
          </div>
        )}
      />
    </>
  );
}

DatePicker.displayName = "Analytics.RangePicker.DatePicker";

DatePicker.propTypes = {
  parentId: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default DatePicker;
