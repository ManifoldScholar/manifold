import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "global/components/table/index";
import Column from "global/components/table/Column";
import Avatar from "global/components/avatar";
import LinkedName from "global/components/table/LinkedName";
import InlineValue from "global/components/table/InlineValue";
import IconComposer from "global/components/utility/IconComposer";
import NoteStyle from "./NoteStyle";
import { RemoveMember, EditMember } from "./actions";
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
    onEditMember: PropTypes.func.isRequired,
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
    const { readingGroup, onRemoveMember, onEditMember } = this.props;

    return (
      <Table
        models={this.members}
        pagination={this.pagination}
        onPageClick={this.onPageClick}
        singularUnit={"Member"}
        pluralUnit={"Members"}
        linkCreator={model =>
          lh.link("frontendReadingGroupAnnotations", readingGroup.id, {
            page: 1,
            readingGroupMembership: model.id
          })
        }
      >
        <Column
          header={"Member Name"}
          textStyle={"valueLarge"}
          columnPosition={"all"}
        >
          {({ model, hovering }) => {
            return (
              <>
                <Avatar
                  iconSize={24}
                  url={this.avatarUrl(model)}
                  className={classNames({
                    table__avatar: true,
                    "table__avatar--image": this.avatarUrl(model),
                    "table__avatar--placeholder": !this.avatarUrl(model)
                  })}
                />
                <LinkedName
                  name={this.nameFor(model)}
                  to={lh.link(
                    "frontendReadingGroupAnnotations",
                    readingGroup.id,
                    {
                      page: 1,
                      readingGroupMembership: model.id
                    }
                  )}
                  tag={model.attributes.label}
                  hovering={hovering}
                />
                <IconComposer
                  icon="arrowRight16"
                  size={20}
                  iconClass={classNames({
                    "table__link-arrow": true,
                    "table__link-arrow--active": hovering
                  })}
                />
              </>
            );
          }}
        </Column>
        <Column
          header="Role"
          columnPosition={"left"}
          cellSize={"cellFitContent"}
        >
          {({ model }) => this.roleFor(model)}
        </Column>
        <Column header="Activity" cellSize={"cellFitContent"}>
          {({ model }) => (
            <>
              <InlineValue
                label={model.attributes.annotationsCount}
                icon="interactAnnotate24"
                srLabel={`${model.attributes.annotationsCount} annotations.`}
              />
              <InlineValue
                label={model.attributes.highlightsCount}
                icon="interactHighlight24"
                srLabel={`${model.attributes.highlightsCount} highlights.`}
              />
              <InlineValue
                label={model.attributes.commentsCount || 9}
                icon="interactComment24"
                srLabel={`${model.attributes.commentsCount || 9} comments.`}
              />
            </>
          )}
        </Column>
        <Column header="Note Style" cellSize={"cellFitContent"}>
          {({ model }) => <NoteStyle membership={model} />}
        </Column>
        <Column header="Actions" cellSize={"cellFitContent"}>
          {({ model }) => {
            if (model.attributes.currentUserIsCreator) return null;
            return (
              <Authorize entity={this.props.readingGroup} ability={"update"}>
                <div className="table__actions">
                  <EditMember onClick={() => onEditMember(model)} />
                  <RemoveMember onClick={() => onRemoveMember(model)} />
                </div>
              </Authorize>
            );
          }}
        </Column>
      </Table>
    );
  }
}
