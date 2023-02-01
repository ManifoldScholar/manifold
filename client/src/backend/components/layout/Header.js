import React from "react";
import PropTypes from "prop-types";
import Navigation from "global/components/navigation";
import PressLogo from "global/components/PressLogo";
import HeaderNotifications from "global/components/HeaderNotifications";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Utility from "global/components/utility";
import HeaderLogo from "global/components/atomic/HeaderLogo";
import { useTranslation } from "react-i18next";

export default function LayoutHeader({
  commonActions,
  authentication,
  visibility
}) {
  const { t } = useTranslation();

  const links = navigation.backend();

  return (
    <header className="header-app header-app--sticky">
      <Utility.SetCSSProperty
        measurement="height"
        propertyName="--library-header-height"
      >
        <div className="library-header library-header--dark">
          <div className="library-header__inner">
            <HeaderLogo as="Link" to={lh.link("backend")}>
              <span className="screen-reader-text">
                {t("navigation.return_home")}
              </span>
              <PressLogo aria-hidden="true" />
            </HeaderLogo>
            <Navigation.Primary
              links={links}
              commonActions={commonActions}
              authentication={authentication}
              visibility={visibility}
              mode="backend"
              darkTheme
            />
          </div>
        </div>
        <div className="header-border" />
      </Utility.SetCSSProperty>
      <HeaderNotifications scope="global" />
    </header>
  );
}

LayoutHeader.displayName = "Layout.Header";

LayoutHeader.propTypes = {
  visibility: PropTypes.object,
  authentication: PropTypes.object,
  commonActions: PropTypes.object
};
