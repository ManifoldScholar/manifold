import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default class NextSection extends PureComponent {
  static propTypes = {
    sectionsMap: PropTypes.array.isRequired,
    text: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    typography: PropTypes.object,
    colors: PropTypes.object
  };

  static defaultProps = {
    colors: {
      colorScheme: "light"
    }
  };

  getNextSectionName(map, sectionId) {
    const index = map.findIndex(section => section.id === sectionId);
    if (!map[index + 1] || index === -1) return null;
    return map[index + 1];
  }

  getSectionPath(id) {
    return lh.link("readerSection", this.props.text.attributes.slug, id);
  }

  renderSectionLink() {
    const nextSection = this.getNextSectionName(
      this.props.sectionsMap,
      this.props.sectionId
    );
    const { text } = this.props;
    if (!nextSection || !nextSection.name) return null;
    return (
      <Link to={this.getSectionPath(nextSection.id)}>
        <header>
          {text.attributes.sectionKind
            ? `Next ${text.attributes.sectionKind}`
            : "Next Chapter"}
        </header>
        <h3>
          <div>{nextSection.name}</div>
        </h3>
      </Link>
    );
  }

  render() {
    const { typography, colors } = this.props;

    // Apply a conditional wrapper class to maintain selected color scheme
    const sectionClass = classNames("section-next-section", {
      "scheme-light": colors.colorScheme === "light",
      "scheme-dark": colors.colorScheme === "dark"
    });

    // Apply a conditional container class that maps to a size in CSS
    const containerClass = `container-focus container-width-${
      typography.margins.current
    }`;

    if (!this.props.sectionsMap) return null;
    if (!this.props.sectionId) return null;
    return (
      <section className={sectionClass}>
        <div className={containerClass}>{this.renderSectionLink()}</div>
      </section>
    );
  }
}
