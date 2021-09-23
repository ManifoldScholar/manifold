import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import ReactDatePicker from "react-datepicker";
import MaskedInput from "react-text-mask";
import Header from "./Header";
import Utility from "global/components/utility";

function DatePickerComponent({ parentId, inputId, value, onChange, label }) {
  const [pickerOpen, setPickerOpen] = useState(false);

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
          <Utility.IconComposer
            icon="calendar24"
            size="default"
            iconClass="range-picker__calendar-icon"
          />
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
            type="button"
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
        dateFormat="MM/dd/yyyy"
        popperContainer={({ children, className }) => (
          <div aria-hidden className={className}>
            {children}
          </div>
        )}
      />
    </>
  );
}

DatePickerComponent.displayName = "Global.Form.DatePicker.PickerComponent";

DatePickerComponent.propTypes = {
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  inputId: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default DatePickerComponent;
