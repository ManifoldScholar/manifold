import PropTypes from "prop-types";
import EntityRow from "./Row";

export default function UserGroupRow({ entity }) {
  const { attributes, id } = entity;

  const additionalProps = {
    title: attributes.name,
    rowClickMode: "block",
    onRowClick: `/backend/records/user-groups/${id}`
  };
  return <EntityRow entity={entity} {...additionalProps} />;
}

UserGroupRow.displayName = "EntitiesList.Entity.UserGroupRow";

UserGroupRow.propTypes = {
  entity: PropTypes.object
};
