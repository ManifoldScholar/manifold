import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { subjectsAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { Subject, List, Layout } from "components/backend";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";

const { request } = entityStoreActions;
const perPage = 10;

export class SettingsSubjectsListContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      subjects: select(requests.beSubjects, state.entityStore),
      subjectsMeta: meta(requests.beSubjects, state.entityStore)
    };
  };

  static displayName = "Settings.Subjects.List";
  static propTypes = {
    subjects: PropTypes.array,
    subjectsMeta: PropTypes.object,
    match: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor() {
    super();
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.fetchSubjects = debounce(this.fetchSubjects.bind(this), 250, {
      leading: false,
      trailing: true
    });
  }

  componentDidMount() {
    this.fetchSubjects(1);
  }

  componentDidUpdate(prevProps) {
    this.maybeReload(prevProps.subjectsMeta);
  }

  maybeReload(prevSubjectsMeta) {
    const currentModified = get(this.props, "subjectsMeta.modified");
    const previousModified = get(prevSubjectsMeta, "modified");
    if (!currentModified) return;
    if (currentModified && previousModified) return;
    this.fetchSubjects(this.lastFetchedPage);
  }

  fetchSubjects(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      subjectsAPI.index(this.state.filter, pagination),
      requests.beSubjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.fetchSubjects(1);
    });
  };

  handleSubjectsPageChange(event, page) {
    this.fetchSubjects(page);
  }

  subjectsPageChangeHandlerCreator = page => {
    return event => {
      this.handleSubjectsPageChange(event, page);
    };
  };

  render() {
    const { match } = this.props;

    if (!this.props.subjects) return null;
    const { subjects, subjectsMeta } = this.props;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendSettingsSubjects")
    };

    return (
      <div>
        <Layout.ViewHeader>Project Subjects</Layout.ViewHeader>
        <Layout.BackendPanel>
          {childRoutes(this.props.route, { drawer: true, drawerProps })}
          {subjects ? (
            <List.Searchable
              newButton={{
                path: lh.link("backendSettingsSubjectsNew"),
                text: "Add a New Subject",
                authorizedFor: "subject"
              }}
              entities={subjects}
              singularUnit="subject"
              pluralUnit="subjects"
              pagination={subjectsMeta.pagination}
              paginationClickHandler={this.subjectsPageChangeHandlerCreator}
              paginationClass="secondary"
              entityComponent={Subject.ListItem}
              entityComponentProps={{ active }}
              filterChangeHandler={this.filterChangeHandler}
            />
          ) : null}
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connectAndFetch(SettingsSubjectsListContainer);
