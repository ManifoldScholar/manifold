import React, { PureComponent } from "react";
import chunk from "lodash/chunk";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";
import classNames from "classnames";

export default class Navigation extends PureComponent {
  static displayName = "Layout.Footer.Navigation";

  get settings() {
    return this.props.settings;
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
        className="footer-nav-list__link"
      >
        <span className="footer-nav-list__text">
          {page.attributes.navTitle || page.attributes.title}
        </span>
      </Link>
    );
  }

  buildExternalPageLink(page) {
    return (
      <a
        href={page.attributes.externalLink}
        target={page.attributes.openInNewTab ? "_blank" : null}
        rel="noopener noreferrer"
        className="footer-nav-list__link"
      >
        <span className="footer-nav-list__text">
          {page.attributes.navTitle || page.attributes.title}
        </span>
      </a>
    );
  }

  buildAuthLink() {
    if (this.props.authentication.authenticated) {
      return (
        <span
          role="button"
          tabIndex="0"
          onClick={this.handleLogoutClick}
          className="footer-nav-list__link"
        >
          <span className="footer-nav-list__text">{"Log Out"}</span>
        </span>
      );
    }
    return (
      <span
        className="footer-nav-list__link"
        role="button"
        onClick={this.handleLoginClick}
      >
        <span className="footer-nav-list__text">{"Log In"}</span>
      </span>
    );
  }

  buildEmailLink() {
    if (!this.settings || !this.settings.attributes.general.contactEmail)
      return null;
    return (
      <Link to={lh.link("frontendContact")} className="footer-nav-list__link">
        <Utility.IconComposer
          icon="socialEmail32"
          size={24}
          iconClass="footer-nav-list__icon"
        />
        <span className="footer-nav-list__text">{"Email"}</span>
      </Link>
    );
  }

  buildTwitterLink() {
    if (!this.settings || !this.settings.attributes.general.twitter)
      return null;
    const name = this.settings.attributes.general.twitter;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/${name}`}
        className="footer-nav-list__link"
      >
        <Utility.IconComposer
          icon="socialTwitter32"
          size={24}
          iconClass="footer-nav-list__icon"
        />
        <span className="footer-nav-list__text">{"Twitter"}</span>
      </a>
    );
  }

  buildFacebookLink() {
    if (!this.settings || !this.settings.attributes.general.facebook)
      return null;
    const page = this.settings.attributes.general.facebook;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.facebook.com/${page}`}
        className="footer-nav-list__link"
      >
        <Utility.IconComposer
          icon="socialFacebook32"
          size={24}
          iconClass="footer-nav-list__icon"
        />
        <span className="footer-nav-list__text">{"Facebook"}</span>
      </a>
    );
  }

  buildPagesArray() {
    const pages = [];
    pages.push(this.buildAuthLink());
    pages.push(
      <Link to={lh.link("frontend")} className="footer-nav-list__link">
        <span className="footer-nav-list__text">{"Home"}</span>
      </Link>
    );
    pages.push(
      <Link
        to={lh.link("frontendProjectsAll")}
        className="footer-nav-list__link"
      >
        <span className="footer-nav-list__text">{"Projects"}</span>
      </Link>
    );
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

  /* eslint-disable react/no-array-index-key */
  renderLinkColumn(links, simpleTheme) {
    if (links.length === 0) return null;
    return (
      <ul
        className={classNames({
          "footer-nav-list": true,
          "footer-nav-list--simple": simpleTheme
        })}
      >
        {links.map((link, index) => (
          <li key={index} className="footer-nav-list__item">
            {link}
          </li>
        ))}
      </ul>
    );
  }
  /* eslint-enable react/no-array-index-key */

  render() {
    const chunkedPages = chunk(this.buildPagesArray(), 3);
    const socialLinks = this.buildSocialsArray();

    return (
      <nav className="text-nav" aria-label="Footer Navigation">
        <ul className="text-nav__list">
          {chunkedPages.map(
            (pageGroup, pageGroupIndex) => (
              /* eslint-disable react/no-array-index-key */
              <li key={pageGroupIndex} className="text-nav__link-group">
                {this.renderLinkColumn(pageGroup)}
              </li>
            )
            /* eslint-enable react/no-array-index-key */
          )}
          <li className="text-nav__link-group">
            {this.renderLinkColumn(socialLinks)}
          </li>
        </ul>
      </nav>
    );
  }
}
