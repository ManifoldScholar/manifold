import React, { Component } from "react";

export default class ResourceIconSpreadsheet extends Component {
  static displayName = "Resource.Icon.Spreadsheet";

  render() {
    return (
      <svg
        version="1.1"
        width="72px"
        height="72px"
        viewBox="0 0 72 72"
      >
        {/* Disable max-length on linter for long SVG path declarations */}
        {/* eslint-disable max-len */}
        <path d="M67.97461,9.60938H4.02539c-0.55225,0-1,0.44775-1,1v50.8125c0,0.55273,0.44775,1,1,1h63.94922c0.55273,0,1-0.44727,1-1 v-50.8125C68.97461,10.05713,68.52734,9.60938,67.97461,9.60938z M66.97461,22.85596h-47.3252V11.60938h47.3252V22.85596z M17.64941,11.60938v11.24658H5.02539V11.60938H17.64941z M5.02539,24.85596h12.62402v35.56592H5.02539V24.85596z M19.64941,60.42188V24.85596h47.3252v35.56592H19.64941z"/>
        {/* eslint-enable max-len */}
      </svg>
    );
  }
}
