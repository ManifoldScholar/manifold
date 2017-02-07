import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import smoothScroll from '../../../utils/smoothScroll';
import Body from './Body';
import Label from './Label';
import Pagination from './Pagination';
import Annotatable from '../Annotatable';
import BodyNodes from './BodyNodes';
import ResourceViewer from './ResourceViewer';
import has from 'lodash/has';

class Section extends Component {

  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    resources: PropTypes.array,
    annotations: PropTypes.array,
    appearance: PropTypes.object,
    location: PropTypes.object,
    createAnnotation: PropTypes.func,
    params: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lockedSelection: null,
      updates: 0
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

  maybeScrollToTop(previousSection, thisSection) {
    if (previousSection.id === thisSection.id) return;
    window.scrollTo(0, 0);
  }

  // TODO: My sense is that this method is not working very well. It may need to be
  // revisited.
  maybeScrollToAnchor(previousHash, currentHash) {
    if (currentHash && previousHash !== currentHash) {
      const scrollTarget = document.querySelector(currentHash);
      if (!scrollTarget) return false;
      const position = scrollTarget.getBoundingClientRect().top + window.pageYOffset;
      setTimeout(() => {
        smoothScroll(position - 125);
      }, 0);
    }
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

  // Store the current locked selection in the section, which wrapps the annotator and
  // the body. This locked selectino is then passed down to the body, which needs to
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

    return (
      <div>
        <section className={readerAppearanceClass}>
          {this.props.resources ?
            <ResourceViewer.Wrapper
              updates={this.state.updates}
              resources={this.props.resources}
              annotations={this.props.annotations}
              containerSize={typography.margins.current}
              body={this.body}
            /> : null
          }
          <Annotatable
            projectId={this.props.text.relationships.project.id}
            sectionId={this.props.params.sectionId}
            createAnnotation={this.props.createAnnotation}
            lockSelection={this.lockSelection}
          >
            <div className={containerClass}>
              <div className={textSectionClass} >
                <div ref={(b) => { this.body = b; }}>
                  <Body
                    didUpdateCallback={this.recordBodyDomUpdate}
                    lockedSelection={this.state.lockedSelection}
                    annotations={this.props.annotations}
                    section={this.props.section}
                  />
                </div>
              </div>
            </div>
          </Annotatable>
        </section>
      </div>
    );
  }
}

Section.Body = Body;
Section.BodyNodes = BodyNodes;
Section.Label = Label;
Section.Pagination = Pagination;
export default Section;
