import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Teaser from './Teaser';
import max from 'lodash/max';
import map from 'lodash/map';

export default class EventList extends Component {

  static displayName = "Event.List"

  static propTypes = {
    events: PropTypes.array
  };

  constructor() {
    super();
    this._teaserNodes = [];
    this._wrapperNodes = [];
    this.padding = 24;
  }

  componentDidMount() {
    this.matchHeights();
  }

  setWrapperHeights(height) {
    /* eslint-disable no-param-reassign */
    this._wrapperNodes.forEach((node) => {
      node.style.height = `${height}px`;
    });
    /* eslint-enable no-param-reassign */
  }

  setTeaserPadding(height) {
    this._teaserNodes.forEach((node) => {
      /* eslint-disable no-param-reassign */
      node.style.paddingTop = '0px';
      node.style.paddingBottom = '0px';
      const centerPadding = (height - node.offsetHeight) / 2;
      if (centerPadding > 0) {
        node.style.paddingTop = `${centerPadding}px`;
        node.style.paddingBottom = `${centerPadding}px`;
      }
      /* eslint-enable no-param-reassign */
    });
  }

  matchHeights() {
    const height = this.calculateTallestHeight(this._teaserNodes);
    this.setWrapperHeights(height);
    this.setTeaserPadding(height);
  }

  calculateTallestHeight(nodes) {
    const naturalHeights = map(nodes, (node) => {
      return node.offsetHeight;
    });
    const maxHeight = max(naturalHeights);
    return maxHeight + (this.padding * 2);
  }

  render() {
    this._teaserNodes = [];
    this._wrapperNodes = [];
    return (
      <ul className="event-list" ref="eventList">
        {this.props.events.map((event, index) => {
          return (
            <li key={index}>
              <div
                ref={(node) => this._wrapperNodes.push(node)}
                className={'event-tile ' + event.type}
              >
                <Teaser
                  ref={(component) => this._teaserNodes.push(findDOMNode(component))}
                  event={event}
                />
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
