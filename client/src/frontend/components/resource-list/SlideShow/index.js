import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import includes from "lodash/includes";
import debounce from "lodash/debounce";
import ResourceSlide from "frontend/components/resource-slide";
import { resourceCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import DirectionalButton from "./DirectionalButton";
import capitalize from "lodash/capitalize";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

const { request } = entityStoreActions;

class ResourceSlideshow extends PureComponent {
  static displayName = "ResourceSlideshow";

  static propTypes = {
    collectionResources: PropTypes.array,
    pagination: PropTypes.object,
    dispatch: PropTypes.func,
    resourceCollection: PropTypes.object.isRequired,
    hideDetailUrl: PropTypes.bool,
    hideDownload: PropTypes.bool,
    slideOptions: PropTypes.object,
    t: PropTypes.func,
  };

  static defaultProps = {
    slideOptions: {},
    hideDetailUrl: false,
    hideDownload: false,
  };

  constructor(props) {
    super();

    // Using resource order in array now that array is
    // ordered by collection_resource position
    this.state = {
      position: 1,
      loadedPages: [1],
      map: {},
      totalCount: 0,
      slideDirection: "left",
    };
    this.state.map = this.buildInitialMap(
      props.collectionResources,
      props.pagination,
    );
    this.state.totalCount = props.pagination.totalCount || 0;

    this.sliderRef = React.createRef(null);
    this.debouncedScroll = debounce(this.bindScroll, 100);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};
    if (nextProps.pagination.totalCount > 0) {
      nextState.totalCount = nextProps.pagination.totalCount;
    }

    const loadedPages = prevState.loadedPages.slice(0);
    const page = nextProps.pagination.currentPage;
    if (!includes(loadedPages, page)) {
      loadedPages.push(page);
      nextState.loadedPages = loadedPages;
    }

    return Object.keys(nextState).length === 0 ? null : nextState;
  }

  componentDidMount() {
    document.addEventListener("keyup", this.bindKeyboard, false);

    if (this.sliderRef.current) {
      this.sliderRef.current.addEventListener("scroll", this.debouncedScroll);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.collectionResources !== prevProps.collectionResources) {
      this.updateMap(this.props.collectionResources, this.props.pagination);
    }

    if (prevState.position !== this.state.position && this.sliderRef.current) {
      const clientWidth = this.sliderRef.current.clientWidth;

      this.sliderRef.current.scrollTo({
        left: (this.state.position - 1) * clientWidth,
        top: 0,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.bindKeyboard, false);

    if (this.sliderRef.current) {
      this.sliderRef.current.removeEventListener(
        "scroll",
        this.debouncedScroll,
      );
    }
  }

  getFigureByType(resource) {
    const { kind } = resource.attributes;
    const key = `Slide${capitalize(kind)}`;
    const Slide = ResourceSlide[key];
    if (Slide) {
      return <Slide resource={resource} {...this.props.slideOptions} />;
    }

    return (
      <ResourceSlide.SlideDefault
        resource={resource}
        {...this.props.slideOptions}
      />
    );
  }

  bindKeyboard = (event) => {
    if (event.keyCode === 39) {
      this.handleSlideNext();
    } else if (event.keyCode === 37) {
      this.handleSlidePrev();
    }
  };

  bindScroll = (event) => {
    const boundary = event.target.getBoundingClientRect();
    const scrollLeft = Math.round(event.target.scrollLeft);
    const width = Math.round(boundary.width);
    const activeCalc = Math.round(scrollLeft / width);
    const active = scrollLeft === 0 || activeCalc < 0 ? 0 : activeCalc;

    if (active + 1 !== this.state.position) {
      this.updatePosition(active + 1);
    }
  };

  handleUnloadedSlide = (position) => {
    const page = this.positionToPage(position, this.props.pagination.perPage);
    if (!this.isPageLoaded(page)) {
      const fetch = resourceCollectionsAPI.collectionResources(
        this.props.resourceCollection.id,
        {},
        { number: page, size: this.props.pagination.perPage },
      );
      this.props.dispatch(request(fetch, requests.feSlideshow));
    }
  };

  handleSlidePrev = () => {
    if (this.state.slideDirection !== "right") {
      this.setState({
        slideDirection: "right",
      });
    }

    let newPosition = this.state.position - 1;
    if (newPosition < 1) newPosition = 1;
    this.updatePosition(newPosition);
  };

  handleSlideNext = () => {
    if (this.state.slideDirection !== "left") {
      this.setState({
        slideDirection: "left",
      });
    }

    let newPosition = this.state.position + 1;
    if (newPosition > this.state.totalCount)
      newPosition = this.state.totalCount;
    this.updatePosition(newPosition);
  };

  isLoaded(index) {
    return (
      this.state.map.hasOwnProperty(index) &&
      typeof this.state.map[index] === "object"
    );
  }

  positionToPage(position, perPage) {
    return Math.ceil(position / perPage);
  }

  isPageLoaded(page) {
    return includes(this.state.loadedPages, page);
  }

  current() {
    return this.state.map[this.state.currentPosition];
  }

  updateMap(collectionResources, pagination) {
    const map = this.buildNewMap(collectionResources, pagination);
    this.setState({ map });
  }

  async updatePosition(newPosition) {
    if (!this.isLoaded(newPosition)) {
      this.handleUnloadedSlide(newPosition);
    }

    this.setState({ position: newPosition });
  }

  buildInitialMap(collectionResources, pagination) {
    const slots = Array.from(Array(pagination.totalCount).keys());
    return { ...slots, ...collectionResources };
  }

  buildNewMap(collectionResources, pagination) {
    const updates = {};
    const start = pagination.perPage * (pagination.currentPage - 1);
    collectionResources.forEach((collectionResource, index) => {
      updates[start + index] = collectionResource;
    });
    return { ...this.state.map, ...updates };
  }

  renderSlideShow() {
    const { map, position } = this.state;
    const slides = Object.values(map);

    return slides.map((slide, index) => (
      <Styled.Slide
        key={slide.id ?? index}
        id={slide.id}
        data-active={index === position - 1}
      >
        {this.isLoaded(index) ? (
          this.getFigureByType(slide)
        ) : (
          <ResourceSlide.SlideLoading />
        )}
      </Styled.Slide>
    ));
  }

  renderPlaceholder() {
    return (
      <Styled.Slide data-active>
        <ResourceSlide.SlidePlaceholder />
      </Styled.Slide>
    );
  }

  render() {
    const position = this.state.position;
    const totalCount = this.state.totalCount;
    const collectionResource = this.state.map[position - 1];
    const collectionResourcesCount = this.props.collectionResources.length;
    const t = this.props.t;

    return (
      <Styled.SlideShow>
        <Styled.SlidesWrapper ref={this.sliderRef}>
          {collectionResourcesCount > 0
            ? this.renderSlideShow()
            : this.renderPlaceholder()}
        </Styled.SlidesWrapper>
        <Styled.Footer>
          {this.isLoaded(position - 1) ? (
            <ResourceSlide.Caption
              resource={collectionResource}
              resourceCollection={this.props.resourceCollection}
              hideDetailUrl={this.props.hideDetailUrl}
              hideDownload={this.props.hideDownload}
            />
          ) : (
            <ResourceSlide.LoadingCaption />
          )}
          {collectionResourcesCount > 0 && (
            <Styled.Pagination>
              <Styled.Ordinal>
                {position} / {totalCount}
              </Styled.Ordinal>
              <Styled.ArrowsWrapper>
                <DirectionalButton
                  onClick={this.handleSlidePrev}
                  direction="left"
                  disabled={position === 1}
                  paginationText={t("pagination.previous_short")}
                  screenReaderText={t("pagination.previous_slide")}
                />
                <Styled.Ordinal $isMobile>
                  {position} / {totalCount}
                </Styled.Ordinal>
                <DirectionalButton
                  onClick={this.handleSlideNext}
                  direction="right"
                  disabled={position === totalCount}
                  paginationText={t("pagination.next")}
                  screenReaderText={t("pagination.next_slide")}
                />
              </Styled.ArrowsWrapper>
            </Styled.Pagination>
          )}
        </Styled.Footer>
      </Styled.SlideShow>
    );
  }
}

export default withTranslation()(ResourceSlideshow);
