const highlightColor = "#61CAFF";
const textColor = "#9a9a9a";
const lineColor = "#696969";

const defaultOptions = {
  chart: {
    height: 175,
    type: "line",
    fontFamily: "'sofia-pro', 'trueno', sans-serif",
    foreColor: textColor,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  colors: [highlightColor],
  grid: {
    borderColor: lineColor,
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
    colors: highlightColor,
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
    type: "category",
    labels: {
      hideOverlappingLabels: true,
      style: {
        cssClass: "analytics-chart__label"
      }
    },
    tooltip: {
      enabled: false
    },
    axisBorder: {
      color: lineColor
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
