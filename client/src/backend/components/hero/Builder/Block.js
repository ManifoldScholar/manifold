import * as React from "react";
import PropTypes from "prop-types";
import Collapse from "global/components/Collapse";
import HeaderDetail from "./BlockHeaderDetail";

const Block = props => {
  const {
    title,
    titleId,
    description,
    onEdit,
    ariaControls,
    ariaExpanded,
    children,
    initialVisible
  } = props;

  const onDrawerOpen = event => {
    event.preventDefault();
    onEdit();
  };

  return (
    <div className="hero-builder-block full-width">
      {!!onEdit && (
        <button
          className="hero-builder-block__header"
          onClick={onDrawerOpen}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
        >
          <HeaderDetail
            title={title}
            titleId={titleId}
            description={description}
          />
        </button>
      )}
      {!onEdit && (
        <Collapse initialVisible={initialVisible}>
          <Collapse.Toggle className="hero-builder-block__header">
            <HeaderDetail title={title} description={description} />
          </Collapse.Toggle>
          <Collapse.Content>
            <div className="hero-builder-block__body">{children}</div>
          </Collapse.Content>
        </Collapse>
      )}
    </div>
  );
};

Block.propTypes = {
  title: PropTypes.string.isRequired,
  titleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  onEdit: PropTypes.func,
  ariaControls: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ariaExpanded: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

Block.displayName = "Hero.Builder.Block";

export default Block;
