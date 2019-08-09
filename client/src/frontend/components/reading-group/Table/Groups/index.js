import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "global/components/table";
import Column from "global/components/table/Column";
import NestedLink from "global/components/table/NestedLink";
import LinkedName from "global/components/table/LinkedName";
import InlineValue from "global/components/table/InlineValue";
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

  render() {
    return (
      <Table
        models={this.groups}
        pagination={this.pagination}
        onPageClick={this.onPageClick}
        singularUnit="Group"
        pluralUnit="Groups"
        linkCreator={group => lh.link("frontendReadingGroupDetail", group.id)}
      >
        <Column header="Name" textStyle="valueLarge" columnPosition="all">
          {({ model }) => {
            return (
              <LinkedName
                name={model.attributes.name}
                to={lh.link("frontendReadingGroupDetail", model.id)}
                tag={model.attributes.privacy}
              />
            );
          }}
        </Column>
        <Column
          header="Role"
          columnPosition={"left"}
          cellSize={this.cellMedium}
        >
          {({ model }) => model.attributes.currentUserRole}
        </Column>
        <Column
          header="Members"
          headerIcon="avatar24"
          align="center"
          rowPosition={2}
        >
          {({ model }) => (
            <NestedLink link={lh.link("frontendReadingGroupMembers", model.id)}>
              {model.attributes.membershipsCount}
            </NestedLink>
          )}
        </Column>

        <Column header="Notations" align="center">
          {({ model }) => (
            <React.Fragment>
              <InlineValue
                label={model.attributes.annotationsCount}
                icon="comment24"
                srLabel={`${model.attributes.annotationsCount} annotations.`}
              />
              <InlineValue
                label={model.attributes.highlightsCount}
                icon="annotate24"
                srLabel={`${model.attributes.highlightsCount} highlights.`}
              />
            </React.Fragment>
          )}
        </Column>
      </Table>
    );
  }
}
