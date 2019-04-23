import React, { PureComponent } from "react";
import chunk from "lodash/chunk";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";

export default class Navigation extends PureComponent {
  static displayName = "Layout.Footer.Navigation";

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
        className="footer-nav-list__link"
      >
        {page.attributes.navTitle || page.attributes.title}
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
          {"Log Out"}
        </span>
      );
    }
    return (
      <span
        className="footer-nav-list__link"
        role="button"
        onClick={this.handleLoginClick}>
        {"Log In"}
      </span>
    );
  }

  buildEmailLink() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.general.contactEmail) return null;
    return (
      <Link to={lh.link("frontendContact")} className="footer-nav-list__link">
        <Utility.IconComposer
          icon="socialEmail32"
          size={24}
          iconClass="footer-nav-list__icon"
        />
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
        className="footer-nav-list__link"
      >
        <Utility.IconComposer
          icon="socialTwitter32"
          size={24}
          iconClass="footer-nav-list__icon"
        />
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
        className="footer-nav-list__link"
      >
        <Utility.IconComposer
          icon="socialFacebook32"
          size={24}
          iconClass="footer-nav-list__icon"
        />
        {"Facebook"}
      </a>
    );
  }

  buildPagesArray() {
    const pages = [];
    pages.push(this.buildAuthLink());
    pages.push(
      <Link to={lh.link("frontend")} className="footer-nav-list__link">
        {"Home"}
      </Link>
    );
    pages.push(
      <Link
        to={lh.link("frontendProjectsAll")}
        className="footer-nav-list__link">
          {"Projects"}
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
  renderLinkColumn(links) {
    if (links.length === 0) return null;
    return (
      <ul className="footer-nav-list">
        {links.map((link, index) => (
          <li key={index}>{link}</li>
        ))}
      </ul>
    );
  }
  /* eslint-enable react/no-array-index-key */

  render() {
    const chunkedPages = chunk(this.buildPagesArray(), 3);
    const socialLinks = this.buildSocialsArray();

    return (
      <nav className="text-nav">
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
    )
  }
}
