import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function BlocklistOption({ onChange }) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const handleChange = value => {
    setChecked(value);
    onChange(value);
  };

  return (
    <Styled.Switch
      wide
      label={t("settings.lti.registrations.blocklist_option")}
      value={checked}
      set={handleChange}
    />
  );
}

BlocklistOption.displayName = "Settings.Lti.Registrations.BlocklistOption";

BlocklistOption.propTypes = {
  onChange: PropTypes.func.isRequired
};
