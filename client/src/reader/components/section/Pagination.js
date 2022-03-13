import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

class Pagination extends Component {
  static propTypes = {
    text: PropTypes.object.isRequired,
    sectionId: PropTypes.string,
    spine: PropTypes.array,
    t: PropTypes.func
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
            className="section-pagination__icon section-pagination__icon--previous"
          />
          <span className="section-pagination__text">
            {this.props.t("pagination.previous")}
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
        <Link
          to={nextPath}
          className="section-pagination__link section-pagination__link--next"
        >
          <span className="section-pagination__text">
            {this.props.t("pagination.next")}
          </span>
          <IconComposer
            icon="circleArrowRight64"
            size={48}
            className="section-pagination__icon section-pagination__icon--next"
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
      <nav
        className="section-pagination"
        aria-label={this.props.t("pagination.pagination")}
      >
        <div className="section-pagination__inner container flush">
          {this.getPreviousLink(text)}
          {this.getNextLink(text)}
        </div>
      </nav>
    );
  }
}

export default withTranslation()(Pagination);
