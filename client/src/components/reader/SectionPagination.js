import React, { Component, PropTypes } from 'react';

export default class SectionPagination extends Component {

  static propTypes = {
    text: PropTypes.object,
    textId: PropTypes.string,
    sectionId: PropTypes.string
  };

  getSiblingSection(id, shift) {
    let siblingSection = false;
    this.props.text.attributes.toc.forEach((section, i) => {
      if (section.id === id && this.props.text.attributes.toc[i + shift]) {
        siblingSection = this.props.text.attributes.toc[i + shift];
      }
    });

    return siblingSection;
  }

  getSectionPath(section) {
    let path = '';
    let anchor = '';
    if (section.anchor) anchor = `#${section.anchor}`;
    path = `/read/${this.props.text.id}/section/${section.id}${anchor}`;
    return path;
  }

  getPreviousLink() {
    let previousLink = '';
    const previousNode = this.getSiblingSection(Number(this.props.sectionId), - 1);
    if (previousNode) {
      const previousPath = this.getSectionPath(previousNode);
      previousLink = (
        <a href={previousPath} className="pagination-previous">
          <i className="manicon manicon-arrow-round-left"></i>
          {'Previous'}
        </a>
      );
    }
    return previousLink;
  }

  getNextLink() {
    let nextLink = '';
    const nextNode = this.getSiblingSection(Number(this.props.sectionId), 1);
    if (nextNode) {
      const nextPath = this.getSectionPath(nextNode);
      nextLink = (
        <a href={nextPath} className="pagination-next">
          {'Next'}
          <i className="manicon manicon-arrow-round-right"></i>
        </a>
      );
    }
    return nextLink;
  }

  render() {
    return (
      <nav className="section-pagination">
        <div className="container">
          {this.getPreviousLink()}
          {this.getNextLink()}
        </div>
      </nav>
    );
  }
}
