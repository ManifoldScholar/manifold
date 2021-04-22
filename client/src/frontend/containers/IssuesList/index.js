import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import ProjectList from "frontend/components/project-list";
import Utility from "global/components/utility";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import get from "lodash/get";
import queryString from "query-string";
import omitBy from "lodash/omitBy";
import withSettings from "hoc/with-settings";
import { CSSTransition } from "react-transition-group";
import IssueGridItem from "../../components/project-list/IssueGridItem";
import { useDispatchIssues } from "hooks";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

const IssuesListContainer = ({
  authentication,
  issues,
  location = {},
  history,
  dispatch,
  subjects,
  issuesMeta,
  settings
}) => {
  useDispatchIssues(location);

  const initialFilterState = (init = {}) => {
    const result = omitBy(init, (vIgnored, k) => k === "page");
    return result;
  };

  const initialState = (init = {}) => {
    return {
      filter: { ...initialFilterState(init) },
      pagination: {
        number: init.page || defaultPage,
        size: perPage
      }
    };
  };

  const initial = initialState(queryString.parse(location.search));
  const [filter, setFilter] = useState(initial.filter);
  const [pagination, setPagination] = useState(initial.pagination);

  const updateResults = () => {
    const action = request(
      projectsAPI.index(filter, pagination),
      requests.feProjectsFiltered
    );
    dispatch(action);
  };

  const updateUrl = () => {
    const pathname = location.pathname;
    const pageParam = pagination.number;
    const params = { ...filter };
    if (pageParam !== 1) params.page = pageParam;
    const s = queryString.stringify(params);
    history.push({ pathname, search: s });
  };
  const doUpdate = () => {
    updateResults();
    updateUrl();
  };

  useEffect(() => {
    doUpdate();
  }, [filter, pagination]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasVisibleIssues = () => {
    return get(settings, "attributes.calculated.hasVisibleProjects");
  };

  const filterChangeHandler = f => {
    setFilter(f);
  };

  const handlePageChange = pageParam => {
    setPagination({ ...pagination, number: pageParam });
  };

  const pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      handlePageChange(pageParam);
    };
  };

  const showPlaceholder = () => {
    if (location.search) return false; // There are search filters applied, skip the check
    if (!issues || issues.length === 0) return true;
  };

  const renderProjectLibrary = () => {
    if (showPlaceholder()) return <ProjectList.Placeholder />;

    return (
      <section className="bg-neutral05">
        <div className="entity-section-wrapper container">
          <div className="entity-section-wrapper__header-row journals">
            <header className="entity-section-wrapper__heading section-heading">
              <div className="main">
                <Utility.IconComposer size={56} icon="projects64" />
                <div className="body">
                  <h2 className="title">{"All Journal Issues"}</h2>
                </div>
              </div>
            </header>
            <div className="entity-section-wrapper__details">
              <Utility.EntityCount
                pagination={get(issuesMeta, "pagination")}
                singularUnit="issue"
                pluralUnit="issues"
                countOnly
              />
            </div>
            <ProjectList.Filters
              showResetButton={false}
              filterChangeHandler={filterChangeHandler}
              initialFilterState={filter}
              resetFilterState={initialFilterState()}
              subjects={subjects}
            />
          </div>
          <ProjectList.Grid
            authenticated={authentication.authenticated}
            favorites={get(authentication, "currentUser.favorites")}
            dispatch={dispatch}
            pagination={get(issuesMeta, "pagination")}
            paginationClickHandler={pageChangeHandlerCreator}
            limit={perPage}
          >
            {issues.map(issue => {
              return (
                <CSSTransition key={issue.id} timeout={250}>
                  <li className="project-list__item--pos-rel">
                    <IssueGridItem
                      issue={issue}
                      hideDesc
                      hideCollectingToggle={false}
                    />
                  </li>
                </CSSTransition>
              );
            })}
          </ProjectList.Grid>
        </div>
      </section>
    );
  };

  if (!issuesMeta) return null;

  return (
    <div
      style={{
        overflowX: "hidden"
      }}
    >
      <h1 className="screen-reader-text">All Issues</h1>
      {renderProjectLibrary()}
      {hasVisibleIssues() && (
        <Layout.ButtonNavigation
          label="See All Journals"
          link="frontendJournals"
          showProjects={false}
          grayBg={false}
        />
      )}
    </div>
  );
};

IssuesListContainer.mapStateToProps = state => {
  return {
    issues: select(requests.feProjectsFiltered, state.entityStore),
    subjects: select(requests.feSubjects, state.entityStore),
    issuesMeta: meta(requests.feProjectsFiltered, state.entityStore),
    authentication: state.authentication
  };
};

IssuesListContainer.propTypes = {
  authentication: PropTypes.object,
  issues: PropTypes.array,
  location: PropTypes.object,
  history: PropTypes.object,
  dispatch: PropTypes.func,
  subjects: PropTypes.array,
  issuesMeta: PropTypes.object,
  settings: PropTypes.object
};

export default connectAndFetch(withSettings(IssuesListContainer));
