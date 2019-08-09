import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

export default class Pagination extends Component {
  static propTypes = {
    text: PropTypes.object.isRequired,
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
    return lh.link("readerSection", this.props.text.attributes.slug, id);
  }

  getPreviousLink() {
    let previousLink = null;
    const previousNode = this.getSiblingSection(this.props.sectionId, -1);
    if (previousNode) {
      const previousPath = this.getSectionPath(previousNode);
      previousLink = (
        <Link
          to={previousPath}
          className="section-pagination__link section-pagination__link--previous"
        >
          <IconComposer
            icon="circleArrowLeft64"
            size={48}
            iconClass="section-pagination__icon section-pagination__icon--previous"
          />
          <span className="section-pagination__text">Previous</span>
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
        <Link
          to={nextPath}
          className="section-pagination__link section-pagination__link--next"
        >
          <span className="section-pagination__text">Next</span>
          <IconComposer
            icon="circleArrowRight64"
            size={48}
            iconClass="section-pagination__icon section-pagination__icon--next"
          />
        </Link>
      );
    }
    return nextLink;
  }

  render() {
    const text = this.props.text;
    if (!text) return null;

    return (
      <nav className="section-pagination" aria-label="Pagination">
        <div className="section-pagination__inner container">
          {this.getPreviousLink(text)}
          {this.getNextLink(text)}
        </div>
      </nav>
    );
  }
}
