import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import includes from 'lodash/includes';
import { ResourceList } from 'components/frontend';
import { collectionsAPI } from 'api';
import { entityStoreActions } from 'actions';

const { request } = entityStoreActions;

export default class ResourceListSlideshow extends PureComponent {

  static displayName = "ResourceList.Slideshow";

  static propTypes = {
    collectionResources: PropTypes.array,
    count: PropTypes.number,
    pagination: PropTypes.object,
    dispatch: PropTypes.func,
    collectionId: PropTypes.string
  };

  constructor(props) {
    super();

    // Note that currentResource is matching to resource order
    // property, not order in array
    this.state = {
      position: 1,
      loadedPages: [1],
      map: {},
      totalCount: 0
    };
    this.state.map = this.buildNewMap(props.collectionResources);
    this.state.totalCount = props.pagination.totalCount || 0;

    this.current = this.current.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.buildNewMap = this.buildNewMap.bind(this);
    this.handleSlidePrev = this.handleSlidePrev.bind(this);
    this.handleSlideNext = this.handleSlideNext.bind(this);
    this.handleUnloadedSlide = this.handleUnloadedSlide.bind(this);
    this.addLoadedPage = this.addLoadedPage.bind(this);
    this.updateTotalCount = this.updateTotalCount.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.updateMap(nextProps.collectionResources);
    this.addLoadedPage(nextProps.pagination.currentPage);
    this.updateTotalCount(nextProps.pagination.totalCount);
  }

  addLoadedPage(page) {
    const loadedPages = this.state.loadedPages.slice(0);
    if (!includes(loadedPages, page)) {
      loadedPages.push(page);
      this.setState({ loadedPages });
    }
  }

  buildNewMap(collectionResources) {
    const updates = {};
    collectionResources.forEach((collectionResource) => {
      updates[collectionResource.attributes.position] = collectionResource;
    });
    const map = Object.assign({}, this.state.map, updates);
    return map;
  }

  updateTotalCount(totalCount) {
    if (totalCount > 0) {
      this.setState({ totalCount });
    }
  }

  updateMap(collectionResources) {
    const map = this.buildNewMap(collectionResources);
    this.setState({ map });
  }

  updatePosition(newPosition) {
    if (!this.isLoaded(newPosition)) {
      this.handleUnloadedSlide(newPosition);
    }
    this.setState({ position: newPosition });
  }

  current() {
    const collectionResource = this.state.map[this.state.currentPosition];
    return collectionResource;
  }

  isLoaded(position) {
    return this.state.map.hasOwnProperty(position);
  }

  positionToPage(position, perPage) {
    return Math.ceil(position / perPage);
  }

  isPageLoaded(page) {
    return includes(this.state.loadedPages, page);
  }

  handleUnloadedSlide(position) {
    const page = this.positionToPage(position, this.props.pagination.perPage);
    if (!this.isPageLoaded(page)) {
      const fetch = collectionsAPI.collectionResources(
        this.props.collectionId, { }, { number: page }
      );
      this.props.dispatch(request(fetch, 'slideshow-resources'));
    }
  }

  handleSlidePrev() {
    let newPosition = this.state.position - 1;
    if (newPosition < 1) newPosition = 1;
    this.updatePosition(newPosition);
  }

  handleSlideNext() {
    let newPosition = this.state.position + 1;
    if (newPosition > this.state.totalCount) newPosition = this.state.totalCount;
    this.updatePosition(newPosition);
  }

  getFigureByType(resource) {
    let output = false;
    switch (resource.attributes.kind) {
      case 'image':
        output = (<ResourceList.Slide.SlideImage
          resource={resource}
        />);
        break;
      case 'video':
        output = (<ResourceList.Slide.SlideVideo
          resource={resource}
        />);
        break;
      default:
        output = (<ResourceList.Slide.Slide
          resource={resource}
        />);
    }

    return output;
  }

  render() {
    const position = this.state.position;
    const count = this.state.totalCount;
    const collectionResource = this.state.map[position];

    return (
      <div className="resource-slideshow">
        {/*
          Note that .slide may be abstracted to a
          listed format to support multiple, sliding images
        */}
        <div className="slide">
          <div className="resource-slide-figure">
            <ReactCSSTransitionGroup
              transitionName="figure"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
              <div key={position}>
                { this.isLoaded(position) ?
                  this.getFigureByType(collectionResource.relationships.resource)
                  :
                  <ResourceList.Slide.SlideLoading />
                }
              </div>
            </ReactCSSTransitionGroup>
          </div>
          <div className="slide-footer">

            { this.isLoaded(position) ?
              <ResourceList.Slide.Caption
                resource={collectionResource.relationships.resource}
              />
            :
              <ResourceList.Slide.LoadingCaption />
            }
            <div className="slide-pagination">
              <span className="slide-ordinal">
                {position} {'/'} {count}
              </span>
              <div>
                <button className="slide-previous" onClick={this.handleSlidePrev}>
                  <i className="manicon manicon-arrow-round-left"></i>
                  <span className="screen-reader-text">
                    {'Click to load previous slide'}
                  </span>
                </button>
                <button className="slide-next" onClick={this.handleSlideNext}>
                  <i className="manicon manicon-arrow-round-right"></i>
                  <span className="screen-reader-text"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
