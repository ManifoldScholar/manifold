import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import List from "backend/components/list";
import Notation from "reader/components/notation";
import Utility from "frontend/components/utility";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { connect } from "react-redux";
import debounce from "lodash/debounce";

const { request } = entityStoreActions;
const perPage = 5;

export class NotationPickerContainer extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      resources: select(requests.beResources, state.entityStore),
      resourcesMeta: meta(requests.beResources, state.entityStore),
      resourceCollections: select(
        requests.beResourceCollections,
        state.entityStore
      ),
      resourceCollectionsMeta: meta(
        requests.beResourceCollections,
        state.entityStore
      )
    };
    return Object.assign({}, newState, ownProps);
  };

  static displayName = "ReaderContainer.Notation.Picker";

  static propTypes = {
    projectId: PropTypes.string,
    resources: PropTypes.array,
    resourcesMeta: PropTypes.object,
    resourceCollections: PropTypes.array,
    resourceCollectionsMeta: PropTypes.object,
    dispatch: PropTypes.func,
    selectionHandler: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      context: "resources",
      filter: {}
    };
    this.debouncedFetch = debounce(this.fetchContext.bind(this), 250);
  }

  componentDidMount() {
    this.fetchResources(1);
    this.fetchCollections(1);
  }

  fetchResources(page) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resources(
        this.props.projectId,
        this.state.filter,
        pagination
      ),
      requests.beResources
    );
    this.props.dispatch(action);
  }

  fetchCollections(page) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resourceCollections(
        this.props.projectId,
        this.state.filter,
        pagination
      ),
      requests.beResourceCollections
    );
    this.props.dispatch(action);
  }

  fetchContext(page) {
    if (this.state.context === "collections")
      return this.fetchCollections(page);
    return this.fetchResources(page);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.debouncedFetch(1);
    });
  };

  handleContextClick = () => {
    if (this.state.context === "collections")
      return this.setState({ context: "resources" });
    return this.setState({ context: "collections" });
  };

  handleUsersPageChange(event, page) {
    event.preventDefault();
    this.fetchContext(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleUsersPageChange(event, page);
    };
  };

  handleMouseDown(event) {
    event.stopPropagation();
  }

  composeProps(context, props) {
    let out = {
      entities: props.resources,
      singularUnit: "resource",
      pluralUnit: "resources",
      entityComponent: Notation.Resource.PickerListItem,
      pagination: props.resourcesMeta.pagination
    };

    if (context === "collections") {
      out = {
        entities: props.resourceCollections,
        singularUnit: "resource collection",
        pluralUnit: "resource collections",
        entityComponent: Notation.ResourceCollection.PickerListItem,
        pagination: props.resourceCollectionsMeta.pagination
      };
    }

    return out;
  }

  render() {
    if (!this.props.resources || !this.props.resourceCollections) return null;
    const {
      entities,
      singularUnit,
      pluralUnit,
      entityComponent,
      pagination
    } = this.composeProps(this.state.context, this.props);

    return (
      <section role="search">
        <div onMouseDown={this.handleMouseDown} role="presentation">
          <Utility.Toggle
            handleToggle={this.handleContextClick}
            selected={this.state.context}
            label="options"
            optionOne={{
              label: "resources",
              iconClass: "manicon-cube-outline"
            }}
            optionTwo={{
              label: "collections",
              iconClass: "manicon-file-box"
            }}
          />
          <List.Searchable
            entities={entities}
            singularUnit={singularUnit}
            pluralUnit={pluralUnit}
            pagination={pagination}
            paginationClickHandler={this.pageChangeHandlerCreator}
            paginationClass="secondary"
            entityComponent={entityComponent}
            filterChangeHandler={this.filterChangeHandler}
            paginationPadding={2}
            entityComponentProps={{
              selectionHandler: this.props.selectionHandler
            }}
          />
        </div>
      </section>
    );
  }
}

export default connect(NotationPickerContainer.mapStateToProps)(
  NotationPickerContainer
);
