import React, { Component } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import Body from "./Body";
import Annotation from "reader/containers/annotation";
import locationHelper from "helpers/location";
import filterAnnotations from "./helpers/filter-annotations";

import HtmlClass from "hoc/HtmlClass";

export default class Text extends Component {
  static filterAnnotations(visibilityFilters, annotations) {
    return filterAnnotations(annotations, visibilityFilters);
  }

  static propTypes = {
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

  constructor(props) {
    super(props);
    this.state = {
      visibilityFiltersMemo: props.visibility.visibilityFilters,
      annotationsMemo: props.annotations,
      filteredAnnotations: Text.filterAnnotations(
        props.visibility.visibilityFilters,
        props.annotations
      )
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.visibility.visibilityFilters !== state.visibilityFiltersMemo ||
      props.annotations !== state.annotationsMemo
    ) {
      return {
        filteredAnnotations: Text.filterAnnotations(
          props.visibility.visibilityFilters,
          props.annotations
        ),
        annotationMemo: props.annotations,
        visibilityFiltersMemo: props.visibility.visibilityFilters
      };
    }
    return null;
  }

  componentDidMount() {
    const el = document.getElementById("text-section-interactive-region");

    if (el && this.props.location.state?.pageChange) {
      el.focus();
    }
  }

  componentDidUpdate() {
    this.checkRequestAnnotationHash();

    const el = document.getElementById("text-section-interactive-region");

    if (el && this.props.location.state?.pageChange) {
      el.focus();
    }
  }

  // If the URL points to annotation that's not currently visible (not in
  // filteredAnnotations), but is in the unfiltered collection, then we can remove
  // it from the URL because the user has filtered it off the screen for now.
  checkRequestAnnotationHash() {
    if (!Array.isArray(this.state.filteredAnnotations)) return;
    if (this.state.filteredAnnotations.length === 0) return;
    if (!locationHelper.hashed(location)) return;
    if (!locationHelper.hashTypeMatch(location, "annotation")) return;
    const hashId = locationHelper.hashId(location, "annotation");
    const finder = a => a.id === hashId;
    const filteredMatch = this.state.filteredAnnotations.find(finder);
    if (filteredMatch) return;
    const collectionMatch = this.props.annotations.find(finder);
    if (!collectionMatch) return;
    this.props.history.push({ hash: "", state: { noScroll: true } });
  }

  render() {
    const typography = this.props.appearance.typography;
    const colorScheme = this.props.appearance.colors.colorScheme;

    const readerAppearanceClass = classNames({
      "reader-window": true,
      "scheme-light": colorScheme === "light",
      "scheme-dark": colorScheme === "dark"
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

    // eslint-disable-next-line no-unused-vars
    const section = this.props.section;

    // Page used to generate key for transitions
    const page = this.props.location.pathname.substr(1);

    let notations = this.props.resources;
    if (notations && this.props.resourceCollections) {
      notations = notations.concat(this.props.resourceCollections);
    }

    return (
      <HtmlClass className={fontSizeClass}>
        <div className="main-content" style={{ flexGrow: 1 }}>
          <section className={readerAppearanceClass}>
            <Annotation.Annotatable
              currentUser={this.props.authentication.currentUser}
              projectId={this.props.text.relationships.project.id}
              textId={this.props.text.id}
              sectionId={this.props.match.params.sectionId}
              notations={notations}
              annotations={this.state.filteredAnnotations}
              containerSize={typography.margins.current}
              bodySelector='[data-id="body"]'
              text={this.props.text}
              location={this.props.location}
              history={this.props.history}
              section={this.props.section}
              render={(pendingAnnotation, adjustedAnnotations) => (
                <div className={containerClass}>
                  <div
                    data-id="body"
                    id="manifold-text-section"
                    className={textSectionClass}
                  >
                    <Body
                      location={this.props.location}
                      pendingAnnotation={pendingAnnotation}
                      annotations={adjustedAnnotations}
                      section={this.props.section}
                    />
                  </div>
                </div>
              )}
            />
          </section>
          {/* eslint-disable no-unused-vars */}
          <CSSTransition
            appear
            classNames="text-child"
            timeout={{ enter: 500, exit: 500 }}
            unmountOnExit
          >
            {state => React.cloneElement(this.props.children, { key: page })}
          </CSSTransition>
          {/* eslint-enable no-unused-vars */}
        </div>
      </HtmlClass>
    );
  }
}
