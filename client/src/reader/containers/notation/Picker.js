import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "frontend/components/utility";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import EntitiesList, {
  ResourceRow,
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";

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
      entityComponent: ResourceRow,
      pagination: props.resourcesMeta.pagination
    };

    if (context === "collections") {
      out = {
        entities: props.resourceCollections,
        singularUnit: "resource collection",
        entityComponent: ResourceCollectionRow,
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
          <EntitiesList
            entityComponent={entityComponent}
            entities={entities}
            unit={singularUnit}
            pagination={pagination}
            callbacks={{
              onPageClick: this.pageChangeHandlerCreator
            }}
            filterChangeHandler={this.filterChangeHandler}
            entityComponentProps={{
              onRowClick: this.props.selectionHandler
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
