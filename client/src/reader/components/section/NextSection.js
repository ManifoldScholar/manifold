import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { getNextVisible } from "./helpers/hiddenSections";

class NextSection extends PureComponent {
  static propTypes = {
    sectionsMap: PropTypes.array.isRequired,
    text: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    typography: PropTypes.object,
    t: PropTypes.func
  };

  getSectionPath(id) {
    return lh.link("readerSection", this.props.text.attributes.slug, id);
  }

  renderSectionLink() {
    const index = this.props.sectionsMap.findIndex(
      section => section.id === this.props.sectionId
    );
    const nextSection = getNextVisible(this.props.sectionsMap, index);
    const { text } = this.props;
    if (!nextSection || !nextSection.name) return null;
    return (
      <Link
        to={{
          pathname: this.getSectionPath(nextSection.id),
          state: { pageChange: true }
        }}
        className="section-next-section__link"
      >
        <header className="section-next-section__header">
          {this.props.t("navigation.next_entity", {
            entity: text.attributes.sectionKind
              ? text.attributes.sectionKind
              : "Chapter"
          })}
        </header>
        <div className="section-next-section__title">{nextSection.name}</div>
      </Link>
    );
  }

  render() {
    const { typography } = this.props;

    // Apply a conditional container class that maps to a size in CSS
    const containerClass = `container-focus container-width-${typography.margins.current}`;

    if (!this.props.sectionsMap) return null;
    if (!this.props.sectionId) return null;
    return (
      <section className="section-next-section">
        <div className={containerClass}>{this.renderSectionLink()}</div>
      </section>
    );
  }
}

export default withTranslation()(NextSection);
