import PropTypes from "prop-types";
import ListItem from "./ListItem/CollectionListItem";
import * as Styled from "./styles";

export default function ResourceCollectionList({
  collections,
  project,
  setActive,
  active,
  itemHeadingLevel,
  renderAsLink
}) {
  return (
    <Styled.List>
      {collections?.map(c => (
        <ListItem
          key={c.id}
          collection={c}
          project={project}
          active={active === c.id}
          setActive={setActive}
          headingLevel={itemHeadingLevel}
          renderAsLink={renderAsLink}
        />
      ))}
    </Styled.List>
  );
}

ResourceCollectionList.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.object),
  project: PropTypes.object,
  active: PropTypes.bool,
  setActive: PropTypes.func,
  itemHeadingLevel: PropTypes.oneOf([2, 3]),
  renderAsLink: PropTypes.bool
};
