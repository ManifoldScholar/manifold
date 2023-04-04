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
import withFilteredLists, { keywordFilter } from "hoc/withFilteredLists";
import { withTranslation } from "react-i18next";

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
    return { ...newState, ...ownProps };
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
    const t = props.t;
    let out = {
      entities: props.resources,
      unit: t("glossary.resource", {
        count: props.resourcesMeta?.pagination?.totalCount || 0
      }),
      entityComponent: ResourceRow,
      pagination: props.resourcesMeta.pagination
    };

    if (context === "collections") {
      out = {
        entities: props.resourceCollections,
        unit: t("glossary.resource_collection", {
          count: props.resourceCollectionsMeta?.pagination?.totalCount || 0
        }),
        entityComponent: ResourceCollectionRow,
        pagination: props.resourceCollectionsMeta.pagination
      };
    }

    return out;
  }

  render() {
    if (!this.props.resources || !this.props.resourceCollections) return null;
    const { entities, unit, entityComponent, pagination } = this.composeProps(
      this.state.context,
      this.props
    );
    const t = this.props.t;

    return (
      <section role="search">
        <div onMouseDown={this.handleMouseDown} role="presentation">
          <Utility.Toggle
            handleToggle={this.handleContextClick}
            selected={this.state.context}
            label="options"
            optionOne={{
              translatedLabel: t("glossary.resource_other"),
              label: "resources",
              icon: "resource24"
            }}
            optionTwo={{
              translatedLabel: t("glossary.collection_other"),
              label: "collections",
              icon: "resourceCollection64"
            }}
          />
          <div style={{ marginBlockStart: "24px" }}>
            <EntitiesList
              entityComponent={entityComponent}
              entities={entities}
              unit={unit}
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

export default withTranslation()(
  connect(NotationPickerContainer.mapStateToProps)(NotationPickerContainer)
);
