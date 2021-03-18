import React, { useState } from "react";
import { useUID } from "react-uid";
import TextList from "frontend/components/content-block/Block/types/Texts";
import Utility from "global/components/utility";
import CollectionBlock from "frontend/components/collecting/CollectionBlock";

import { useDispatchMyCollected, useSelectMyCollected } from "hooks";

const DEFAULT_PAGE = 1;
const PER_PAGE = 5;
const INIT_PAGINATION_STATE = {
  number: DEFAULT_PAGE,
  size: PER_PAGE
};

function CollectedTextsBlock() {
  const uid = useUID();
  const [paginationState, setPaginationState] = useState(INIT_PAGINATION_STATE);

  useDispatchMyCollected("texts", paginationState);
  const { collection, collectionMeta } = useSelectMyCollected("texts");

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

  const visibilityProps = {
    showAuthors: false,
    showCategoryLabels: false,
    showDates: true,
    showDescriptions: false,
    showSubtitles: true,
    showCollectingToggle: false
  };

  if (!collection?.length > 0 || !collectionMeta) return null;

  const showPagination = collectionMeta.pagination?.totalPages > 1;

  return (
    <CollectionBlock
      id={`collected-block-${uid}`}
      title="Texts"
      icon="textsStacked64"
    >
      <TextList texts={collection} {...visibilityProps} />
      {showPagination && (
        <div className="entity-section-wrapper__pagination">
          <Utility.Pagination
            pagination={collectionMeta.pagination}
            paginationTarget={`#collected-block-${uid}`}
            paginationClickHandler={pageChangeHandlerCreator}
          />
        </div>
      )}
    </CollectionBlock>
  );
}

CollectedTextsBlock.displayName = "Collecting.CollectedBlocks.Texts";

export default CollectedTextsBlock;
