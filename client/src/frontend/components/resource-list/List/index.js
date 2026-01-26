import PropTypes from "prop-types";
import ListItem from "./ListItem";
import * as Styled from "./styles";

export default function ResourceList({
  resources,
  resourceCollection,
  project,
  setActive,
  active,
  itemHeadingLevel,
  renderAsLink
}) {
  return (
    <Styled.List>
      {resources?.map(r => (
        <ListItem
          key={r.id}
          resource={r}
          resourceCollection={resourceCollection}
          project={project}
          active={active === r.id}
          setActive={setActive}
          headingLevel={itemHeadingLevel}
          renderAsLink={renderAsLink}
        />
      ))}
    </Styled.List>
  );
}

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.object),
  resourceCollection: PropTypes.object,
  project: PropTypes.object,
  active: PropTypes.string,
  setActive: PropTypes.func,
  itemHeadingLevel: PropTypes.oneOf([2, 3]),
  renderAsLink: PropTypes.bool
};
