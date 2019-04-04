import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "frontend/components/utility";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { connect } from "react-redux";
import EntitiesList, {
  Search,
  ResourceRow,
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { keywordFilter } from "hoc/with-filtered-lists";

const { request } = entityStoreActions;
const perPage = 5;

export class NotationPickerContainerImplementation extends PureComponent {
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
      context: "resources"
    };
  }

  componentDidMount() {
    this.fetchResources();
    this.fetchCollections();
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchContext();
  }

  get filters() {
    return this.props.entitiesListSearchParams.notations || {};
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  fetchResources(page = 1) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resources(this.props.projectId, this.filters, pagination),
      requests.beResources
    );
    this.props.dispatch(action);
  }

  fetchCollections(page = 1) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resourceCollections(
        this.props.projectId,
        this.filters,
        pagination
      ),
      requests.beResourceCollections
    );
    this.props.dispatch(action);
  }

  fetchContext(page = 1) {
    if (this.state.context === "collections")
      return this.fetchCollections(page);
    return this.fetchResources(page);
  }

  handleContextClick = () => {
    const { onReset } = this.props.entitiesListSearchProps("notations");
    const context =
      this.state.context === "collections" ? "resources" : "collections";
    this.setState({ context }, onReset);
  };

  pageChangeHandlerCreator = page => {
    return () => this.fetchContext(page);
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
              icon: "resource24"
            }}
            optionTwo={{
              label: "collections",
              icon: "resourceCollection64"
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
            entityComponentProps={{
              onRowClick: this.props.selectionHandler
            }}
            search={
              <Search {...this.props.entitiesListSearchProps("notations")} />
            }
          />
        </div>
      </section>
    );
  }
}

export const NotationPickerContainer = withFilteredLists(
  NotationPickerContainerImplementation,
  {
    notations: keywordFilter()
  }
);

export default connect(NotationPickerContainer.mapStateToProps)(
  NotationPickerContainer
);
