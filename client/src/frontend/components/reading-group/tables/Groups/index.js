import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Table from "global/components/table";
import Column from "global/components/table/Column";
import NestedLink from "global/components/table/NestedLink";
import LinkedName from "global/components/table/LinkedName";
import InlineValue from "global/components/table/InlineValue";
import IconComposer from "global/components/utility/IconComposer";
import { ArchiveGroup, EditGroup, JoinGroup } from "./actions";
import { ListFilters } from "global/components/list";
import lh from "helpers/linkHandler";
import { useListFilters } from "hooks";
import { useHistory } from "react-router-dom";

export default function GroupsTable(props) {
  const {
    readingGroups: groups,
    pagination,
    onPageClick,
    filterProps,
    currentUser,
    hideActions,
    hideTags
  } = props;

  const listFilterProps = useListFilters({
    ...filterProps,
    options: { groupSort: true }
  });

  const history = useHistory();

  const userCanJoin = group => {
    if (group.attributes.currentUserRole !== "none") return false;
    return !!group.links.join?.href;
  };

  const handleJoinSuccess = group => {
    history.push(lh.link("frontendReadingGroupDetail", group.id));
  };

  return (
    <Table
      models={groups}
      pagination={pagination}
      onPageClick={onPageClick}
      unit="group"
      linkCreator={group => lh.link("frontendReadingGroupDetail", group.id)}
      filters={<ListFilters {...listFilterProps} />}
    >
      <Column header="Name" textStyle="valueLarge" columnPosition="all">
        {({ model, hovering }) => {
          return (
            <>
              <LinkedName
                name={model.attributes.name}
                to={lh.link("frontendReadingGroupDetail", model.id)}
                tag={!hideTags ? model.attributes.privacy : null}
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
      {currentUser && (
        <Column header="Role" columnPosition="left" cellSize="cellFitContent">
          {({ model }) => {
            const showJoin = userCanJoin(model);
            return showJoin ? (
              <JoinGroup
                readingGroup={model}
                onSuccess={() => handleJoinSuccess(model)}
                outlined
              />
            ) : (
              model.attributes.currentUserRole
            );
          }}
        </Column>
      )}
      <Column header="Members" cellSize="cellFitContent">
        {({ model }) => {
          const wrapInLink = !userCanJoin(model);
          const count = model.attributes.membershipsCount;
          return wrapInLink ? (
            <NestedLink link={lh.link("frontendReadingGroupMembers", model.id)}>
              {count}
            </NestedLink>
          ) : (
            count
          );
        }}
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
              label={model.attributes.commentsCount}
              icon="interactComment24"
              srLabel={`${model.attributes.commentsCount} comments.`}
            />
          </>
        )}
      </Column>
      {!hideActions && (
        <Column header="Actions" cellSize={"cellFitContent"}>
          {({ model }) => (
            <div className="table__actions">
              <EditGroup readingGroup={model} />
              <ArchiveGroup readingGroup={model} />
            </div>
          )}
        </Column>
      )}
    </Table>
  );
}

GroupsTable.displayName = "ReadingGroup.Table.Groups";

GroupsTable.propTypes = {
  readingGroups: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  onPageClick: PropTypes.func.isRequired,
  filterProps: PropTypes.object,
  currentUser: PropTypes.object,
  hideActions: PropTypes.bool,
  hideTags: PropTypes.bool
};
