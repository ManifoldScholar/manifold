import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import format from "date-fns/format";
import * as Styled from "./styles";

export default function DatePickerHeader({
  date,
  increaseMonth,
  decreaseMonth,
  uid
}) {
  const { t } = useTranslation();

  return (
    <Styled.Header>
      <Styled.Next type="button" onClick={increaseMonth}>
        <IconComposer icon="arrowRight16" size={20} />
      </Styled.Next>
      <Styled.Prev type="button" onClick={decreaseMonth}>
        <IconComposer icon="arrowLeft16" size={20} />
      </Styled.Prev>
      <Styled.Month id={`range-picker-dialog-label-${uid}`}>
        {format(date, "MMMM yyyy", {
          locale: t("date_fns", { returnObjects: true })
        })}
      </Styled.Month>
    </Styled.Header>
  );
}

DatePickerHeader.displayName = "Form.DatePicker.Header";

DatePickerHeader.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  decreaseMonth: PropTypes.func.isRequired,
  increaseMonth: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired
};
