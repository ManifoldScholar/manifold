import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import Table from "global/components/table";
import Column from "global/components/table/Column";
import NestedLink from "global/components/table/NestedLink";
import LinkedName from "global/components/table/LinkedName";
import InlineValue from "global/components/table/InlineValue";
import IconComposer from "global/components/utility/IconComposer";
import { ArchiveGroup, EditGroup, JoinGroup } from "./actions";
import { ListFilters } from "global/components/list";
import lh from "helpers/linkHandler";

class GroupsTable extends PureComponent {
  static displayName = "ReadingGroup.Table.Groups";

  static propTypes = {
    readingGroups: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object.isRequired,
    resetFilterState: PropTypes.func.isRequired,
    filterChangeHandler: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    history: PropTypes.object,
    hideActions: PropTypes.bool,
    hideTags: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return { ...nextProps.initialFilterState };
    }

    return null;
  }

  get showResetButton() {
    const filterValues = Object.values(this.state.filters);
    const appliedFilters = filterValues.filter(Boolean);
    return !isEmpty(appliedFilters);
  }

  get groups() {
    return this.props.readingGroups;
  }

  get currentUser() {
    return this.props.currentUser;
  }

  get pagination() {
    return this.props.pagination;
  }

  get onPageClick() {
    return this.props.onPageClick;
  }

  get showActions() {
    return !this.props.hideActions;
  }

  get showTags() {
    return !this.props.hideTags;
  }

  get searchProps() {
    return {
      value: this.state.filters.keyword || "",
      onChange: event => this.setFilters(event, "keyword")
    };
  }

  get sortFilter() {
    return {
      label: "Sort results",
      value: this.state.filters.sort_order || "",
      onChange: event => this.setFilters(event, "sort_order"),
      options: [
        {
          label: "Sort by:",
          value: ""
        },
        {
          label: "A–Z",
          value: "name_asc"
        },
        {
          label: "Z–A",
          value: "name_desc"
        },
        {
          label: "Newest groups first",
          value: "created_at_asc"
        },
        {
          label: "Oldest groups first",
          value: "created_at_desc"
        },
        {
          label: "Earliest course start date",
          value: "course_starts_on_asc"
        },
        {
          label: "Latest course start date",
          value: "course_starts_on_desc"
        },
        {
          label: "Earliest course end date",
          value: "course_ends_on_asc"
        },
        {
          label: "Latest course end date",
          value: "course_ends_on_desc"
        }
      ]
    };
  }

  get filters() {
    return [this.sortFilter];
  }

  userCanJoin(group) {
    if (group.attributes.currentUserRole !== "none") return false;
    return !!group.links.join?.href;
  }

  setFilters = (event, label) => {
    event.preventDefault();
    const value = event.target.value;
    const filters = { ...this.state.filters };
    filters[label] = value;
    if (label === "keyword") return this.setState({ filters });
    return this.setState({ filters }, this.updateResults);
  };

  initialState(init) {
    const filters = { ...init };
    return { filters };
  }

  resetFilters = () => {
    const newState = this.props.resetFilterState
      ? { filters: { ...this.props.resetFilterState } }
      : this.initialState();
    this.setState(newState, this.updateResults);
  };

  updateResults = event => {
    if (event) event.preventDefault();
    const filter = omitBy(this.state.filters, value => value === "");
    this.props.filterChangeHandler(filter);
  };

  handleJoinSuccess = group => {
    this.props.history.push(lh.link("frontendReadingGroupDetail", group.id));
  };

  render() {
    return (
      <Table
        models={this.groups}
        pagination={this.pagination}
        onPageClick={this.onPageClick}
        singularUnit="Group"
        pluralUnit="Groups"
        linkCreator={group => lh.link("frontendReadingGroupDetail", group.id)}
        filters={
          <ListFilters
            searchProps={this.searchProps}
            filters={this.filters}
            onSubmit={this.updateResults}
            onReset={this.resetFilters}
            showResetButton={this.showResetButton}
          />
        }
      >
        <Column header="Name" textStyle="valueLarge" columnPosition="all">
          {({ model, hovering }) => {
            return (
              <>
                <LinkedName
                  name={model.attributes.name}
                  to={lh.link("frontendReadingGroupDetail", model.id)}
                  tag={this.showTags ? model.attributes.privacy : null}
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
        {this.currentUser && (
          <Column header="Role" columnPosition="left" cellSize="cellFitContent">
            {({ model }) => {
              const showJoin = this.userCanJoin(model);
              return showJoin ? (
                <JoinGroup
                  readingGroup={model}
                  onSuccess={() => this.handleJoinSuccess(model)}
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
            const wrapInLink = !this.userCanJoin(model);
            const count = model.attributes.membershipsCount;
            return wrapInLink ? (
              <NestedLink
                link={lh.link("frontendReadingGroupMembers", model.id)}
              >
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
        {this.showActions && (
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
}

export default GroupsTable;
