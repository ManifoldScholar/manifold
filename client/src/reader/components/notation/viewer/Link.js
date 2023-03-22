import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

class NotationViewerLink extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      sectionId: PropTypes.string,
      textId: PropTypes.string
    }),
    notation: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.element.isRequired
  };

  url(notation) {
    if (!notation) return null;
    const { sectionId, textSlug } = this.props.params;
    if (notation.type === "resources") {
      return lh.link("readerSectionResource", textSlug, sectionId, notation.id);
    }
    if (notation.type === "resourceCollections") {
      return lh.link(
        "readerSectionResourceCollection",
        textSlug,
        sectionId,
        notation.id
      );
    }
    return null;
  }

  render() {
    const { notation, className, children } = this.props;
    const url = this.url(notation);

    if (url) {
      return (
        <Link
          className={className}
          to={{ pathname: url, state: { noScroll: true } }}
        >
          {children}
        </Link>
      );
    }
    return children;
  }
}

export default NotationViewerLink;
