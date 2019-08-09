import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "global/components/table/index";
import Column from "global/components/table/Column";
import TableAvatar from "global/components/table/Avatar";
import NameWithArrow from "global/components/table/NameWithArrow";
import RemoveMemberButton from "./RemoveMember";

export default class MembersTable extends PureComponent {
  static propTypes = {
    members: PropTypes.array.isRequired
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

  render() {
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
            <TableAvatar
              avatar={
                model.relationships.user.attributes.avatarStyles.mediumSquare
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
                <TableAvatar
                  avatar={this.avatarUrl}
                  viewportVisibility="hideDesktop"
                />
                <NameWithArrow
                  name={model.relationships.user.attributes.fullName}
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
          {({ model }) => model.relationships.user.attributes.role}
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
