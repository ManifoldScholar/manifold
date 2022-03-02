import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
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
import lh from "helpers/linkHandler";
import Authorization from "helpers/authorization";

class MembersTable extends PureComponent {
  static displayName = "ReadingGroup.Table.Members";

  static propTypes = {
    members: PropTypes.array.isRequired,
    readingGroup: PropTypes.object.isRequired,
    pagination: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired,
    onRemoveMember: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  get readingGroup() {
    return this.props.readingGroup;
  }

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

  roleFor(membership) {
    const { role } = membership.attributes;
    const t = this.props.t;
    if (!membership.relationships.user) return t("glossary.member_one");
    const isCreator = this.userIsGroupCreator(membership);
    return isCreator ? t("glossary.creator_one") : role;
  }

  userIsGroupCreator(membership) {
    return (
      membership.relationships.user.id ===
      this.readingGroup.attributes.creatorId
    );
  }

  nameFor(membership) {
    return membership.attributes.name;
  }

  getUpdateAuthorizationStatus({ entity, ability }) {
    return this.authorization.authorize({ entity, ability });
  }

  render() {
    const { readingGroup, onRemoveMember, t } = this.props;

    return (
      <Table
        models={this.members}
        pagination={this.pagination}
        onPageClick={this.onPageClick}
        unit={t("glossary.member", { count: this.members.length })}
        linkCreator={model =>
          lh.link("frontendReadingGroupAnnotations", readingGroup.id, {
            page: 1,
            readingGroupMembership: model.id
          })
        }
      >
        <Column
          header={t("tables.reading_group_members.headers.name")}
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
                  className={classNames({
                    "table__link-arrow": true,
                    "table__link-arrow--active": hovering
                  })}
                />
              </>
            );
          }}
        </Column>
        <Column
          header={t("tables.reading_group_members.headers.role")}
          columnPosition={"left"}
          cellSize={"cellFitContent"}
        >
          {({ model }) => this.roleFor(model)}
        </Column>
        <Column
          header={t("tables.reading_group_members.headers.activity")}
          cellSize={"cellFitContent"}
        >
          {({ model }) => (
            <>
              <InlineValue
                label={model.attributes.annotationsCount}
                icon="interactAnnotate24"
                srLabel={`${model.attributes.annotationsCount} ${t(
                  "glossary.annotation",
                  {
                    count: model.attributes.annotationsCount
                  }
                )}.`}
              />
              <InlineValue
                label={model.attributes.highlightsCount}
                icon="interactHighlight24"
                srLabel={`${model.attributes.highlightsCount} ${t(
                  "glossary.highlight",
                  {
                    count: model.attributes.highlightsCount
                  }
                )}.`}
              />
              <InlineValue
                label={model.attributes.commentsCount}
                icon="interactComment24"
                srLabel={`${model.attributes.commentsCount} ${t(
                  "glossary.comment",
                  {
                    count: model.attributes.commentsCount
                  }
                )}.`}
              />
            </>
          )}
        </Column>
        <Column
          header={t("tables.reading_group_members.headers.note_style")}
          cellSize={"cellFitContent"}
        >
          {({ model }) => <NoteStyle membership={model} />}
        </Column>
        {this.getUpdateAuthorizationStatus({
          entity: this.props.readingGroup,
          ability: "update"
        }) && (
          <Column
            header={t("tables.reading_group_members.headers.actions")}
            cellSize={"cellFitContent"}
          >
            {({ model }) => {
              const isCreator = this.userIsGroupCreator(model);
              return (
                <div className="table__actions">
                  <EditMember
                    membership={model}
                    readingGroup={this.props.readingGroup}
                  />
                  {!isCreator && (
                    <RemoveMember onClick={() => onRemoveMember(model)} />
                  )}
                </div>
              );
            }}
          </Column>
        )}
      </Table>
    );
  }
}

export default withTranslation()(MembersTable);
