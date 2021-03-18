import React, { useState } from "react";
import { useUID } from "react-uid";
import ProjectList from "frontend/components/project-list";
import CollectionBlock from "frontend/components/collecting/CollectionBlock";

import { useDispatchMyCollected, useSelectMyCollected } from "hooks";

const DEFAULT_PAGE = 1;
const PER_PAGE = 8;
const INIT_PAGINATION_STATE = {
  number: DEFAULT_PAGE,
  size: PER_PAGE
};

function CollectedProjectsBlock() {
  const uid = useUID();
  const [paginationState, setPaginationState] = useState(INIT_PAGINATION_STATE);

  useDispatchMyCollected("projects", paginationState);
  const { collection, collectionMeta } = useSelectMyCollected("projects");

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

  return (
    <CollectionBlock
      id={`collected-block-${uid}`}
      title="Projects"
      icon="projects64"
    >
      <ProjectList.Grid
        authenticated={false}
        projects={collection}
        pagination={collectionMeta.pagination}
        paginationTarget={`#collected-block-${uid}`}
        paginationClickHandler={pageChangeHandlerCreator}
        limit={PER_PAGE}
        hideCollectingToggle
      />
    </CollectionBlock>
  );
}

CollectedProjectsBlock.displayName = "Collecting.CollectedBlocks.Projects";

export default CollectedProjectsBlock;
