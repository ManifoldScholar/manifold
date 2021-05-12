import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import GridList from "../../components/atomic/grid-list";
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
import JournalGridItem from "../../components/grid-list-items/JournalGridItem";
import { useDispatchJournals } from "hooks";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

const JournalsList = ({
  authentication,
  journals,
  location = {},
  history,
  dispatch,
  subjects,
  journalsMeta
}) => {
  useDispatchJournals(location);

  const initialFilterState = (init = {}) => {
    return omitBy(init, (vIgnored, k) => k === "page");
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
    if (!journals || journals.length === 0) return true;
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
                  <h2 className="title">{"All Journals"}</h2>
                </div>
              </div>
            </header>
            <div className="entity-section-wrapper__details">
              <Utility.EntityCount
                pagination={get(journalsMeta, "pagination")}
                singularUnit="journal"
                pluralUnit="journals"
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
          <GridList
            authenticated={authentication.authenticated}
            favorites={get(authentication, "currentUser.favorites")}
            dispatch={dispatch}
            pagination={get(journalsMeta, "pagination")}
            paginationClickHandler={pageChangeHandlerCreator}
            limit={perPage}
          >
            {journals.map(journal => {
              return (
                <CSSTransition key={journal.id} timeout={250}>
                  <li className="grid-list__item--pos-rel">
                    <JournalGridItem
                      journal={journal}
                      hideDesc
                      hideCollectingToggle={false}
                    />
                  </li>
                </CSSTransition>
              );
            })}
          </GridList>
        </div>
      </section>
    );
  };

  if (!journalsMeta) return null;

  return (
    <div
      style={{
        overflowX: "hidden"
      }}
    >
      <h1 className="screen-reader-text">All Journals</h1>
      {renderProjectLibrary()}
    </div>
  );
};

JournalsList.mapStateToProps = state => {
  return {
    journals: select(requests.feProjectsFiltered, state.entityStore),
    subjects: select(requests.feSubjects, state.entityStore),
    journalsMeta: meta(requests.feProjectsFiltered, state.entityStore),
    authentication: state.authentication
  };
};

JournalsList.propTypes = {
  authentication: PropTypes.object,
  journals: PropTypes.array,
  location: PropTypes.object,
  history: PropTypes.object,
  dispatch: PropTypes.func,
  subjects: PropTypes.array,
  journalsMeta: PropTypes.object,
  settings: PropTypes.object
};

export default connectAndFetch(withSettings(JournalsList));
