import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { withTranslation } from "react-i18next";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { subjectsAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  SubjectRow
} from "backend/components/list/EntitiesList";

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
    dispatch: PropTypes.func,
    t: PropTypes.func
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
    const { match, t } = this.props;

    if (!this.props.subjects) return null;
    const { subjects, subjectsMeta } = this.props;
    const active = match.params.id;

    const drawerProps = {
      closeUrl: lh.link("backendSettingsSubjects"),
      lockScroll: "always"
    };

    return (
      <>
        {childRoutes(this.props.route, { drawer: true, drawerProps })}
        {subjects && (
          <EntitiesList
            entityComponent={SubjectRow}
            entityComponentProps={{ active }}
            title={t("actions.manage_subjects")}
            titleStyle="bar"
            entities={subjects}
            unit={t("glossary.subject", {
              count: subjectsMeta?.pagination?.totalCount
            })}
            pagination={subjectsMeta.pagination}
            showCountInHeader
            callbacks={{
              onPageClick: this.subjectsPageChangeHandlerCreator
            }}
            buttons={[
              <Button
                path={lh.link("backendSettingsSubjectsNew")}
                text={t("settings.subjects.add_button_label")}
                authorizedFor="subject"
                type="add"
              />
            ]}
          />
        )}
      </>
    );
  }
}

export default withTranslation()(
  connectAndFetch(SettingsSubjectsListContainer)
);
