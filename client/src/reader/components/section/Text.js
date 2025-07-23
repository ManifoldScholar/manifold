import { Children, cloneElement, useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Body from "./Body";
import Annotatable from "reader/containers/Annotatable";
import lh from "helpers/location";
import filterAnnotations from "./helpers/filter-annotations";
import HtmlClass from "hoc/HtmlClass";
import isEqual from "lodash/isEqual";
import useDialog from "@castiron/hooks/useDialog";

export default function Text({
  children,
  appearance,
  text,
  authentication,
  location,
  history,
  section,
  resources,
  resourceCollections,
  annotations,
  visibility
}) {
  const [filteredAnnotations, setFilteredAnnotations] = useState(
    filterAnnotations(annotations, visibility.visibilityFilters)
  );

  useEffect(() => {
    const newState = filterAnnotations(
      annotations,
      visibility.visibilityFilters
    );

    if (!isEqual(newState, filteredAnnotations))
      setFilteredAnnotations(newState);
  }, [filteredAnnotations, annotations, visibility.visibilityFilters]);

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

    history.replace({ hash: "", state: { noScroll: true } });
  }, [history, filteredAnnotations, annotations, location]);

  const resourceDisplayFormatDialog = useDialog({
    modal: true,
    scrollLockClassName: "no-scroll"
  });

  const typography = appearance.typography;
  const colorScheme = appearance.colors.colorScheme;
  const highContrast = appearance.colors.highContrast;

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
    "font-serif": typography.font === "serif",
    "font-sans-serif": typography.font === "sans-serif"
  });

  // Apply a font-size class to the text-section
  // This maps to a numbered class with responsive font declarations
  const fontSizeClass = `font-size-${typography.fontSize.current}`;
  textSectionClass += " " + fontSizeClass;

  // Apply a conditional container class that maps to a size in CSS
  const containerClass = `container-focus container-width-${typography.margins.current}`;

  // Page used to generate key for transitions
  const page = location.pathname.substr(1);

  return (
    <HtmlClass className={fontSizeClass}>
      <div className="main-content" style={{ flexGrow: 1 }}>
        <section className={readerAppearanceClass}>
          <Annotatable
            currentUser={authentication.currentUser}
            projectId={text.relationships.project.id}
            textId={text.id}
            sectionId={section.id}
            notations={[...(resources ?? []), ...(resourceCollections ?? [])]}
            annotations={filteredAnnotations}
            containerSize={typography.margins.current}
            bodySelector='[data-id="body"]'
            text={text}
            location={location}
            history={history}
            section={section}
            resourceDisplayFormatDialog={resourceDisplayFormatDialog}
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
        {Children.count(children) > 0 && cloneElement(children, { key: page })}
      </div>
    </HtmlClass>
  );
}

Text.propTypes = {
  text: PropTypes.object,
  authentication: PropTypes.object,
  section: PropTypes.object,
  resources: PropTypes.array,
  resourceCollections: PropTypes.array,
  annotations: PropTypes.array,
  appearance: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  children: PropTypes.object,
  visibility: PropTypes.object,
  history: PropTypes.object.isRequired
};
