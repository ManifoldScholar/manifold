import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import { Link } from "react-router-dom";

export default class DetailHeader extends PureComponent {
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

  static defaultProps = {
    type: "project"
  };

  typeToManiconClass(type, iconName) {
    if (iconName) return `manicon-${iconName}`;

    let segment = `${type}-placeholder`;
    if (type === "user") segment = "person";
    if (type === "project") segment = "project-placeholder";
    if (type === "collection") segment = "file-box-border";
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

  renderTitle() {
    return <span dangerouslySetInnerHTML={{ __html: this.props.title }} />;
  }

  renderSectionNav(props) {
    if (!props.secondaryLinks) return null;

    return (
      <Navigation.Dropdown
        classNames="section-nav"
        links={props.secondaryLinks}
      />
    );
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
