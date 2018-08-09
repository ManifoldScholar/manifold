import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";

export default class DetailHeader extends PureComponent {
  static displayName = "Navigation.DetailHeader";

  static propTypes = {
    breadcrumb: PropTypes.array,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleHtml: PropTypes.bool,
    subtitle: PropTypes.string,
    utility: PropTypes.object,
    note: PropTypes.string,
    secondaryLinks: PropTypes.array
  };

  static defaultProps = {
    titleHtml: false
  };

  typeToManiconClass(type) {
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

  renderTitle() {
    if (this.props.titleHtml) {
      return <span dangerouslySetInnerHTML={{ __html: this.props.title }} />;
    }
    return this.props.title;
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
    const breadcrumb = this.props.breadcrumb;
    return (
      <section className="backend-header">
        {breadcrumb && breadcrumb.length > 0 ? (
          <Navigation.Breadcrumb links={this.props.breadcrumb} />
        ) : null}
        <div className="wrapper">
          <header className="entity-header-primary">
            {this.props.type === "user" ? null : (
              <figure>
                <i
                  className={`manicon ${this.typeToManiconClass(
                    this.props.type
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
