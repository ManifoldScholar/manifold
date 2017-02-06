import React, { PureComponent, PropTypes } from 'react';
import { Form, List } from 'components/backend';
import { Resource } from 'components/reader';
import { Form as FormContainer } from 'containers/backend';
import update from 'immutability-helper';
import set from 'lodash/set';
import { projectsAPI } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { connect } from 'react-redux';

const { select, meta } = entityUtils;
const { request } = entityStoreActions;
const perPage = 4;

class ResourcePickerContainer extends PureComponent {

  static displayName = "ProjectDetail.Resources";
  static activeNavItem = "resources";

  static mapStateToProps(state, ownProps) {
    const newState = {
      resources: select("project-resources", state.entityStore),
      resourcesMeta: meta("project-resources", state.entityStore),
    };
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    route: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func,
    selectionHandler: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchResources(1);
  }

  fetchResources(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resources(this.props.projectId, this.state.filter, pagination),
      'project-resources'
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.fetchResources(1);
    });
  }

  handleUsersPageChange(event, page) {
    this.fetchResources(page);
  }

  pageChangeHandlerCreator(page) {
    return (event) => {
      this.handleUsersPageChange(event, page);
    };
  }

  handleMouseDown(event) {
    event.stopPropagation();
  }

  render() {
    if (!this.props.resources) return null;

    return (
      <section onMouseDown={this.handleMouseDown}>
        <List.Searchable
          entities={this.props.resources}
          singularUnit="resource"
          pluralUnit="resources"
          listClassName="compact"
          pagination={this.props.resourcesMeta.pagination}
          paginationClickHandler={this.pageChangeHandlerCreator}
          entityComponent={Resource.PickerListItem}
          filterChangeHandler={this.filterChangeHandler}
          paginationPadding={2}
          entityComponentProps={{ selectionHandler: this.props.selectionHandler }}
        />
      </section>
    );
  }
}

export default connect(
  ResourcePickerContainer.mapStateToProps
)(ResourcePickerContainer);

