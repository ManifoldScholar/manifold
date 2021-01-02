import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import UniqueIcons from "global/components/icon/unique";
import Layout from "backend/components/layout";

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

  get type() {
    return this.props.type;
  }

  get isProject() {
    return this.type === "project";
  }

  get isProjectCollection() {
    return this.type === "projectCollection";
  }

  get title() {
    return this.props.title;
  }

  get subtitle() {
    return this.props.subtitle;
  }

  get utility() {
    return this.props.utility || null;
  }

  get note() {
    return this.props.note;
  }

  get backLabel() {
    return this.props.backLabel || "Back";
  }

  get backUrl() {
    return this.props.backUrl;
  }

  get backHiddenDesktop() {
    return this.isProjectCollection;
  }

  get secondaryLinks() {
    return this.props.secondaryLinks;
  }

  get iconName() {
    return this.props.iconName;
  }

  get iconFromType() {
    if (this.iconName) return this.iconName;

    let icon = "";
    switch (this.type) {
      case "feature":
        icon = "Lamp64";
        break;
      case "page":
        icon = "ResourceDocument64";
        break;
      case "resourceCollection":
        icon = "ResourceCollection64";
        break;
      case "resources":
        icon = "BEResourcesBoxes64";
        break;
      case "resource":
        icon = "BEResourcesBox64";
        break;
      case "text":
        icon = "TextsStacked64";
        break;
      default:
    }

    return icon;
  }

  projectIcon() {
    return (
      <UniqueIcons.ProjectPlaceholderUnique
        mode="small"
        color="outlined"
        iconClass="backend-header__type-icon backend-header__type-icon--project"
        ariaLabel={null}
      />
    );
  }

  breadcrumbs() {
    return (
      <nav
        aria-label="Breadcrumbs"
        className={classNames("backend-header__breadcrumbs", "breadcrumbs", {
          "breadcrumbs--hidden-desktop": this.backHiddenDesktop
        })}
      >
        <div className="breadcrumbs__inner">
          <Link to={this.backUrl} className="breadcrumbs__link">
            <IconComposer
              icon="arrowLeft16"
              size="default"
              iconClass="breadcrumbs__icon breadcrumbs__icon--small"
            />
            <IconComposer
              icon="arrowLeft32"
              size="default"
              iconClass="breadcrumbs__icon breadcrumbs__icon--large"
            />
            {this.backLabel}
          </Link>
        </div>
      </nav>
    );
  }

  sectionNav() {
    return (
      <Dropdown
        classNames="backend-header__section-nav"
        links={this.secondaryLinks}
      />
    );
  }

  render() {
    return (
      <Layout.ViewHeader
        pre={this.backUrl && this.breadcrumbs()}
        icon={this.isProject ? this.projectIcon() : this.iconFromType}
        utility={this.utility}
        note={this.note}
        title={this.title}
        subtitle={this.subtitle}
        post={this.secondaryLinks && this.sectionNav()}
        padded={!this.isProjectCollection}
        allowTitleHTML
        iconSize={this.isProjectCollection ? 44 : null}
        iconRounded={this.isProjectCollection}
        iconAccented={this.isProjectCollection}
        iconType="entity-type"
      />
    );
  }
}
