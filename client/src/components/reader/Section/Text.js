import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "components/global";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import classNames from "classnames";
import smoothScroll from "../../../utils/smoothScroll";
import { Section } from "components/reader";
import Annotation from "containers/reader/Annotation";

export default class Text extends Component {
  static propTypes = {
    text: PropTypes.object,
    authentication: PropTypes.object,
    section: PropTypes.object,
    resources: PropTypes.array,
    annotations: PropTypes.array,
    appearance: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    children: PropTypes.object,
    visibility: PropTypes.object
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

  componentDidMount() {
    this.maybeScrollToAnchor(null, this.props.location.hash);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.visibility.annotation !== this.props.visibility.annotation ||
      nextProps.annotations !== this.props.annotations
    ) {
      const filteredAnnotations = this.filterAnnotations(
        nextProps.visibility.annotation,
        nextProps.annotations,
        this.props.authentication.currentUser
      );
      this.setState({ filteredAnnotations });
    }
  }

  componentDidUpdate(prevProps) {
    this.maybeScrollToTop(prevProps.section, this.props.section);
    this.maybeScrollToAnchor(prevProps.location.hash, this.props.location.hash);
  }

  /* eslint-disable no-unreachable */
  getScrollTargetNode(hash) {
    const annotationUuid = new RegExp(
      /^#(annotation)-([a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12})/
    );
    const nodeHexidigest = new RegExp(/^#(node)-([a-f0-9]{40})/);
    const match = hash.match(annotationUuid) || hash.match(nodeHexidigest);
    const identifier = match ? match[1] : hash;
    const id = match ? match[2] : null;
    switch (identifier) {
      case "node": // Text Node
        return document.querySelector(`[data-node-uuid="${id}"]`);
        break;
      case "annotation": // Annotation, Highlight, or Resource
        return document.querySelector(`[data-annotation-ids="${id}"]`);
        break;
      default:
        return document.querySelector(identifier);
        break;
    }
  }
  /* eslint-enable no-unreachable */

  maybeScrollToTop(previousSection, thisSection) {
    if (previousSection.id === thisSection.id) return;
    window.scrollTo(0, 0);
  }

  maybeScrollToAnchor(previousHash, currentHash) {
    if (!currentHash) return;
    if (previousHash === currentHash) return;
    const scrollTarget = this.getScrollTargetNode(currentHash);
    if (!scrollTarget) return false;
    this.scrollToAnchor(scrollTarget);
  }

  scrollToAnchor(scrollTarget) {
    const position =
      scrollTarget.getBoundingClientRect().top + window.pageYOffset;
    setTimeout(() => {
      smoothScroll(position - 150);
    }, 0);
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

  filterAnnotations(visibility, annotations, currentUserIgnored) {
    if (visibility === 0) return [];
    if (visibility === 1) {
      return annotations.filter(a => {
        return (
          a.attributes.format === "resource" ||
          a.attributes.currentUserIsCreator === true
        );
      });
    }
    return annotations;
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

    return (
      <HigherOrder.HtmlClass className={fontSizeClass}>
        <div>
          <section className={readerAppearanceClass}>
            <Annotation.Annotatable
              currentUser={this.props.authentication.currentUser}
              projectId={this.props.text.relationships.project.id}
              textId={this.props.text.id}
              sectionId={this.props.match.params.sectionId}
              lockSelection={this.lockSelection}
              resources={this.props.resources}
              annotations={this.state.filteredAnnotations}
              containerSize={typography.margins.current}
              bodySelector="[data-id=&quot;body&quot;]"
              text={this.props.text}
              section={this.props.section}
            >
              <div className={containerClass}>
                <div data-id="body" className={textSectionClass}>
                  <Section.Body
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
