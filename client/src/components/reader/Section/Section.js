import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import smoothScroll from '../../../utils/smoothScroll';
import Body from './Body';
import Pagination from './Pagination';
import Annotatable from '../Annotatable';
import BodyNodes from './BodyNodes';
import has from 'lodash/has';

class Section extends Component {

  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    annotations: PropTypes.array,
    appearance: PropTypes.object,
    location: PropTypes.object,
    createAnnotation: PropTypes.func,
    params: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.maybeScrollToAnchor(null, this.props.location.hash);
  }

  componentDidUpdate(prevProps) {
    this.maybeScrollToAnchor(prevProps.location.hash, this.props.location.hash);
  }

  // Returns a CSS style object based on the font size index in the store
  getFontSize(sizeIndex) {
    const baseSizes = [13, 16, 20, 22, 26, 32];
    return {
      fontSize: baseSizes[sizeIndex] + 'px'
    };
  }

  getMarginSize(sizeIndex) {
    const baseSizes = [790, 680, 500];
    const maxWidth = baseSizes[sizeIndex] + 'px';
    return { maxWidth };
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
    const textSectionClass = classNames({
      'manifold-text-section text-section': true,
      'font-serif': typography.font === 'serif',
      'font-sans-serif': typography.font === 'sans-serif'
    });

    const section = this.props.section;
    return (
        <section className={readerAppearanceClass}>
          <div className="container-focus"
            style={this.getMarginSize(typography.margins.current)}
          >
            <div className={textSectionClass} style={this.getFontSize(typography.fontSize.current)}>
              <Annotatable
                sectionId={this.props.params.sectionId}
                createAnnotation={this.props.createAnnotation}
              >
                <Body annotations={this.props.annotations} section={this.props.section} />
              </Annotatable>
            </div>
          </div>
        </section>
    );
  }
}

Section.Body = Body;
Section.BodyNodes = BodyNodes;
Section.Pagination = Pagination;
export default Section;
