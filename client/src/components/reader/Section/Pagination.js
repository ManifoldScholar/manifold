import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lh from 'helpers/linkHandler';
import { Link } from 'react-router-dom';

export default class Pagination extends Component {

  static propTypes = {
    textId: PropTypes.string,
    sectionId: PropTypes.string,
    spine: PropTypes.array
  };

  getSiblingSection(id, shift) {
    if (!this.props.spine) return;
    let siblingSection = false;
    const index = this.props.spine.indexOf(id);
    if (this.props.spine[index + shift] || index !== -1) {
      siblingSection = this.props.spine[index + shift];
    }

    return siblingSection;
  }

  getSectionPath(id) {
    return lh.link("readerSection", this.props.textId, id);
  }

  getPreviousLink() {
    let previousLink = null;
    const previousNode = this.getSiblingSection(this.props.sectionId, - 1);
    if (previousNode) {
      const previousPath = this.getSectionPath(previousNode);
      previousLink = (
        <Link to={previousPath} className="pagination-previous" >
          <i className="manicon manicon-arrow-round-left"></i>
          <span className="text">
            {'Previous'}
          </span>
        </Link>
      );
    }
    return previousLink;
  }

  getNextLink() {
    let nextLink = null;
    const nextNode = this.getSiblingSection(this.props.sectionId, 1);
    if (nextNode) {
      const nextPath = this.getSectionPath(nextNode);
      nextLink = (
        <Link to={nextPath} className="pagination-next" >
          <span className="text">
            {'Next'}
          </span>
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
