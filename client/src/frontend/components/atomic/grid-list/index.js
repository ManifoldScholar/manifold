import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { TransitionGroup as ReactTransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";
import classNames from "classnames";

const GridList = ({
  children,
  limit = 0,
  pagination,
  paginationTarget,
  paginationClickHandler,
  showViewAll,
  viewAllUrl,
  viewAllLabel = "See All Projects"
}) => {
  const itemsList = () => {
    if (limit === 0) return [];
    return limit
      ? React.Children.toArray(children).slice(0, limit)
      : React.Children.toArray(children);
  };

  const viewAll = () => {
    return (
      showViewAll ||
      (limit && viewAllUrl && React.Children.count(children) > limit)
    );
  };

  const renderViewAll = () => {
    if (!viewAll()) return null;

    return (
      <div
        className={classNames(
          "entity-section-wrapper__utility",
          "entity-section-wrapper__utility--footer"
        )}
      >
        <Link to={viewAllUrl}>
          {viewAllLabel}
          <Utility.IconComposer icon="arrowLongRight16" size="default" />
        </Link>
      </div>
    );
  };

  const renderPagination = () => {
    if (pagination?.totalPages <= 1) return null;
    return (
      <div className="entity-section-wrapper__pagination">
        <Utility.Pagination
          paginationClickHandler={paginationClickHandler}
          pagination={pagination}
          paginationTarget={paginationTarget}
        />
      </div>
    );
  };

  const items = itemsList();

  if (items.length === 0) return null;
  return (
    <>
      <div className="grid-list grid entity-section-wrapper__body">
        <ReactTransitionGroup component="ul">{items}</ReactTransitionGroup>
      </div>
      {pagination ? renderPagination() : renderViewAll()}
    </>
  );
};

GridList.displayName = "Atomic.GridList";

GridList.propTypes = {
  children: PropTypes.node,
  limit: PropTypes.number,
  pagination: PropTypes.object,
  paginationTarget: PropTypes.string,
  paginationClickHandler: PropTypes.func,
  showViewAll: PropTypes.bool,
  viewAllUrl: PropTypes.string,
  viewAllLabel: PropTypes.string
};

export default GridList;
