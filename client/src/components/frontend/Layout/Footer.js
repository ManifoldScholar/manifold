import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import chunk from "lodash/chunk";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";

class LayoutFooter extends Component {
  static displayName = "Layout.Footer";

  static propTypes = {
    commonActions: PropTypes.object,
    authentication: PropTypes.object,
    history: PropTypes.object,
    pages: PropTypes.array,
    settings: PropTypes.shape({
      attributes: PropTypes.shape({
        general: PropTypes.object,
        theme: PropTypes.object,
        oauth: PropTypes.object
      })
    })
  };

  static defaultProps = {
    pages: [],
    history: {
      push: () => {}
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      keyword: ""
    };
  }

  handleLogoutClick = event => {
    event.preventDefault();
    this.props.commonActions.logout();
  };

  handleLoginClick = event => {
    event.preventDefault();
    this.props.commonActions.toggleSignInUpOverlay();
  };

  visiblePages(props) {
    if (!props.pages) return [];
    return props.pages.filter(p => {
      return p.attributes.showInFooter && !p.attributes.hidden;
    });
  }

  buildContentPages() {
    return this.visiblePages(this.props).map(page => {
      return (
        <Link to={lh.link("frontendPage", page.attributes.slug)}>
          {page.attributes.navTitle || page.attributes.title}
        </Link>
      );
    });
  }

  buildAuthLink() {
    if (this.props.authentication.authenticated) {
      return (
        <a onClick={this.handleLogoutClick} href="#">
          {"Log Out"}
        </a>
      );
    }
    return (
      <a onClick={this.handleLoginClick} href="#">
        {"Log In"}
      </a>
    );
  }

  buildContactLink() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.general.contactUrl) return null;
    const url = this.props.settings.attributes.general.contactUrl;
    return (
      <a target="_blank" href={url} rel="noopener noreferrer">
        {"Contact"}
      </a>
    );
  }

  buildPagesArray() {
    const pages = [];
    pages.push(this.buildAuthLink());
    pages.push(<Link to={lh.link("frontend")}>{"Projects"}</Link>);
    pages.push(...this.buildContentPages());
    pages.push(this.buildContactLink());
    pages.push(
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://twitter.com/manifoldscholar"
      >
        {"Twitter"}
      </a>
    );
    pages.push(<a href="mailto:webbook@umn.edu">{"Email"}</a>);
    return pages.filter(p => p !== null);
  }

  updateSearchWord = event => {
    this.setState({ keyword: event.target.value });
  };

  doSearch = event => {
    event.preventDefault();
    const path = lh.link("frontendSearch");
    this.props.history.push(path, {
      searchQueryState: { keyword: this.state.keyword }
    });
    this.setState({ keyword: "" });
  };

  renderCopyright() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.general.copyright) return null;
    return (
      <div>
        {`© ${this.props.settings.attributes.general.copyright}.`}
        <br />
      </div>
    );
  }

  render() {
    const chunkedPages = chunk(this.buildPagesArray(), 3);
    return (
      <footer className="footer-browse">
        <div className="container">
          <div className="rel">
            <a
              href="http://manifoldapp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="logo"
            >
              <i className="manicon manicon-manifold-logo" aria-hidden="true" />
              <span className="text">
                {"Powered by Manifold"}
                <span className="small">
                  Learn more at{" "}
                  <span className="underline">manifoldapp.org</span>
                </span>
              </span>
            </a>
          </div>
          <nav className="text-nav">
            <ul>
              {/* eslint-disable react/no-array-index-key */}
              {chunkedPages.map((pageGroup, pageGroupIndex) => (
                <li key={pageGroupIndex}>
                  {pageGroup.length > 0 ? (
                    <ul>
                      {pageGroup.map((page, pageIndex) => (
                        <li key={pageIndex}>{page}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              {/* eslint-enable react/no-array-index-key */}
            </ul>
          </nav>

          <section className="footer-secondary">
            <form onSubmit={this.doSearch}>
              <div className="search-button-inline">
                <input
                  type="text"
                  placeholder="Search"
                  value={this.state.keyword}
                  onChange={this.updateSearchWord}
                />
                <button className="manicon manicon-magnify">
                  <span className="screen-reader-text">
                    Click to submit search query
                  </span>
                </button>
              </div>
            </form>
            <div className="colophon">{this.renderCopyright()}</div>
          </section>
        </div>
      </footer>
    );
  }
}

export default withRouter(LayoutFooter);
