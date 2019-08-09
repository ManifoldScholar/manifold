import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "global/components/table";
import Column from "global/components/table/Column";
import NestedLink from "global/components/table/NestedLink";
import NameWithArrow from "global/components/table/NameWithArrow";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";

export default class GroupsTable extends PureComponent {
  static propTypes = {
    groups: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired
  };

  get groups() {
    return this.props.groups;
  }

  get pagination() {
    return this.props.pagination;
  }

  get onPageClick() {
    return this.props.onPageClick;
  }

  get lockIconClassNames() {
    return "table__private-icon";
  }

  get alignCenter() {
    return "center";
  }

  get cellMedium() {
    return "cellMedium";
  }

  render() {
    return (
      <Table
        models={this.groups}
        pagination={this.pagination}
        onPageClick={this.onPageClick}
        countLabel={"Groups"}
        linkCreator={group => lh.link("readingGroupDetail", group.id)}
      >
        <Column header="Name" textStyle={"valueLarge"} columnPosition={"all"}>
          {({ model }) => {
            return <NameWithArrow name={model.attributes.name} />;
          }}
        </Column>

        <Column
          header="Type"
          columnPosition={"left"}
          cellSize={this.cellMedium}
        >
          {({ model }) => (
            <React.Fragment>
              {model.attributes.privacy}
              {model.attributes.privacy === "private" && (
                <Utility.IconComposer
                  icon="lock16"
                  size={16}
                  iconClass={this.lockIconClassNames}
                />
              )}
            </React.Fragment>
          )}
        </Column>

        <Column
          header="Role"
          columnPosition={"left"}
          cellSize={this.cellMedium}
        >
          {({ model }) => model.attributes.role}
        </Column>

        <Column
          header="Members"
          headerIcon="avatar24"
          align={this.alignCenter}
          columnPosition={"right"}
          rowPosition={2}
        >
          {({ model }) => (
            <NestedLink link={lh.link("readingGroupMembers", model.id)}>
              {model.attributes.membershipsCount}
            </NestedLink>
          )}
        </Column>

        <Column
          header="Annotations"
          headerIcon="comment24"
          align={this.alignCenter}
          columnPosition={"right"}
        >
          {({ model }) => model.attributes.annotationsCount}
        </Column>

        <Column
          header="Highlights"
          headerIcon="annotate24"
          align={this.alignCenter}
          columnPosition={"right"}
        >
          {({ model }) => model.attributes.highlightsCount}
        </Column>
      </Table>
    );
  }
}
