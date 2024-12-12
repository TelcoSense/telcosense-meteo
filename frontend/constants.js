const rainChartOptions = {
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          unit: "minute",
          displayFormats: {
            minute: "HH:mm",
          },
          unitStepSize: 60,
        },
        ticks: {
          fontSize: 20,
          fontColor: "#ffffff",
          fontFamily: "Chivo",
        },
        gridLines: {
          color: "rgba(255, 255, 255, 0.3)",
          lineWidth: 2,
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Rain Intensity [mm/h]",
          fontColor: "#ffffff",
          fontSize: 17,
          fontFamily: "Chivo",
        },
        ticks: {
          fontSize: 20,
          fontColor: "#ffffff",
          min: 0,
          fontFamily: "Chivo",
        },
        gridLines: {
          color: "rgba(255, 255, 255, 0.3)",
          lineWidth: 2,
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  elements: {
    line: {
      tension: 0,
    },
  },
};

const tempChartOptions = {
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          unit: "minute",
          displayFormats: {
            minute: "HH:mm",
          },
          unitStepSize: 60,
        },
        ticks: {
          fontSize: 20,
          fontColor: "#ffffff",
          fontFamily: "Chivo",
        },
        gridLines: {
          color: "rgba(255, 255, 255, 0.3)",
          lineWidth: 2,
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Temperature [°C]",
          fontColor: "#ffffff",
          fontSize: 17,
          fontFamily: "Chivo",
        },
        ticks: {
          fontSize: 20,
          fontColor: "#ffffff",
          fontFamily: "Chivo",
        },
        gridLines: {
          color: "rgba(255, 255, 255, 0.3)",
          lineWidth: 2,
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  elements: {
    line: {
      tension: 0,
    },
  },
};

const windChartOptions = {
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Time [hh:mm]",
          fontColor: "#ffffff",
          fontSize: 17,
          fontFamily: "Chivo",
        },
        type: "time",
        time: {
          unit: "minute",
          displayFormats: {
            minute: "HH:mm",
          },
          unitStepSize: 60,
        },
        ticks: {
          fontSize: 20,
          fontColor: "#ffffff",
          fontFamily: "Chivo",
        },
        gridLines: {
          color: "rgba(255, 255, 255, 0.3)",
          lineWidth: 2,
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Wind Speed [m/s]",
          fontColor: "#ffffff",
          fontSize: 17,
          fontFamily: "Chivo",
        },
        ticks: {
          fontSize: 20,
          fontColor: "#ffffff",
          fontFamily: "Chivo",
        },
        gridLines: {
          color: "rgba(255, 255, 255, 0.3)",
          lineWidth: 2,
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  elements: {
    line: {
      tension: 0,
    },
  },
};
