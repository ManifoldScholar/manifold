import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import chunk from "lodash/chunk";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";
import withPluginReplacement from "hoc/with-plugin-replacement";
import BlurOnLocationChange from "hoc/blur-on-location-change";
import Utility from "global/components/utility";

class LayoutFooter extends Component {
  static displayName = "Layout.Footer";

  static propTypes = {
    commonActions: PropTypes.object,
    authentication: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    pages: PropTypes.array,
    settings: PropTypes.shape({
      attributes: PropTypes.shape({
        general: PropTypes.object,
        theme: PropTypes.object,
        oauth: PropTypes.object,
        pressLogoStyles: PropTypes.object,
        pressLogoFooterStyles: PropTypes.object,
        copyrightFormatted: PropTypes.string
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

  sortedPages(props) {
    const out = [];
    this.visiblePages(props).map(page => {
      return page.attributes.purpose === "supplemental_content"
        ? out.unshift(page)
        : out.push(page);
    });

    return out;
  }

  buildContentPages() {
    return this.sortedPages(this.props).map(page => {
      return page.attributes.isExternalLink
        ? this.buildExternalPageLink(page)
        : this.buildInternalPageLink(page);
    });
  }

  buildInternalPageLink(page) {
    return (
      <Link
        to={lh.link("frontendPage", page.attributes.slug)}
        target={page.attributes.openInNewTab ? "_blank" : null}
      >
        {page.attributes.navTitle || page.attributes.title}
      </Link>
    );
  }

  buildExternalPageLink(page) {
    return (
      <a
        href={page.attributes.externalLink}
        target={page.attributes.openInNewTab ? "_blank" : null}
        rel="noopener noreferrer"
      >
        {page.attributes.navTitle || page.attributes.title}
      </a>
    );
  }

  buildAuthLink() {
    if (this.props.authentication.authenticated) {
      return (
        <span
          className="fake-link"
          role="button"
          tabIndex="0"
          onClick={this.handleLogoutClick}
        >
          {"Log Out"}
        </span>
      );
    }
    return (
      <span className="fake-link" role="button" onClick={this.handleLoginClick}>
        {"Log In"}
      </span>
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
    pages.push(<Link to={lh.link("frontend")}>Home</Link>);
    pages.push(<Link to={lh.link("frontendProjectsAll")}>Projects</Link>);
    pages.push(...this.buildContentPages());
    return pages.filter(p => p !== null);
  }

  buildSocialsArray() {
    const socials = [];
    const emailLink = this.buildEmailLink();
    const facebookLink = this.buildFacebookLink();
    const twitterLink = this.buildTwitterLink();

    if (emailLink) socials.push(emailLink);
    if (facebookLink) socials.push(facebookLink);
    if (twitterLink) socials.push(twitterLink);

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

  checkPressLogo(pressLogo) {
    return pressLogo && pressLogo.original !== null;
  }

  renderCopyright() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.copyrightFormatted) return null;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: this.props.settings.attributes.copyrightFormatted
        }}
      />
    );
  }

  /* eslint-disable react/no-array-index-key */
  renderLinkColumn(links, wrapperClass) {
    if (links.length === 0) return null;
    return (
      <ul className={wrapperClass}>
        {links.map((link, index) => (
          <li key={index}>{link}</li>
        ))}
      </ul>
    );
  }
  /* eslint-enable react/no-array-index-key */

  renderSearchForm() {
    return (
      <form className="search-form" onSubmit={this.doSearch}>
        <div className="search-button-inline">
          <label htmlFor="footer-search" className="screen-reader-text">
            Site Search
          </label>
          <input
            type="text"
            id="footer-search"
            placeholder="Search"
            value={this.state.keyword}
            onChange={this.updateSearchWord}
          />
          <button className="icon">
            <Utility.IconComposer
              className="search-icon"
              icon="search16"
              size={20}
            />
            <span className="screen-reader-text">Search</span>
          </button>
        </div>
      </form>
    );
  }

  renderPressLogo(pressLogo, pressSite) {
    return (
      <a
        href={pressSite}
        target="_blank"
        rel="noopener noreferrer"
        className="press-logo"
      >
        <img className="logo-image" alt="Press Site" src={pressLogo.original} />
      </a>
    );
  }

  render() {
    const chunkedPages = chunk(this.buildPagesArray(), 3);
    const socialLinks = this.buildSocialsArray();
    const { settings } = this.props;

    let pressLogo;
    let pressSite;
    let isPressLogo = false;
    if (settings) {
      pressLogo = this.props.settings.attributes.pressLogoFooterStyles;
      isPressLogo = this.checkPressLogo(pressLogo);
      pressSite = this.props.settings.attributes.general.pressSite;
    }

    return (
      <BlurOnLocationChange location={this.props.location}>
        <footer className="footer-browse">
          <section className="footer-primary">
            <div className="container flush">
              <div className="flex-row">
                <div className="right">
                  {isPressLogo
                    ? this.renderPressLogo(pressLogo, pressSite)
                    : this.renderSearchForm()}
                </div>
                <div className="rel left">
                  <nav className="text-nav">
                    <ul>
                      {chunkedPages.map(
                        (pageGroup, pageGroupIndex) => (
                          /* eslint-disable react/no-array-index-key */
                          <li key={pageGroupIndex}>
                            {this.renderLinkColumn(pageGroup, "footer-nav")}
                          </li>
                        )
                        /* eslint-enable react/no-array-index-key */
                      )}
                      <li>
                        {this.renderLinkColumn(socialLinks, "social-nav")}
                      </li>
                    </ul>
                  </nav>
                  {isPressLogo ? this.renderSearchForm() : null}
                </div>
              </div>
            </div>
          </section>

          <section className="footer-secondary">
            <div className="container flush">
              <div className="colophon">{this.renderCopyright()}</div>
            </div>
          </section>
          <a
            href="http://manifoldapp.org"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-tertiary"
          >
            <section aria-hidden="true">
              <div className="container flush">
                <span className={isPressLogo ? "logo dull" : "logo"}>
                  <i className="manicon manicon-manifold-logo" />
                  <span className="text">
                    <span className="neutral-text">Powered by</span>
                    <span className="white-text"> Manifold</span>
                  </span>
                </span>
              </div>
            </section>
            <span className="screen-reader-text">
              Learn more about the Manifold App
            </span>
          </a>
        </footer>
      </BlurOnLocationChange>
    );
  }
}

export default withRouter(
  withPluginReplacement(LayoutFooter, "Frontend.Components.Layout.Footer")
);
