import React, { useState } from "react";
import { useUID } from "react-uid";
import ResourceList from "frontend/components/resource-list";
import Utility from "global/components/utility";
import Block from "../Block";

import { useDispatchMyCollected, useSelectMyCollected } from "hooks";

const DEFAULT_PAGE = 1;
const PER_PAGE = 8;
const INIT_PAGINATION_STATE = {
  number: DEFAULT_PAGE,
  size: PER_PAGE
};

function CollectedResourcesBlock() {
  const uid = useUID();
  const [paginationState, setPaginationState] = useState(INIT_PAGINATION_STATE);

  useDispatchMyCollected("resources", paginationState);
  const { collection, collectionMeta } = useSelectMyCollected("resources");

  function handlePageChange(pageParam) {
    setPaginationState(prevState => {
      return { ...prevState, number: pageParam };
    });
  }

  const pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      handlePageChange(pageParam);
    };
  };

  if (!collection?.length > 0 || !collectionMeta) return null;

  const showPagination = collectionMeta.pagination?.totalPages > 1;

  return (
    <Block id={`collected-block-${uid}`} title="Resources" icon="resources64">
      <ResourceList.Thumbnails resources={collection} />
      {showPagination && (
        <div className="entity-section-wrapper__pagination">
          <Utility.Pagination
            pagination={collectionMeta.pagination}
            paginationTarget={`#collected-block-${uid}`}
            paginationClickHandler={pageChangeHandlerCreator}
          />
        </div>
      )}
    </Block>
  );
}

CollectedResourcesBlock.displayName = "Collecting.CollectedBlocks.Resources";

export default CollectedResourcesBlock;
