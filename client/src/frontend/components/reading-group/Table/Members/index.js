import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "global/components/table/index";
import Column from "global/components/table/Column";
import Avatar from "global/components/avatar";
import LinkedName from "global/components/table/LinkedName";
import InlineValue from "global/components/table/InlineValue";
import RemoveMemberButton from "./RemoveMember";
import get from "lodash/get";
import classNames from "classnames";
import Authorize from "hoc/authorize";
import lh from "helpers/linkHandler";

export default class MembersTable extends PureComponent {
  static propTypes = {
    members: PropTypes.array.isRequired,
    readingGroup: PropTypes.object.isRequired,
    pagination: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired,
    onRemoveMember: PropTypes.func.isRequired
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
    return get(
      model,
      "relationships.user.attributes.avatarStyles.mediumSquare"
    );
  }

  roleFor(readingGroupMembership) {
    if (!readingGroupMembership.relationships.user) return "member";
    const { readingGroup } = this.props;
    return readingGroupMembership.relationships.user.id ===
      readingGroup.attributes.creatorId
      ? "creator"
      : "member";
  }

  nameFor(readingGroupMembership) {
    return readingGroupMembership.attributes.name;
  }

  render() {
    const { readingGroup, onRemoveMember } = this.props;

    return (
      <Table
        models={this.members}
        pagination={this.pagination}
        onPageClick={this.onPageClick}
        singularUnit={"Member"}
        pluralUnit={"Members"}
        linkCreator={model =>
          lh.link("frontendReadingGroupDetail", readingGroup.id, {
            readingGroupMembership: model.id
          })
        }
      >
        <Column
          viewportVisibility="hideMobile"
          cellPadding="rightUnpadded"
          align="right"
          cellSize="cellSmall"
        >
          {({ model }) => (
            <Avatar
              iconSize={24}
              url={this.avatarUrl(model)}
              className={classNames({
                table__avatar: true,
                "table__hide-mobile": true,
                "table__avatar--image": this.avatarUrl(model),
                "table__avatar--placeholder": !this.avatarUrl(model)
              })}
            />
          )}
        </Column>
        <Column
          header={"Name"}
          textStyle={"valueLarge"}
          columnPosition={"all"}
          cellPadding={"leftSmall"}
        >
          {({ model }) => {
            return (
              <>
                <Avatar
                  iconSize={24}
                  url={this.avatarUrl(model)}
                  className={classNames({
                    table__avatar: true,
                    "table__hide-desktop": true,
                    "table__avatar--image": this.avatarUrl(model),
                    "table__avatar--placeholder": !this.avatarUrl(model)
                  })}
                />
                <LinkedName
                  name={this.nameFor(model)}
                  to={lh.link("frontendReadingGroupDetail", readingGroup.id, {
                    readingGroupMembership: model.id
                  })}
                />
              </>
            );
          }}
        </Column>
        <Column header="Role" columnPosition={"left"} cellSize={"cellMedium"}>
          {({ model }) => this.roleFor(model)}
        </Column>
        <Column header="Notations" align="center">
          {({ model }) => (
            <>
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
            </>
          )}
        </Column>
        <Column key="actions" columnPosition={"left"} cellSize={"cellMedium"}>
          {({ model }) => {
            if (model.attributes.isCreator) return null;
            return (
              <Authorize entity={this.props.readingGroup} ability={"update"}>
                <RemoveMemberButton
                  readingGroupMembership={model}
                  onRemoveMember={onRemoveMember}
                />
              </Authorize>
            );
          }}
        </Column>
      </Table>
    );
  }
}
