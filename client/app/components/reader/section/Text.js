import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router";
import classNames from "classnames";
import Body from "./Body";
import Annotatable from "components/reader/Annotatable";
import lh from "helpers/location";
import filterAnnotations from "./helpers/filter-annotations";
import { useHtmlClass } from "hooks";
import { isEqual } from "lodash-es";
import { ReaderContext } from "app/contexts";

export default function Text({ text, section, annotations }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { visibilityFilters, typography, colors } = useContext(ReaderContext);

  const [filteredAnnotations, setFilteredAnnotations] = useState(
    filterAnnotations(annotations, visibilityFilters)
  );

  useEffect(() => {
    const newState = filterAnnotations(annotations, visibilityFilters);

    if (!isEqual(newState, filteredAnnotations))
      setFilteredAnnotations(newState);
  }, [filteredAnnotations, annotations, visibilityFilters]);

  useEffect(() => {
    const el = document.getElementById("text-section-interactive-region");

    if (el && location.state?.pageChange) {
      el.focus();
    }
  }, [location]);

  // If the URL points to annotation that's not currently visible (not in
  // filteredAnnotations), but is in the unfiltered collection, then we can remove
  // it from the URL because the user has filtered it off the screen for now.
  useEffect(() => {
    if (!filteredAnnotations?.length) return;
    if (!lh.hashed(location)) return;
    if (!lh.hashTypeMatch(location, "annotation")) return;

    const match = filteredAnnotations.find(
      a => a.id === lh.hashId(location, "annotation")
    );
    if (match) return;

    const hiddenMatch = annotations.find(
      a => a.id === lh.hashId(location, "annotation")
    );
    if (!hiddenMatch) return;

    navigate({ hash: "" }, { replace: true, state: { noScroll: true } });
  }, [navigate, filteredAnnotations, annotations, location]);

  const colorScheme = colors?.colorScheme;
  const highContrast = colors?.highContrast;

  const readerAppearanceClass = classNames({
    "reader-window": true,
    "scheme-light": colorScheme === "light",
    "scheme-dark": colorScheme === "dark",
    "high-contrast": highContrast
  });

  // Font selection may be handled differently later, but for now, variants are based
  // on class names
  let textSectionClass = classNames({
    "manifold-text-section text-section": true,
    "font-serif": typography?.font === "serif",
    "font-sans-serif": typography?.font === "sans-serif"
  });

  // Apply a font-size class to the text-section
  // This maps to a numbered class with responsive font declarations
  const fontSizeClass = `font-size-${typography?.fontSize?.current}`;
  textSectionClass += " " + fontSizeClass;

  // Apply a conditional container class that maps to a size in CSS
  const containerClass = `container-focus container-width-${typography?.margins?.current}`;

  useHtmlClass(fontSizeClass);

  return (
    <div className="main-content" style={{ flexGrow: 1 }}>
      <section className={readerAppearanceClass}>
        <Annotatable
          text={text}
          section={section}
          annotations={filteredAnnotations}
          render={(
            pendingAnnotation,
            adjustedAnnotations,
            destroyAnnotation
          ) => (
            <div className={containerClass}>
              <div
                data-id="body"
                id="manifold-text-section"
                className={textSectionClass}
              >
                <Body
                  location={location}
                  pendingAnnotation={pendingAnnotation}
                  annotations={adjustedAnnotations}
                  section={section}
                  destroyAnnotation={destroyAnnotation}
                />
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
}

Text.propTypes = {
  text: PropTypes.object,
  section: PropTypes.object,
  annotations: PropTypes.array
};
