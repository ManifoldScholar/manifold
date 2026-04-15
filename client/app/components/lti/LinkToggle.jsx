import { useState } from "react";
import classNames from "classnames";
import IconComposer from "components/global/utility/IconComposer";

function determineView(selected, hovered) {
  if (selected) return hovered ? "remove-active" : "remove";
  return hovered ? "add-active" : "add";
}

function textForView(view) {
  switch (view) {
    case "add":
    case "add-active":
      return "Link";
    case "remove":
      return "Linked";
    case "remove-active":
      return "Remove";
    default:
      return "";
  }
}

export default function LinkToggle({
  selected = false,
  onToggle,
  srLabel,
  inline = true,
  outlined = false,
  hiddenIfUnlinked = false
}) {
  const [hovered, setHovered] = useState(false);
  const view = determineView(selected, hovered);

  return (
    <button
      type="button"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        setHovered(false);
        onToggle?.();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={srLabel}
      className={classNames({
        "collecting-toggle": true,
        "collecting-toggle--inline": inline,
        "collecting-toggle--project-cover": !inline,
        "collecting-toggle--outlined": outlined,
        "collecting-toggle--filled-always": !outlined,
        "collecting-toggle--toc-hidden": hiddenIfUnlinked && !selected
      })}
    >
      <div
        className={classNames({
          "collecting-toggle__inner": true,
          [`collecting-toggle__inner--${view}`]: true
        })}
      >
        <div className="collecting-toggle__icons" aria-hidden="true">
          <IconComposer
            icon="MinusUnique"
            size={28}
            className="collecting-toggle__icon collecting-toggle__icon--remove"
          />
          <IconComposer
            icon="CheckUnique"
            size={28}
            className="collecting-toggle__icon collecting-toggle__icon--confirm"
          />
          <IconComposer
            icon="PlusUnique"
            size="default"
            className="collecting-toggle__icon collecting-toggle__icon--add"
          />
        </div>
        <span className="collecting-toggle__text">{textForView(view)}</span>
      </div>
    </button>
  );
}
