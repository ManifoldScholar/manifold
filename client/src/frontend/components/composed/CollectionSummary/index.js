import * as React from "react";
import PropTypes from "prop-types";
import ThumbnailGrid from "global/composed/ThumbnailGrid";
import EntityThumbnail from "global/atomic/EntityThumbnail";
import SummaryHeader from "./SummaryHeader";
import classnames from "classnames";
import * as Styled from "./styles";

export default function CollectionSummary({
  collection,
  entities,
  issueCount,
  hero,
  background
}) {
  return (
    <section>
      <Styled.Container className={classnames(("bg-neutral05": background))}>
        <SummaryHeader collection={collection} hero={hero} />
        {entities ? (
          <>
            {issueCount && (
              <Styled.IssueCount>
                Showing {entities.length} of {issueCount} issues
              </Styled.IssueCount>
            )}
            <ThumbnailGrid>
              {({ stack }) =>
                entities.map(entity => (
                  <EntityThumbnail
                    entity={entity}
                    stack={stack}
                    key={entity.attributes.slug}
                  />
                ))
              }
            </ThumbnailGrid>
          </>
        ) : (
          <Styled.EmptyWrapper>
            <Styled.EmptyMessage>
              This Project Collection is currently empty.
            </Styled.EmptyMessage>
          </Styled.EmptyWrapper>
        )}
      </Styled.Container>
    </section>
  );
}

CollectionSummary.propTypes = {
  collection: PropTypes.object.isRequired,
  background: PropTypes.bool,
  entities: PropTypes.arrayOf(PropTypes.object),
  issueCount: PropTypes.number,
  hero: PropTypes.object
};
