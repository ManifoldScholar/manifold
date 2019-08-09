import React from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import classNames from "classnames";
import GroupNavButtons from "./GroupNavButtons";

export default class Heading extends React.PureComponent {
  get groupName() {
    return this.props.groupName;
  }

  get pageType() {
    return this.props.pageType;
  }

  get pageTitle() {
    if (this.pageType === "groupList") {
      return "Manage Annotation Groups";
    } else if (this.pageType === "groupDetail") {
      return this.groupName;
    } else if (this.pageType === "memberList") {
      return (
        <React.Fragment>
          {this.groupName}:
          <span className={"group-page-heading__subtitle"}>{" Members"}</span>
        </React.Fragment>
      );
    }
  }

  get textContainerClassNames() {
    return classNames({
      "group-page-heading__text-container": true,
      "group-page-heading__text-container--narrow":
        this.pageType === "groupDetail"
    });
  }

  render() {
    const { memberListLink, openEditDrawer } = this.props;
    return (
      <div className={"group-page-heading"}>
        <div className={this.textContainerClassNames}>
          <Utility.IconComposer
            icon="annotationGroup24"
            size={32}
            iconClass={"group-page-heading__icon"}
          />
          <h2 className={"heading-primary group-page-heading__text"}>
            {this.pageTitle}
          </h2>
        </div>
        {this.pageType === "groupList" && (
          <GroupNavButtons
            links={[
              {
                to: lh.link("readingGroupsNew"),
                text: "Create New Annotation Group"
              }
            ]}
          />
        )}

        {this.pageType === "groupDetail" && (
          <GroupNavButtons
            memberListLink={memberListLink}
            openEditDrawer={openEditDrawer}
          />
        )}
      </div>
    );
  }
}
