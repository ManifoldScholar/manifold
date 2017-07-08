import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import includes from "lodash/includes";
import { ResourceList } from "components/frontend";
import { collectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default class ResourceListSlideshow extends PureComponent {
  static displayName = "ResourceList.Slideshow";

  static propTypes = {
    collectionResources: PropTypes.array,
    pagination: PropTypes.object,
    dispatch: PropTypes.func,
    collectionId: PropTypes.string
  };

  constructor(props) {
    super();

    // Using resource order in array now that array is
    // ordered by collection_resource position
    this.state = {
      position: 1,
      loadedPages: [1],
      map: {},
      totalCount: 0
    };
    this.state.map = this.buildNewMap(
      props.collectionResources,
      props.pagination
    );
    this.state.totalCount = props.pagination.totalCount || 0;

    this.current = this.current.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.buildNewMap = this.buildNewMap.bind(this);
    this.handleSlidePrev = this.handleSlidePrev.bind(this);
    this.handleSlideNext = this.handleSlideNext.bind(this);
    this.handleUnloadedSlide = this.handleUnloadedSlide.bind(this);
    this.addLoadedPage = this.addLoadedPage.bind(this);
    this.updateTotalCount = this.updateTotalCount.bind(this);
    this.bindKeyboard = this.bindKeyboard.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keyup", this.bindKeyboard, false);
  }

  componentWillReceiveProps(nextProps) {
    this.updateMap(nextProps.collectionResources, nextProps.pagination);
    this.addLoadedPage(nextProps.pagination.currentPage);
    this.updateTotalCount(nextProps.pagination.totalCount);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.bindKeyboard, false);
  }

  getFigureByType(resource) {
    let output = false;
    switch (resource.attributes.kind) {
      case "image":
        output = <ResourceList.Slide.SlideImage resource={resource} />;
        break;
      case "video":
        output = <ResourceList.Slide.SlideVideo resource={resource} />;
        break;
      default:
        output = <ResourceList.Slide.Slide resource={resource} />;
    }

    return output;
  }

  bindKeyboard(event) {
    if (event.keyCode === 39) {
      this.handleSlideNext();
    } else if (event.keyCode === 37) {
      this.handleSlidePrev();
    }
  }

  handleUnloadedSlide(position) {
    const page = this.positionToPage(position, this.props.pagination.perPage);
    if (!this.isPageLoaded(page)) {
      const fetch = collectionsAPI.collectionResources(
        this.props.collectionId,
        {},
        { number: page, size: this.props.pagination.perPage }
      );
      this.props.dispatch(request(fetch, requests.feSlideshow));
    }
  }

  handleSlidePrev() {
    let newPosition = this.state.position - 1;
    if (newPosition < 1) newPosition = 1;
    this.updatePosition(newPosition);
  }

  handleSlideNext() {
    let newPosition = this.state.position + 1;
    if (newPosition > this.state.totalCount)
      newPosition = this.state.totalCount;
    this.updatePosition(newPosition);
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

  current() {
    const collectionResource = this.state.map[this.state.currentPosition];
    return collectionResource;
  }

  updateMap(collectionResources, pagination) {
    const map = this.buildNewMap(collectionResources, pagination);
    this.setState({ map });
  }

  updatePosition(newPosition) {
    if (!this.isLoaded(newPosition)) {
      this.handleUnloadedSlide(newPosition);
    }
    this.setState({ position: newPosition });
  }

  updateTotalCount(totalCount) {
    if (totalCount > 0) {
      this.setState({ totalCount });
    }
  }

  buildNewMap(collectionResources, pagination) {
    const updates = {};
    const start = pagination.perPage * (pagination.currentPage - 1) + 1;
    collectionResources.forEach((collectionResource, index) => {
      updates[start + index] = collectionResource;
    });
    const map = Object.assign({}, this.state.map, updates);
    return map;
  }

  addLoadedPage(page) {
    const loadedPages = this.state.loadedPages.slice(0);
    if (!includes(loadedPages, page)) {
      loadedPages.push(page);
      this.setState({ loadedPages });
    }
  }

  renderSlideShow() {
    const position = this.state.position;
    const collectionResource = this.state.map[position];

    return (
      <div key={position}>
        {this.isLoaded(position)
          ? this.getFigureByType(collectionResource)
          : <ResourceList.Slide.SlideLoading />}
      </div>
    );
  }

  renderPlaceholder() {
    return <ResourceList.Slide.SlidePlaceholder />;
  }

  render() {
    const position = this.state.position;
    const totalCount = this.state.totalCount;
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
              {this.props.collectionResources.length > 0
                ? this.renderSlideShow()
                : this.renderPlaceholder()}
            </ReactCSSTransitionGroup>
          </div>
          <div className="slide-footer">
            {this.isLoaded(position)
              ? <ResourceList.Slide.Caption
                  resource={collectionResource}
                  collectionId={this.props.collectionId}
                />
              : <ResourceList.Slide.LoadingCaption />}
            {this.props.collectionResources.length > 0
              ? <div className="slide-pagination">
                  <span className="slide-ordinal">
                    {position} {"/"} {totalCount}
                  </span>
                  <div>
                    <button
                      className="slide-previous"
                      onClick={this.handleSlidePrev}
                      disabled={position === 1}
                    >
                      <i className="manicon manicon-arrow-round-left" />
                      <span className="screen-reader-text">
                        {"Click to load previous slide"}
                      </span>
                    </button>
                    <button
                      className="slide-next"
                      onClick={this.handleSlideNext}
                      disabled={position === totalCount}
                    >
                      <i className="manicon manicon-arrow-round-right" />
                      <span className="screen-reader-text" />
                    </button>
                  </div>
                </div>
              : null}
          </div>
        </div>
      </div>
    );
  }
}
