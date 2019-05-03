import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

export default class DetailHeader extends PureComponent {
  static defaultProps = {
    type: "project"
  };

  static displayName = "Navigation.DetailHeader";

  static propTypes = {
    type: PropTypes.string.isRequired,
    iconName: PropTypes.string,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    utility: PropTypes.object,
    note: PropTypes.string,
    secondaryLinks: PropTypes.array,
    backUrl: PropTypes.string,
    backLabel: PropTypes.string
  };

  typeToManiconClass(type, iconName) {
    if (iconName) return `manicon-${iconName}`;

    let segment = `${type}-placeholder`;
    if (type === "user") segment = "person";
    if (type === "project") segment = "project-placeholder";
    if (type === "resourceCollection") segment = "file-box-border";
    if (type === "resource") segment = "cube-shine";
    if (type === "resources") segment = "cube-multiple";
    if (type === "page") segment = "document";
    if (type === "feature") segment = "lamp";
    if (type === "subject") segment = "books-on-shelf";
    return `manicon-${segment}`;
  }

  renderBreadcrumbs() {
    if (!this.props.backUrl) return null;

    const label = this.props.backLabel;

    return (
      <nav className="breadcrumb-primary">
        <div className="container flush">
          <Link to={this.props.backUrl}>
            <i className="manicon manicon-arrow-left" aria-hidden="true" />
            {label || "Back"}
          </Link>
        </div>
      </nav>
    );
  }

  renderSectionNav(props) {
    if (!props.secondaryLinks) return null;

    return <Dropdown classNames="section-nav" links={props.secondaryLinks} />;
  }

  renderTitle() {
    return <span dangerouslySetInnerHTML={{ __html: this.props.title }} />;
  }

  render() {
    return (
      <section className="backend-header">
        {this.renderBreadcrumbs()}
        <div className="wrapper">
          <header className="entity-header-primary">
            {this.props.type === "user" ? null : (
              <figure>
                <i
                  className={`manicon ${this.typeToManiconClass(
                    this.props.type,
                    this.props.iconName
                  )}`}
                />
              </figure>
            )}
            <div className="title">
              <h1>
                {this.renderTitle()}
                <span className="subtitle">{this.props.subtitle}</span>
              </h1>
              <div className="utility">
                {this.props.utility ? this.props.utility : null}
                {this.props.note ? (
                  <span className="notes">{this.props.note}</span>
                ) : null}
              </div>
            </div>
          </header>
        </div>
        {this.renderSectionNav(this.props)}
      </section>
    );
  }
}
