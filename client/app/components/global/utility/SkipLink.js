import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";

function SkipLink(props, ref) {
  const { t } = useTranslation();
  return (
    <a ref={ref} className="skip-to-main" href="#skip-to-main">
      {t("navigation.skip_to_main")}
    </a>
  );
}

export default forwardRef(SkipLink);
