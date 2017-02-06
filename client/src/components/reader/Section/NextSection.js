import React, { PureComponent, PropTypes } from 'react';

export default class NextSection extends PureComponent {

  static propTypes = {
    sectionsMap: PropTypes.array.isRequired,
    sectionId: PropTypes.string.isRequired
  };

  getNextSectionName(map, sectionId) {
    const index = map.findIndex(section => section.id === sectionId);
    if (!map[index + 1] || index === -1) return null;
    return (
      map[index + 1].name
    );
  }

  renderSectionTitle() {
    const nextSection = this.getNextSectionName(this.props.sectionsMap, this.props.sectionId);
    if (!nextSection) return null;
    return (
      <div className="container-focus">
        <header>
          <h3>Next Chapter</h3>
        </header>
        <span>
          <div>{nextSection}</div>
        </span>
      </div>
    );
  }

  render() {
    if (!this.props.sectionsMap) return null;
    if (!this.props.sectionId) return null;
    return (
      <section className="section-next-section">
        {this.renderSectionTitle()}
      </section>
    );
  }
}
