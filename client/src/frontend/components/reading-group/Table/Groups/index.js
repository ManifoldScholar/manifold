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
import withScreenReaderStatus from "hoc/with-screen-reader-status";

class GroupsTable extends PureComponent {
  static displayName = "ReadingGroup.Table.Groups";

  static propTypes = {
    groups: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object.isRequired,
    resetFilterState: PropTypes.func.isRequired,
    filterChangeHandler: PropTypes.func.isRequired,
    hideActions: PropTypes.bool,
    hideTags: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
    this.searchInput = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return { ...nextProps.initialFilterState };
    }

    return null;
  }

  get showResetButton() {
    return !isEmpty(this.state.filters);
  }

  get resetMessage() {
    return "Search and filters reset.";
  }

  get groups() {
    return this.props.groups;
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
      inputRef: this.searchInput,
      value: this.state.filters.keyword || "",
      onChange: event => this.setFilters(event, "keyword")
    };
  }

  get sortFilter() {
    return {
      label: "Sort results",
      value: this.state.filters.order || "",
      onChange: event => this.setFilters(event, "order"),
      options: [
        {
          label: "Sort by:",
          value: ""
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

  resetFilters = event => {
    event.preventDefault();
    const newState = this.props.resetFilterState
      ? { filters: { ...this.props.resetFilterState } }
      : this.initialState();
    this.setState(newState, this.updateResults);
    // update SR message
    this.props.setScreenReaderStatus(this.resetMessage);
    // focus on search field
    this.searchInput.current.focus();
  };

  updateResults = event => {
    if (event) event.preventDefault();
    const filter = omitBy(this.state.filters, value => value === "");
    this.props.filterChangeHandler(filter);
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
        <Column header="Role" columnPosition="left" cellSize="cellFitContent">
          {({ model }) => {
            const showJoin = this.userCanJoin(model);
            return showJoin ? (
              <JoinGroup readingGroup={model} />
            ) : (
              model.attributes.currentUserRole
            );
          }}
        </Column>
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

export default withScreenReaderStatus(GroupsTable);
