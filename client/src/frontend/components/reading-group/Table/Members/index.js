import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "global/components/table/index";
import Column from "global/components/table/Column";
import Avatar from "global/components/avatar";
import NameWithArrow from "global/components/table/NameWithArrow";
import RemoveMemberButton from "./RemoveMember";
import get from "lodash/get";
import classNames from "classnames";

export default class MembersTable extends PureComponent {
  static propTypes = {
    members: PropTypes.array.isRequired,
    readingGroup: PropTypes.object.isRequired
  };

  get members() {
    return this.props.members;
  }

  get pagination() {
    return this.props.pagination;
  }

  get onPageClick() {
    return this.props.onPageClick;
  }

  get alignCenter() {
    return "center";
  }

  avatarUrl(model) {
    return get(model, "relationships.user.attributes.avatarStyles.mediumSquare");
  }

  roleFor(readingGroupMembership) {
    const { readingGroup } = this.props;
    return readingGroupMembership.relationships.user.id ===
      readingGroup.attributes.creatorId
      ? "creator"
      : "member";
  }

  render() {
    const { readingGroup } = this.props;

    return (
      <Table
        models={this.members}
        pagination={this.pagination}
        onPageClick={this.onPageClick}
        countLabel={"Members"}
      >
        <Column
          viewportVisibility="hideMobile"
          cellPadding="rightUnpadded"
          align="right"
          cellSize="cellSmall"
        >
          {({ model }) => (
            <Avatar
              url={this.avatarUrl(model)}
              className={
                classNames({
                  "table__avatar": true,
                  "table__hide-mobile": true,
                  "table__avatar--image": this.avatarUrl(model),
                  "table__avatar--placeholder": !this.avatarUrl(model)
                })
              }
            />
          )}
        </Column>
        <Column
          header={"Name"}
          textStyle={"valueLarge"}
          index={1}
          columnPosition={"all"}
          cellPadding={"leftSmall"}
        >
          {({ model }) => {
            return (
              <React.Fragment>
                <Avatar
                  url={this.avatarUrl(model)}
                  className={
                    classNames({
                      "table__avatar": true,
                      "table__hide-desktop": true,
                      "table__avatar--image": this.avatarUrl(model),
                      "table__avatar--placeholder": !this.avatarUrl(model)
                    })
                  }
                />
                <NameWithArrow
                  name={get(model, "relationships.user.attributes.fullName")}
                />
              </React.Fragment>
            );
          }}
        </Column>
        <Column
          header="Role"
          index={2}
          columnPosition={"left"}
          cellSize={"cellMedium"}
        >
          {({ model }) => this.roleFor(model)}
        </Column>
        <Column
          header="Annotations"
          headerIcon="comment24"
          align={this.alignCenter}
          index={3}
          columnPosition={"right"}
        >
          {({ model }) => model.attributes.annotationsCount}
        </Column>
        <Column
          header="Highlights"
          headerIcon="annotate24"
          align={this.alignCenter}
          index={4}
          columnPosition={"right"}
        >
          {({ model }) => model.attributes.highlightsCount}
        </Column>
        <Column
          index={5}
          columnPosition={"left"}
          rowPosition={3}
          cellSize={"cellMedium"}
        >
          {({ model }) => <RemoveMemberButton />}
        </Column>
      </Table>
    );
  }
}
