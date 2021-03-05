import React, { useState } from "react";
import { useUID } from "react-uid";
import ResourceCollectionList from "frontend/components/resource-collection-list";
import Utility from "global/components/utility";
import Block from "../Block";

import { useDispatchMyCollected, useSelectMyCollected } from "hooks";

const DEFAULT_PAGE = 1;
const PER_PAGE = 8;
const INIT_PAGINATION_STATE = {
  number: DEFAULT_PAGE,
  size: PER_PAGE
};

function CollectedResourceCollectionsBlock() {
  const uid = useUID();
  const [paginationState, setPaginationState] = useState(INIT_PAGINATION_STATE);

  useDispatchMyCollected("resource_collections", paginationState);
  const { collection, collectionMeta } = useSelectMyCollected(
    "resource_collections"
  );

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
    <Block
      id={`collected-block-${uid}`}
      title="Resource Collections"
      icon="resourceCollection64"
    >
      <ResourceCollectionList.Grid resourceCollections={collection} />
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

CollectedResourceCollectionsBlock.displayName =
  "Collecting.CollectedBlocks.ResourceCollections";

export default CollectedResourceCollectionsBlock;
