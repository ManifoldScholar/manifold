import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withSearchResultHelper from "../searchResultHelper";
import isArray from "lodash/isArray";
import Collapse from "global/components/Collapse";

class SearchResultsTypeGenericExcerpts extends PureComponent {
  static propTypes = {
    excerpts: PropTypes.array.isRequired,
    joinHighlightedFragments: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
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

  render() {
    if (!this.hasExcerpts) return null;

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
        <Collapse>
          <Collapse.Content>
            {visible => (
              <>
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
                      tabIndex={visible ? 0 : -1}
                    />
                  </blockquote>
                ))}
              </>
            )}
          </Collapse.Content>
          <Collapse.Toggle className="search-result__excerpt-open-button">
            {(visible, labelProps) => (
              <span {...labelProps}>
                {visible
                  ? "Show all excerpts"
                  : "Only show most relevant excerpts"}
              </span>
            )}
          </Collapse.Toggle>
        </Collapse>
      </>
    );
  }
}

export default withSearchResultHelper(SearchResultsTypeGenericExcerpts);
