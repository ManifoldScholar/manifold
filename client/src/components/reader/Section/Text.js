import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import smoothScroll from '../../../utils/smoothScroll';
import { Resource, Section } from 'components/reader';
import { Annotation } from 'containers/reader';
import has from 'lodash/has';

export default class Text extends Component {

  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    resources: PropTypes.array,
    annotations: PropTypes.array,
    appearance: PropTypes.object,
    location: PropTypes.object,
    createAnnotation: PropTypes.func,
    authentication: PropTypes.object,
    params: PropTypes.object,
    children: PropTypes.object,
    dispatch: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lockedSelection: null,
    };
    this.lockSelection = this.lockSelection.bind(this);
    this.recordBodyDomUpdate = this.recordBodyDomUpdate.bind(this);
  }

  componentDidMount() {
    this.maybeScrollToAnchor(null, this.props.location.hash);
    this.recordBodyDomUpdate();
  }

  componentDidUpdate(prevProps) {
    this.maybeScrollToTop(prevProps.section, this.props.section);
    this.maybeScrollToAnchor(prevProps.location.hash, this.props.location.hash);
  }

  // We need a callback from the body to let us know when it updates. We can then pass
  // that information down to the Resource viewer, which absolutely has to look at the
  // body's rendered DOM in order to determine the position of each marker.
  //
  // At some future point, we may want to refactor this a bit. It might make sense, for
  // example, to have the section pass a callback down to the markers, which can trigger
  // it and report their position when they are rendered. That would help avoid the
  // cross cutting inspection that the resource viewer wrapper is currently doing.
  recordBodyDomUpdate() {
    this.setState({ updates: this.state.updates + 1 });
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

  maybeScrollToTop(previousSection, thisSection) {
    if (previousSection.id === thisSection.id) return;
    window.scrollTo(0, 0);
  }

  // TODO: My sense is that this method is not working very well. It may need to be
  // revisited.
  maybeScrollToAnchor(previousHash, currentHash) {
    if (!currentHash) return;
    if (previousHash === currentHash) return;
    const scrollTarget = document.querySelector(currentHash);
    if (!scrollTarget) return false;
    const position = scrollTarget.getBoundingClientRect().top + window.pageYOffset;
    setTimeout(() => {
      smoothScroll(position - 125);
    }, 0);
  }

  render() {
    const typography = this.props.appearance.typography;
    const colorScheme = this.props.appearance.colors.colorScheme;

    const readerAppearanceClass = classNames({
      'reader-window': true,
      'scheme-light': colorScheme === 'light',
      'scheme-dark': colorScheme === 'dark'
    });

    // Font selection may be handled differently later, but for now, variants are based
    // on class names
    let textSectionClass = classNames({
      'manifold-text-section text-section': true,
      'font-serif': typography.font === 'serif',
      'font-sans-serif': typography.font === 'sans-serif'
    });

    // Apply a font-size class to the text-section
    // This maps to a numbered class with responsive font declarations
    textSectionClass = textSectionClass + ` font-size-${typography.fontSize.current}`;

    // Apply a conditional container class that maps to a size in CSS
    const containerClass = `container-focus container-width-${typography.margins.current}`;

    const section = this.props.section;

    // Page used to generate key for transitions
    const page = this.props.location.pathname.substr(1);

    return (
      <div>
        <section className={readerAppearanceClass}>
          <Annotation.Annotatable
            currentUser={this.props.authentication.currentUser}
            textId={this.props.params.textId}
            projectId={this.props.text.relationships.project.id}
            sectionId={this.props.params.sectionId}
            lockSelection={this.lockSelection}
            resources={this.props.resources}
            annotations={this.props.annotations}
            containerSize={typography.margins.current}
            fontSize={typography.fontSize.current}
            body={this.body}
          >
            <div className={containerClass}>
              <div className={textSectionClass} >
                <div ref={(b) => { this.body = b; }}>
                  <Section.Body
                    didUpdateCallback={this.recordBodyDomUpdate}
                    lockedSelection={this.state.lockedSelection}
                    annotations={this.props.annotations}
                    section={this.props.section}
                  />
                </div>
              </div>
            </div>
          </Annotation.Annotatable>
        </section>
          <ReactCSSTransitionGroup
            transitionName="text-child"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            {this.props.children ? React.cloneElement(this.props.children, { key: page }) : null}
          </ReactCSSTransitionGroup>
      </div>
    );
  }
}
