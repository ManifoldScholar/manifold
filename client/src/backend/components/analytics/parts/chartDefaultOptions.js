const HIGHLIGHT_COLOR = "#61CAFF";
const TEXT_COLOR = "#9a9a9a";
const LINE_COLOR = "#696969";

const defaultOptions = {
  chart: {
    height: 175,
    type: "line",
    fontFamily: "'sofia-pro', 'trueno', sans-serif",
    foreColor: TEXT_COLOR,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  colors: [HIGHLIGHT_COLOR],
  grid: {
    borderColor: LINE_COLOR,
    strokeDashArray: 3,
    padding: {
      top: -20,
      right: -24,
      bottom: -14,
      left: -10
    }
  },
  legend: {
    show: false
  },
  markers: {
    colors: HIGHLIGHT_COLOR,
    size: 0,
    strokeWidth: 0,
    hover: {
      size: 7
    }
  },
  stroke: {
    curve: "smooth",
    width: 3,
    lineCap: "round"
  },
  tooltip: {
    custom({ series, seriesIndex, dataPointIndex, w }) {
      const label = w.globals.categoryLabels[dataPointIndex];
      const value = `${series[seriesIndex][dataPointIndex]} ${w.globals.seriesNames[seriesIndex]}`;
      return (
        '<div class="analytics-chart__tooltip">' +
        '<span class="analytics-chart__tooltip-label">' +
        label +
        "</span>" +
        '<span class="analytics-chart__tooltip-value">' +
        value +
        "</span>" +
        "</div>"
      );
    }
  },
  xaxis: {
    type: "datetime",
    labels: {
      format: "MMM d",
      hideOverlappingLabels: true,
      style: {
        cssClass: "analytics-chart__label"
      }
    },
    tooltip: {
      enabled: false
    },
    axisBorder: {
      color: LINE_COLOR
    },
    axisTicks: {
      height: 10,
      offsetY: -10
    },
    crosshairs: {
      show: false
    }
  },
  yaxis: {
    show: false,
    tooltip: {
      enabled: false
    },
    crosshairs: {
      show: false
    }
  }
};

export default defaultOptions;
