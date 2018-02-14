import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import chunk from "lodash/chunk";
import lh from "helpers/linkHandler";

export default class LayoutFooter extends Component {
  static displayName = "Layout.Footer";

  static propTypes = {
    commonActions: PropTypes.object,
    authentication: PropTypes.object,
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
    pages: []
  };

  constructor() {
    super();
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.buildPagesArray = this.buildPagesArray.bind(this);
    this.buildAuthLink = this.buildAuthLink.bind(this);
    this.buildContentPages = this.buildContentPages.bind(this);
    this.renderCopyright = this.renderCopyright.bind(this);
  }

  handleLogoutClick(event) {
    event.preventDefault();
    this.props.commonActions.logout();
  }

  handleLoginClick(event) {
    event.preventDefault();
    this.props.commonActions.toggleSignInUpOverlay();
  }

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
      <a target="_blank" href={url}>
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
    return pages;
  }

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
            <Link to={lh.link("frontend")} className="logo">
              <i className="manicon manicon-manifold-logo" />
              {"Manifold"}
            </Link>
          </div>
          <nav className="text-nav">
            <ul>
              {/* eslint-disable react/no-array-index-key */}
              {chunkedPages.map((pageGroup, pageGroupIndex) => (
                <li key={pageGroupIndex}>
                  <ul>
                    {pageGroup.map((page, pageIndex) => (
                      <li key={pageIndex}>{page}</li>
                    ))}
                  </ul>
                </li>
              ))}
              {/* eslint-enable react/no-array-index-key */}
            </ul>
          </nav>

          <section className="footer-secondary">
            {/*
              Hiding search markup until basic search functionality is implemented
              <form>
                <div className="search-button-inline">
                  <input type="text" placeholder="Search"/>
                  <button className="manicon manicon-magnify">
                    <span className="screen-reader-text">Click to submit search query</span>
                  </button>
                </div>
              </form>
            */}
            <p className="colophon">
              {this.renderCopyright()}
              {`Manifold is released under the `}
              <a href="https://raw.githubusercontent.com/ManifoldScholar/manifold/development/LICENSE.md">
                GNU General Public License v3
              </a>
              {`. Download and contribute to `}
              <a href="https://github.com/ManifoldScholar/manifold">Manifold</a>
              {` on github.`}
            </p>
          </section>
        </div>
      </footer>
    );
  }
}
