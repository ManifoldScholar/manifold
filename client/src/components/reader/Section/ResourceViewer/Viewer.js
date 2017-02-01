import React, { PureComponent, PropTypes } from 'react';
import Thumbnail from './Thumbnail';

export default class ResourceViewerViewer extends PureComponent {

  static displayName = "ResourceViewer.Viewer";

  static propTypes = {
    resources: PropTypes.array,
    resourceMarkers: PropTypes.array,
    containerSize: PropTypes.number
  };

  getResourceLocation(rect) {
    if (rect.top <= 120) {
      return 0;
    } else {
      return rect.top - 10;
    }
  }

  getFilteredResources() {
    // Generate resource objects that contain the resource from the data store
    // Along with the generated ideal location of the resource
    let filteredResources = [];
    this.props.resourceMarkers.forEach((marker) => {
      filteredResources = filteredResources.concat(this.props.resources.filter((resource) => {
        return marker.id === resource.id;
      }).map((resource) => {
        resource.location = this.getResourceLocation(marker.rect);
        return resource;
      }));
    });

    return filteredResources;
  }

  getGroupedResources(singles, height) {
    // Return an empty list
    if (singles.length <= 0 ) return singles;
    return singles.map((single, index) => {
      // Return the last single
      if (index === singles.length - 1) return single;

      const next = singles[index + 1];
      // Mark overlap for overlapping singles
      single.overlap = (single.location + height) > next.location;

      return single;
    });
  }

  renderResourceList(resources) {
    return (
      <ul className="viewer-list">
        {resources.map((resource, index) => {
          return (
            <Thumbnail
              resource={resource}
              location={resource.location}
              overlap={resource.overlap}
              key={index}
            />
          );
        })}
      </ul>
    );
  }

  render() {
    const viewerClass = `resource-viewer container-width-${this.props.containerSize}`;
    const grouped = this.getGroupedResources(this.getFilteredResources(), 110);

    return (
        <nav className={viewerClass}>
          {grouped ? this.renderResourceList(grouped) : null }
        </nav>
    );
  }
}
