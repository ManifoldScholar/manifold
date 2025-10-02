import { useFromStore } from "hooks";
import { useTranslation } from "react-i18next";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import PressLogo from "global/components/PressLogo";
import HeaderLogo from "global/components/atomic/HeaderLogo";
import IconComposer from "global/components/utility/IconComposer";

export default function HeaderPreview({
  accentColor,
  foregroundColor,
  backgroundColor,
  activeColor
}) {
  const { t } = useTranslation();
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const offset = settings.attributes.theme.headerOffset;
  const navStyle = offset
    ? { position: "relative", top: parseInt(offset, 10) }
    : {};

  return (
    <div
      className="library-header library-header--light"
      style={{
        "--color-accent-primary": accentColor,
        "--hover-color": accentColor,
        "--color-header-background": backgroundColor,
        "--color-header-foreground": foregroundColor,
        "--color-header-foreground-active": activeColor
      }}
    >
      <SetCSSProperty
        measurement="height"
        propertyName="--library-header-height"
      >
        <div className="library-header__inner-preview">
          <HeaderLogo as="span">
            <>
              <span className="screen-reader-text">
                {t("navigation.return_home")}
              </span>
              <PressLogo
                url={settings.attributes.pressLogoStyles.medium}
                styles={settings.attributes.theme.logoStyles}
                aria-hidden="true"
              />
            </>
          </HeaderLogo>
          <nav
            className="site-nav show-82"
            aria-label={t("navigation.primary")}
            style={navStyle}
          >
            <ul className="site-nav__list">
              <li className="site-nav__item">
                <a href="#" className="site-nav__link site-nav__link--active">
                  Home
                </a>
              </li>
              <li className="site-nav__item">
                <a href="#" className="site-nav__link">
                  Projects
                </a>
              </li>
              <li className="site-nav__item">
                <a href="#" className="site-nav__link">
                  Journals
                </a>
              </li>
              <li className="site-nav__item">
                <a href="#" className="site-nav__link">
                  Reading Groups
                </a>
              </li>
            </ul>
          </nav>
          <nav className="breadcrumb-list hide-82">
            <span>
              <a className="breadcrumb-list__link" href="#">
                Home
              </a>
            </span>
          </nav>
          <a href="#" className="mobile-nav-toggle hide-82">
            <IconComposer
              icon="menu32"
              size="default"
              className="mobile-nav-trigger__icon"
            />
          </a>
        </div>
      </SetCSSProperty>
    </div>
  );
}
