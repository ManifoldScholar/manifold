import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import withCurrentUser from "hoc/with-current-user";
import IconComposer from "global/components/utility/IconComposer";

export class LayoutButtonNavigation extends Component {
  static displayName = "Layout.ButtonNavigation";

  static propTypes = {
    grayBg: PropTypes.bool,
    showProjects: PropTypes.bool,
    showFollowing: PropTypes.bool,
    showProjectCollections: PropTypes.bool,
    hideAtNarrow: PropTypes.bool,
    currentUser: PropTypes.object
  };

  static defaultProps = {
    grayBg: true,
    showProjects: true,
    showFollowing: true,
    showProjectCollections: false
  };

  renderButtonInner(icon, label) {
    return (
      <>
        <IconComposer
          icon={icon}
          size={48}
          iconClass="button-icon-primary__icon"
        />
        <span className="button-icon-primary__text">{label}</span>
      </>
    );
  }

  renderProjectsButton = () => {
    if (!this.props.showProjects && !this.props.showProjectCollections)
      return null;
    let url = null;
    let label = null;

    if (this.props.showProjects) {
      url = lh.link("frontendProjectsAll");
      label = "See All Projects";
    } else if (this.props.showProjectCollections) {
      url = lh.link("frontendProjectCollections");
      label = "See Project Collections";
    }

    return (
      <Link to={url} className="button-icon-primary">
        {this.renderButtonInner("projects64", label)}
      </Link>
    );
  };

  renderFollowingButton = () => {
    if (!this.props.currentUser) return null;
    if (this.props.showFollowing !== true) return null;
    return (
      <Link to={lh.link("frontendFollowing")} className="button-icon-primary">
        {this.renderButtonInner("following64", "Projects You’re Following")}
      </Link>
    );
  };

  render() {
    const sectionClass = classNames({
      "show-50": this.props.hideAtNarrow === true,
      "bg-neutral05": this.props.grayBg === true
    });

    if (!this.renderProjectsButton() && !this.renderFollowingButton())
      return null;
    return (
      <section className={sectionClass}>
        <div className="container">
          <h2 className="screen-reader-text">Project Navigation</h2>
          <div className="button-nav button-nav--default">
            {this.renderProjectsButton()}
            {this.renderFollowingButton()}
          </div>
        </div>
      </section>
    );
  }
}

export default withCurrentUser(LayoutButtonNavigation);
