import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import Single from './Single';
import Group from './Group';

export default class ResourceViewerList extends PureComponent {

  static displayName = "ResourceViewer.List";

  static propTypes = {
    resources: PropTypes.array,
    resourceMarkers: PropTypes.array,
    containerSize: PropTypes.number
  };

  constructor() {
    super();
    this.resourceHeight = 110;
    this.groupHeight = 200;
  }

  getResourceLocation(rect) {
    if (rect.top <= 120) return 0;
    return rect.top - 10;
  }

  getFilteredResources() {
    // Generate resource objects that contain the resource from the data store
    // Along with the generated ideal location of the resource
    let filteredResources = [];
    this.props.resourceMarkers.forEach((marker) => {
      filteredResources = filteredResources.concat(this.props.resources.filter((resource) => {
        return marker.resourceId === resource.id;
      }).map((resource) => {
        return {
          resource,
          annotationId: marker.annotationId,
          location: this.getResourceLocation(marker.rect),
          height: this.resourceHeight
        };
      }));
    });

    return filteredResources.sort((a, b) => {
      return a.location - b.location;
    });
  }

  getGroupedResources(items, index) {
    if (index >= items.length - 1) return items;
    const current = items[index];
    const next = items[index + 1];
    if (current.location + current.height >= next.location) {
      // Make/add a group, start back at 0
      if (current.group) {
        // Existing group adds a new item
        current.items.push(next);
        // And remove it from the array
        items.splice(index + 1, 1);
      } else {
        // Make a new group
        const group = {
          group: true,
          location: current.location,
          height: this.groupHeight,
          items: [current, next]
        };
        items.splice(index, 2, group);
      }

      // Run through the array with new group arrangement
      return this.getGroupedResources(items, 0);
    }

    return this.getGroupedResources(items, index + 1);
  }

  renderResourceList(resources) {
    const { textId, sectionId } = this.props;
    return (
      <ul className="viewer-list">
        {resources.map((item, index) => {
          return (
            <li key={index}>
              {item.group ?
                <Group
                  items={item.items}
                  location={item.location}
                  height={this.groupHeight}
                  singleHeight={this.resourceHeight}
                  textId={textId}
                  sectionId={sectionId}
                /> :
                <Link
                  className="resource-single-link"
                  to={`/read/${textId}/section/${sectionId}/resource/${item.resource.id}`}
                >
                  <Single
                    annotationId={item.annotationId}
                    resource={item.resource}
                    location={item.location}
                    height={this.resourceHeight}
                  />
                </Link>
              }
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const viewerClass = `resource-viewer container-width-${this.props.containerSize}`;
    const grouped = this.getGroupedResources(this.getFilteredResources(), 0);
    return (
        <nav className={viewerClass}>
          {grouped ? this.renderResourceList(grouped) : null }
        </nav>
    );
  }
}
