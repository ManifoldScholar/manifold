import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "components/global";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import classNames from "classnames";
import { Section } from "components/reader";
import Annotation from "containers/reader/Annotation";
import locationHelper from "helpers/location";

export default class Text extends Component {
  static propTypes = {
    text: PropTypes.object,
    authentication: PropTypes.object,
    section: PropTypes.object,
    resources: PropTypes.array,
    collections: PropTypes.array,
    annotations: PropTypes.array,
    appearance: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    children: PropTypes.object,
    visibility: PropTypes.object,
    history: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lockedSelection: null,
      filteredAnnotations: this.filterAnnotations(
        props.visibility.annotation,
        props.annotations,
        props.authentication.currentUser
      )
    };
    this.lockSelection = this.lockSelection.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.visibility.visibilityFilters !==
        this.props.visibility.visibilityFilters ||
      nextProps.annotations !== this.props.annotations
    ) {
      const filteredAnnotations = this.filterAnnotations(
        nextProps.visibility.visibilityFilters,
        nextProps.annotations,
        this.props.authentication.currentUser
      );
      this.setState({ filteredAnnotations });
    }
  }

  componentDidUpdate() {
    this.checkRequestAnnotationHash();
  }

  // If the URL points to annotation that's not currently visible (not in
  // filteredAnnotations), but is in the unfiltered collection, then we can remove
  // it from the URL because the user has filtered it off the screen for now.
  checkRequestAnnotationHash() {
    if (!this.state.filteredAnnotations) return;
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

  // Store the current locked selection in the section, which wraps the annotator and
  // the body. This locked selection is then passed down to the body, which needs to
  // render it in the text.
  lockSelection(raw) {
    if (!raw) return this.setState({ lockedSelection: null });
    const lockedSelection = {
      id: "selection",
      attributes: raw,
      type: "annotations"
    };
    this.setState({ lockedSelection });
  }

  filterAnnotations(visibilityFilters, annotations, currentUserIgnored) {
    if (!visibilityFilters) return annotations;

    const filterEntity = (list, format) => {
      return this.filterBy(list, visibilityFilters, format);
    };

    return Object.keys(visibilityFilters).reduce(filterEntity, annotations);
  }

  filterBy(list, visibilityFilters, format) {
    const filter = visibilityFilters[format];
    let filtered = list;

    Object.keys(filter).forEach(key => {
      switch (key) {
        case "all": {
          if (filter[key] === true) return filtered;
          return (filtered = filtered.filter(a => {
            return a.attributes.format !== format;
          }));
        }
        default: {
          if (filter[key] === true) return filtered;
          const value = key === "yours" ? filter[key] : !filter[key];
          return (filtered = filtered.filter(a => {
            return (
              a.attributes.format !== format ||
              a.attributes.abilities.creator === value
            );
          }));
        }
      }
    });

    return filtered;
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
    const containerClass = `container-focus container-width-${typography.margins
      .current}`;

    const section = this.props.section;

    // Page used to generate key for transitions
    const page = this.props.location.pathname.substr(1);

    let notations = this.props.resources;
    if (notations && this.props.collections) {
      notations = notations.concat(this.props.collections);
    }

    return (
      <HigherOrder.HtmlClass className={fontSizeClass}>
        <div
          ref={el => {
            this.el = el;
          }}
        >
          <section className={readerAppearanceClass}>
            <Annotation.Annotatable
              currentUser={this.props.authentication.currentUser}
              projectId={this.props.text.relationships.project.id}
              textId={this.props.text.id}
              sectionId={this.props.match.params.sectionId}
              lockSelection={this.lockSelection}
              notations={notations}
              annotations={this.state.filteredAnnotations}
              containerSize={typography.margins.current}
              bodySelector="[data-id=&quot;body&quot;]"
              text={this.props.text}
              location={this.props.location}
              history={this.props.history}
              section={this.props.section}
            >
              <div className={containerClass}>
                <div data-id="body" className={textSectionClass}>
                  <Section.Body
                    location={this.props.location}
                    lockedSelection={this.state.lockedSelection}
                    annotations={this.state.filteredAnnotations}
                    section={this.props.section}
                  />
                </div>
              </div>
            </Annotation.Annotatable>
          </section>
          <ReactCSSTransitionGroup
            transitionName="text-child"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            {this.props.children
              ? React.cloneElement(this.props.children, { key: page })
              : null}
          </ReactCSSTransitionGroup>
        </div>
      </HigherOrder.HtmlClass>
    );
  }
}
