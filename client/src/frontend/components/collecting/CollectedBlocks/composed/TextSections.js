import React, { useState } from "react";
import { useUID } from "react-uid";
import TOCNode from "frontend/components/content-block/Block/types/TOC/Node";
import Utility from "global/components/utility";
import Block from "../Block";

import { useDispatchMyCollected, useSelectMyCollected } from "hooks";

const DEFAULT_PAGE = 1;
const PER_PAGE = 20;
const INIT_PAGINATION_STATE = {
  number: DEFAULT_PAGE,
  size: PER_PAGE
};

function CollectedTextSectionsBlock() {
  const uid = useUID();
  const [paginationState, setPaginationState] = useState(INIT_PAGINATION_STATE);

  useDispatchMyCollected("text_sections", paginationState);
  const { collection, collectionMeta } = useSelectMyCollected("text_sections");

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
    <Block id={`collected-block-${uid}`} title="Text Sections" icon="toc64">
      <div className="toc-block">
        <ul className="toc-block__list toc-block__list--depth-1 toc-block__list--large">
          {collection.map(node => {
            const {
              id,
              attributes: { name, textSlug, textTitle }
            } = node;

            return (
              <TOCNode
                key={id}
                id={id}
                title={name}
                textSlug={textSlug}
                textTitle={textTitle}
              />
            );
          })}
        </ul>
      </div>
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

CollectedTextSectionsBlock.displayName =
  "Collecting.CollectedBlocks.TextSections";

export default CollectedTextSectionsBlock;
