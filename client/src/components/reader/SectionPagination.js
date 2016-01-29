import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class SectionPagination extends Component {

  static propTypes = {
    textId: PropTypes.string,
    sectionId: PropTypes.string,
    textSections: PropTypes.array
  };

  getSiblingSection(id, shift) {
    let siblingSection = false;
    this.props.textSections.forEach((section, i) => {
      if (section.id === id && this.props.textSections[i + shift]) {
        siblingSection = this.props.textSections[i + shift];
      }
    });

    return siblingSection;
  }

  getSectionPath(section) {
    return `/read/${this.props.textId}/section/${section.id}`;
  }

  getPreviousLink() {
    let previousLink = '';
    const previousNode = this.getSiblingSection(this.props.sectionId, - 1);
    if (previousNode) {
      const previousPath = this.getSectionPath(previousNode);
      previousLink = (
        <Link to={previousPath} className="pagination-previous" >
          <i className="manicon manicon-arrow-round-left"></i>
          {'Previous'}
        </Link>
      );
    }
    return previousLink;
  }

  getNextLink() {
    let nextLink = '';
    const nextNode = this.getSiblingSection(this.props.sectionId, 1);
    if (nextNode) {
      const nextPath = this.getSectionPath(nextNode);
      nextLink = (
        <Link to={nextPath} className="pagination-next" >
          {'Next'}
          <i className="manicon manicon-arrow-round-right"></i>
        </Link>
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
