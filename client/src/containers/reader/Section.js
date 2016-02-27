import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from '../../decorators/connectData';
import { fetchOneSection } from '../../actions/shared/collections';
import classNames from 'classnames';
import { SectionBody } from '../../components/reader';
import scrollToElement from 'scroll-to-element';

function fetchData(getState, dispatch, location, params) {
  return Promise.all([
    fetchOneSection(params.section_id)(dispatch, getState)
  ]);
}

function mapStateToProps(state) {
  return {
    fetchOneSection: state.collections.results.fetchOneSection.entities,
    sections: state.collections.entities.text_sections,
    appearance: {
      typography: state.ui.typography,
      colors: state.ui.colors
    },
    hash: state.routing.locationBeforeTransitions.hash
  };
}

@connectData(fetchData)
@connect(mapStateToProps)

class Reader extends Component {

  static propTypes = {
    children: PropTypes.object,
    text: PropTypes.object,
    fetchOneSection: PropTypes.string,
    sections: PropTypes.object,
    appearance: PropTypes.object,
    hash: PropTypes.string
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.maybeScrollToAnchor(null, this.props.hash);
  }

  componentDidUpdate(prevProps) {
    this.maybeScrollToAnchor(prevProps.hash, this.props.hash);
  }

  getSection() {
    return this.props.sections[this.props.fetchOneSection];
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
    return {
      maxWidth: baseSizes[sizeIndex] + 'px'
    };
  }

  maybeScrollToAnchor(previousHash, currentHash) {
    if (currentHash && previousHash !== currentHash) {
      scrollToElement(currentHash, {
        offset: -125,
        ease: 'in-quad',
        duration: 500
      });
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

    const section = this.getSection();
    return (
        <section className={readerAppearanceClass}>
          <div className="container-focus" style={this.getMarginSize(typography.margins.current)}>
            <div className={textSectionClass} style={this.getFontSize(typography.fontSize.current)}>
              <SectionBody section={this.getSection()} />
            </div>
          </div>
        </section>
    );
  }
}

export default connect(
)(Reader);
