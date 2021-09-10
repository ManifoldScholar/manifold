import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withSearchResultHelper from "../searchResultHelper";
import isArray from "lodash/isArray";
import classNames from "classnames";
import { Collapse } from "react-collapse";

class SearchResultsTypeGenericExcerpts extends PureComponent {
  static propTypes = {
    excerpts: PropTypes.array.isRequired,
    joinHighlightedFragments: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.scrollTarget = React.createRef();
  }

  get excerpts() {
    return this.allExcerpts.slice(0, 3);
  }

  get expandedExcerpts() {
    return this.allExcerpts.slice(3);
  }

  get expandable() {
    return this.expandedExcerpts.length > 0;
  }

  get allExcerpts() {
    return this.props.excerpts;
  }

  get hasExcerpts() {
    return isArray(this.allExcerpts) && this.allExcerpts.length > 0;
  }

  holdScroll = ({ contentHeight }) => {
    if (contentHeight !== 0) return;
    this.scrollTarget.current.scrollIntoView({ block: "center" });
  };

  toggle = event => {
    event.preventDefault();
    this.setState({ open: !this.state.open });
  };

  render() {
    if (!this.hasExcerpts) return null;

    const expandedClass = classNames({
      "search-result__excerpts-expanded": true,
      "search-result__excerpts-expanded--open": this.state.open
    });

    return (
      <>
        <div className="search-result__excerpts" ref={this.scrollTarget}>
          {this.excerpts.map(excerpt => (
            <blockquote
              key={excerpt.nodeUuid}
              className="search-result__excerpt"
            >
              <Link
                to={excerpt.url}
                dangerouslySetInnerHTML={{
                  __html: this.props.joinHighlightedFragments(
                    excerpt.contentHighlighted
                  )
                }}
              />
            </blockquote>
          ))}
        </div>

        <Collapse
          className={expandedClass}
          isOpened={this.state.open}
          onWork={this.holdScroll}
          onRest={this.holdScroll}
          id="all-excerpts"
          role="region"
          aria-labelledby="expand-toggle"
        >
          <div className="search-result__excerpt-shim" />
          {this.expandedExcerpts.map(excerpt => (
            <blockquote
              key={excerpt.nodeUuid}
              className="search-result__excerpt"
            >
              <Link
                to={excerpt.url}
                dangerouslySetInnerHTML={{
                  __html: this.props.joinHighlightedFragments(
                    excerpt.contentHighlighted
                  )
                }}
              />
            </blockquote>
          ))}
        </Collapse>

        {this.expandable && (
          <button
            className="search-result__excerpt-open-button"
            onClick={this.toggle}
            aria-expanded={this.state.open}
            aria-controls="all-excerpts"
            id="expand-toggle"
          >
            {!this.state.open
              ? "Show all excerpts"
              : "Only show most relevant excerpts"}
          </button>
        )}
      </>
    );
  }
}

export default withSearchResultHelper(SearchResultsTypeGenericExcerpts);
