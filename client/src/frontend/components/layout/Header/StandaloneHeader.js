import {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback
} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import { useDispatch } from "react-redux";
import { commonActions } from "actions/helpers";
import Navigation from "global/components/navigation";
import HeaderNotifications from "global/components/HeaderNotifications";
import { FrontendModeContext } from "helpers/contexts";
import { throttle } from "lodash";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import { useFromStore } from "hooks";

const BREAKPOINT = 620;

const getScrollTop = () => {
  if (window.pageYOffset !== undefined) {
    return window.pageYOffset;
  }
  return (document.documentElement || document.body.parentNode || document.body)
    .scrollTop;
};

export default function StandaloneHeader({ settings, alwaysVisible = false }) {
  const dispatch = useDispatch();
  const context = useContext(FrontendModeContext);
  const authentication = useFromStore({ path: "authentication" });
  const visibility = useFromStore({ path: "ui.transitory.visibility" });

  const shimRef = useRef(null);
  const fixedRef = useRef(null);
  const resizeIdRef = useRef(null);

  const [sticky, setSticky] = useState(false);
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : false
  );

  const commonActionsMemo = useMemo(() => commonActions(dispatch), [dispatch]);

  const darkMode = useMemo(() => context?.project?.darkMode, [
    context?.project?.darkMode
  ]);

  const alwaysVisibleComputed = useMemo(() => {
    if (!context?.isProjectHomepage) return true;
    return alwaysVisible;
  }, [context?.isProjectHomepage, alwaysVisible]);

  const lightTheme = useMemo(() => {
    if (alwaysVisibleComputed && !darkMode) return true;
    if (!darkMode) return true;
    return false;
  }, [alwaysVisibleComputed, darkMode]);

  const title = useMemo(() => context?.project?.titleFormatted, [
    context?.project?.titleFormatted
  ]);

  const subtitle = useMemo(() => context?.project?.subtitleFormatted, [
    context?.project?.subtitleFormatted
  ]);

  const projectSlug = useMemo(() => context?.project?.slug, [
    context?.project?.slug
  ]);

  const projectUrl = useMemo(() => {
    if (!projectSlug) return null;
    return lh.link("frontendProjectDetail", projectSlug);
  }, [projectSlug]);

  const directionRef = useRef("down");
  const logRef = useRef(null);
  const scrollRef = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScroll = getScrollTop();
    const newDirection = currentScroll > scrollRef.current ? "down" : "up";
    let newLog = logRef.current;
    if (directionRef.current !== newDirection) {
      newLog = currentScroll;
    }
    const newSticky = currentScroll > 50;

    directionRef.current = newDirection;
    logRef.current = newLog;
    scrollRef.current = currentScroll;

    setSticky(newSticky);
  }, []);

  const throttledScroll = useMemo(
    () =>
      throttle(handleScroll, 250, {
        leading: true,
        trailing: true
      }),
    [handleScroll]
  );

  const handleResize = useCallback(() => {
    if (!context?.isProjectHomepage) return null;

    if (resizeIdRef.current) {
      window.cancelAnimationFrame(resizeIdRef.current);
    }

    resizeIdRef.current = window.requestAnimationFrame(() => {
      setMobile(window.innerWidth <= BREAKPOINT);
    });
  }, [context?.isProjectHomepage]);

  const setShimHeight = useCallback(() => {
    if (!fixedRef.current || !shimRef.current) return;
    const fixedHeight = fixedRef.current.offsetHeight;
    shimRef.current.style.height = `${fixedHeight}px`;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", throttledScroll);
    window.addEventListener("resize", handleResize);
    setShimHeight();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [throttledScroll, handleResize, setShimHeight]);

  useEffect(() => {
    setShimHeight();
  });

  const visible = (sticky && !alwaysVisibleComputed) || mobile;
  const hidden = !sticky && !alwaysVisibleComputed && !mobile;

  const wrapperClasses = classNames({
    "standalone-header": true,
    "standalone-header--visible": visible,
    "standalone-header--hidden": hidden,
    "standalone-header--light": lightTheme,
    "standalone-header--dark": !lightTheme
  });

  const innerClasses = classNames({
    "standalone-header__inner": true
  });

  const headingClasses = classNames({
    "standalone-header__header": true
  });

  const offset = get(settings, "attributes.theme.headerOffset");
  const navStyle = offset
    ? { position: "relative", top: parseInt(offset, 10) }
    : {};

  if (!projectUrl) return null;

  return (
    <>
      <div className={wrapperClasses}>
        <SetCSSProperty
          measurement="height"
          propertyName="--standalone-header-height"
        >
          <div className={innerClasses} ref={fixedRef}>
            <div className={headingClasses} aria-hidden={hidden}>
              <Link to={projectUrl} className="standalone-header__title-link">
                {title && (
                  <div
                    className="standalone-header__title"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                )}
                {subtitle && (
                  <div
                    className="standalone-header__subtitle"
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                  />
                )}
              </Link>
            </div>
            <Navigation.Primary
              desktopStyle={navStyle}
              commonActions={commonActionsMemo}
              authentication={authentication}
              visibility={visibility}
              mode="frontend"
              standaloneMode
              darkTheme={!lightTheme}
            />
          </div>
        </SetCSSProperty>
      </div>
      {alwaysVisibleComputed && (
        <div className="standalone-header__shim" ref={shimRef} />
      )}
      <HeaderNotifications scope="global" />
    </>
  );
}

StandaloneHeader.displayName = "Layout.StandaloneHeader";

StandaloneHeader.propTypes = {
  settings: PropTypes.object,
  alwaysVisible: PropTypes.bool
};
