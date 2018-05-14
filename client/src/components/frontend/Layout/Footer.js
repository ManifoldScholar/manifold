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

  buildEmailLink() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.general.contactEmail) return null;
    return (
      <Link to={lh.link("frontendContact")}>
        <i className="manicon manicon-envelope-simple" />
        {"Email"}
      </Link>
    );
  }

  buildTwitterLink() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.general.twitter) return null;
    const name = this.props.settings.attributes.general.twitter;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/${name}`}
      >
        <i className="manicon manicon-twitter" />
        {"Twitter"}
      </a>
    );
  }

  buildFacebookLink() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.general.facebook) return null;
    const page = this.props.settings.attributes.general.facebook;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.facebook.com/${page}`}
      >
        <i className="manicon manicon-facebook" />
        {"Facebook"}
      </a>
    );
  }

  buildPagesArray() {
    const pages = [];
    pages.push(this.buildAuthLink());
    pages.push(<Link to={lh.link("frontend")}>{"Projects"}</Link>);
    pages.push(...this.buildContentPages());
    return pages.filter(p => p !== null);
  }

  buildSocialsArray() {
    const socials = [];
    socials.push(this.buildTwitterLink());
    socials.push(this.buildEmailLink());
    socials.push(this.buildFacebookLink());

    return socials;
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

  /* eslint-disable react/no-array-index-key */
  renderLinkColumn(links) {
    if (links.length === 0) return null;
    return <ul>{links.map((link, index) => <li key={index}>{link}</li>)}</ul>;
  }
  /* eslint-enable react/no-array-index-key */

  render() {
    const chunkedPages = chunk(this.buildPagesArray(), 3);
    const socialLinks = this.buildSocialsArray();

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
              {chunkedPages.map((pageGroup, pageGroupIndex) => (
                /* eslint-disable react/no-array-index-key */
                <li key={pageGroupIndex}>{this.renderLinkColumn(pageGroup)}</li>
                /* eslint-enable react/no-array-index-key */
              ))}
              <li>{this.renderLinkColumn(socialLinks)}</li>
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
