import React, { Component } from 'react';

export default class ProjectThumbPlaceholder extends Component {
  // static propTypes = {};

  render() {
    return (
      <svg version="1.1" className="project-thumb-placeholder"
        x="0px" y="0px" width="186px" height="199px" viewBox="0 0 186 199"
      >
        <g>
          <polygon className="highlight"
            points="186,0.4 0,0.4 0,186.4 6.6,186.4 6.6,192.7 13.3,
            192.7 13.3,198.6 172.7,198.6 172.7,192.7
            179.4,192.7 179.4,186.4 186,186.4"
          />
        </g>

        <polygon className="background"
          points="181.6,5.1 4.4,5.1 4.4,182.3 10.7,182.3 10.7,
          188.3 17.1,188.3 17.1,193.9 168.9,193.9 168.9,188.3 175.3,
          188.3 175.3,182.3 181.6,182.3 "
        />

        <path className="outline"
          d="M182.1,4.6H3.9v178.1h6.3v6h6.4v5.6h152.8v-5.6h6.4v-6h6.3V4.6z
          M168.4,193.4H17.6v-4.6h150.8V193.4z M174.8,187.8H11.2v-5h163.6V187.8z
          M181.1,181.8H4.9V5.6h176.1V181.8z"
        />
      </svg>
    );
  }
}
