let tempChart, rainChart, windChart, humiChart;
let prevWeatherObj;

const ARROW_SVG_URL =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100">' +
      '<g transform="rotate(180, 50, 50)">' +
      '<polygon points="50,0 30,40 45,40 45,100 55,100 55,40 70,40" fill="orange"/>' +
      "</g></svg>"
  );

async function getMeteo() {
  const data = fetch(`${BACKEND_URL}/api/meteo`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
  return data;
}

async function getGraph() {
  const data = fetch(`${BACKEND_URL}/api/graph`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
  return data;
}

function createEChart(
  containerId,
  seriesData,
  xLabels,
  yLabel,
  lineColor = "#ffffff",
  symbolOptions = {}
) {
  const container = document.getElementById(containerId);
  const chart = echarts.init(container);
  const u =
    parseFloat(
      getComputedStyle(document.querySelector(".container")).getPropertyValue(
        "--u"
      )
    ) || 10;

  const isMobile = window.innerWidth <= 1024;

  const splitCount = isMobile ? 6 : 12;

  const gridLayout = isMobile
    ? {
        top: "15%",
        left: "20%",
        right: "6%",
        bottom: "18%",
      }
    : {
        top: "15%",
        left: "8%",
        right: "4%",
        bottom: "18%",
      };

  const timeData = xLabels.map(function (l, i) {
    return [new Date(l), seriesData[i]];
  });

  const timeMin = new Date(xLabels[0]).getTime();
  const timeMax = new Date(xLabels[xLabels.length - 1]).getTime();

  const series = [
    {
      type: "line",
      data: timeData,
      smooth: false,
      symbol: "none",
      lineStyle: {
        color: lineColor,
        width: 0.15 * u,
      },
      z: 1,
    },
  ];

  if (symbolOptions && symbolOptions.enabled && symbolOptions.symbolData) {
    series.push({
      type: "scatter",
      data: symbolOptions.symbolData,
      symbol: "image://" + symbolOptions.image,
      symbolSize: u * 2.8,

      symbolRotate: function (value, params) {
        return -symbolOptions.rotations[params.dataIndex];
      },
      tooltip: { show: false },
      label: { show: false },
      itemStyle: { opacity: 1 },
      z: 2,
      animation: false,
    });
  }

  const option = {
    backgroundColor: "transparent",
    animation: false,
    grid: gridLayout,

    tooltip: { show: false }, // Disable tooltip

    xAxis: {
      type: "time",
      min: timeMin,
      max: timeMax,
      splitNumber: splitCount,
      axisPointer: {
        show: isMobile ? false : true,
        label: {
          show: true,
          backgroundColor: "#333",
          color: "#fff",
          fontFamily: "Chivo",
          fontSize: u * 1,
        },
        lineStyle: {
          color: "#aaa",
          width: 1,
          type: "solid",
        },
      },
      axisLabel: {
        formatter: function (value) {
          var d = new Date(value);
          var hours = d.getHours();
          var minutes = d.getMinutes();
          if (hours < 10) hours = "0" + hours;
          if (minutes < 10) minutes = "0" + minutes;
          return hours + ":" + minutes;
        },
        fontSize: u * 1.5,
        color: "#fff",
        fontFamily: "Chivo",
      },
      axisLine: { lineStyle: { color: "#fff" } },
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(255, 255, 255, 0.35)", type: "solid" },
      },
    },

    yAxis: {
      type: "value",
      scale: true,
      name: yLabel,
      nameLocation: "middle",
      nameGap: u * 5,
      nameRotate: 90,
      nameTextStyle: {
        color: "#fff",
        fontFamily: "Chivo",
        fontSize: u * 1.5,
      },
      axisPointer: {
        show: isMobile ? false : true,
        label: {
          show: true,
          backgroundColor: "#333",
          color: "#fff",
          fontFamily: "Chivo",
          fontSize: u * 1,
        },
        lineStyle: {
          color: "#aaa",
          width: 1,
          type: "solid",
        },
      },
      axisLabel: {
        fontSize: u * 1.5,
        color: "#fff",
        fontFamily: "Chivo",
      },
      axisLine: { lineStyle: { color: "#fff" } },
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(255, 255, 255, 0.35)", type: "solid" },
      },
    },

    series: series,
  };

  chart.setOption(option);
  return chart;
}

async function setMeteo() {
  const data = await getMeteo();
  const tempSpan = document.getElementById("temp");
  const pressSpan = document.getElementById("press");
  const visibSpan = document.getElementById("visib");

  tempSpan.innerHTML = `${(Math.round(data.temp * 10) / 10).toFixed(1)}  °C`;
  pressSpan.innerHTML = `${(Math.round(data.press * 10) / 10).toFixed(1)} hPa`;
  visibSpan.innerHTML = `${data.visib} m`;

  const feelsLikeSpan = document.getElementById("feelsLike");
  const dewPointSpan = document.getElementById("dewPoint");

  const feelsLike =
    data.temp +
    0.33 *
      ((data.humi / 100) *
        6.105 *
        Math.exp((17.27 * data.temp) / (237.7 + data.temp))) -
    0.7 * data.windSpeed -
    4.0;
  feelsLikeSpan.innerHTML = `${(Math.round(feelsLike * 10) / 10).toFixed(
    1
  )}  °C`;

  const dewPoint =
    (243.04 *
      (Math.log(data.humi / 100) +
        (17.625 * data.temp) / (243.04 + data.temp))) /
    (17.625 -
      Math.log(data.humi / 100) -
      (17.625 * data.temp) / (243.04 + data.temp));
  dewPointSpan.innerHTML = `${(Math.round(dewPoint * 10) / 10).toFixed(1)}  °C`;

  const rainSumSpan = document.getElementById("rainSum");
  rainSumSpan.innerHTML = `${(Math.round(data.rainSum * 10) / 10).toFixed(
    1
  )} mm`;

  if ((Math.round(data.temp * 10) / 10).toFixed(1) < 3) {
    const snowDiv = document.getElementById("snowDiv");
    snowDiv.style.visibility = "visible";
    const snowSumSpan = document.getElementById("snowSum");
    snowSumSpan.innerHTML = `${(Math.round(data.snowSum * 10) / 10).toFixed(
      1
    )} mm`;
  } else {
    const snowDiv = document.getElementById("snowDiv");
    snowDiv.style.visibility = "hidden";
  }

  const sunrise = moment(data.sunrise);
  const sunset = moment(data.sunset);
  document.getElementById("sunrise").innerHTML = sunrise.format("HH:mm");
  document.getElementById("sunset").innerHTML = sunset.format("HH:mm");

  const isDay = moment().isAfter(sunrise) && moment().isBefore(sunset);
  const weather = mapCode(data.code, isDay);

  const weatherTextSpan = document.getElementById("weatherText");
  weatherTextSpan.innerHTML = weather.text;

  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.src = `../public/SVG/${weather.icon}.svg`;

  document.documentElement.style.backgroundColor = weather.skyColor;

  if (document.querySelector(".animation canvas")) {
    if (
      JSON.stringify({
        cloudTexture: weather.cloudTexture,
        rain: weather.rain,
        skyColor: weather.skyColor,
        cloudDensity: weather.cloudDensity,
        dropTexture: weather.dropTexture,
      }) === JSON.stringify(prevWeatherObj)
    ) {
      return;
    }
    document.querySelector(".animation canvas").remove();
    new Rain({
      target: document.getElementById("animation"),
      resources: {
        cloud: `../public/${weather.cloudTexture}.png`,
        drop: `../public/${weather.dropTexture}.png`,
      },
      rainCount: weather.rain,
      skyColor: weather.skyColor,
      cloudDensity: weather.cloudDensity,
    });
  } else {
    new Rain({
      target: document.getElementById("animation"),
      resources: {
        cloud: `../public/${weather.cloudTexture}.png`,
        drop: `../public/${weather.dropTexture}.png`,
      },
      rainCount: weather.rain,
      skyColor: weather.skyColor,
      cloudDensity: weather.cloudDensity,
    });
  }
  prevWeatherObj = {
    cloudTexture: weather.cloudTexture,
    rain: weather.rain,
    skyColor: weather.skyColor,
    cloudDensity: weather.cloudDensity,
    dropTexture: weather.dropTexture,
  };
}

function averageByInterval(times, values, intervalMinutes, windDirs = null) {
  const intervalMs = intervalMinutes * 60 * 1000;
  const buckets = {};

  // Step 1: Group values (and optionally windDirs) into buckets
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    const bucketTime = Math.floor(t / intervalMs) * intervalMs;

    if (!buckets[bucketTime]) {
      buckets[bucketTime] = { values: [], dirs: [] };
    }
    buckets[bucketTime].values.push(values[i]);
    if (windDirs) {
      buckets[bucketTime].dirs.push(windDirs[i]);
    }
  }

  const bucketKeys = Object.keys(buckets)
    .map(Number)
    .sort((a, b) => a - b);

  const averagedValues = [];
  const averagedDirs = [];

  for (const key of bucketKeys) {
    const { values: vals, dirs } = buckets[key];

    // Linear average for speed
    const avgVal = vals.reduce((sum, val) => sum + val, 0) / (vals.length || 1);
    averagedValues.push([key + intervalMs / 2, avgVal]);

    if (windDirs) {
      // Circular mean for wind direction
      let sinSum = 0;
      let cosSum = 0;
      for (let d of dirs) {
        const rad = (d * Math.PI) / 180;
        sinSum += Math.sin(rad);
        cosSum += Math.cos(rad);
      }
      const avgRad = Math.atan2(sinSum, cosSum);
      const avgDeg = (avgRad * 180) / Math.PI;
      const normalized = (avgDeg + 360) % 360;
      averagedDirs.push([key + intervalMs / 2, normalized]);
    }
  }

  // Step 3: Interpolate back to original timestamps
  const resultValues = [];
  const resultDirs = [];

  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();

    let beforeVal = null,
      afterVal = null;
    let beforeDir = null,
      afterDir = null;

    for (let j = 0; j < averagedValues.length; j++) {
      if (averagedValues[j][0] <= t) beforeVal = averagedValues[j];
      if (averagedValues[j][0] >= t) {
        afterVal = averagedValues[j];
        break;
      }
    }

    if (!beforeVal && afterVal) {
      resultValues.push(afterVal[1]);
    } else if (beforeVal && !afterVal) {
      resultValues.push(beforeVal[1]);
    } else if (beforeVal && afterVal) {
      const [t0, v0] = beforeVal;
      const [t1, v1] = afterVal;
      resultValues.push(
        t1 === t0 ? v0 : v0 + ((v1 - v0) * (t - t0)) / (t1 - t0)
      );
    } else {
      resultValues.push(null);
    }

    if (windDirs) {
      for (let j = 0; j < averagedDirs.length; j++) {
        if (averagedDirs[j][0] <= t) beforeDir = averagedDirs[j];
        if (averagedDirs[j][0] >= t) {
          afterDir = averagedDirs[j];
          break;
        }
      }

      if (!beforeDir && afterDir) {
        resultDirs.push(afterDir[1]);
      } else if (beforeDir && !afterDir) {
        resultDirs.push(beforeDir[1]);
      } else if (beforeDir && afterDir) {
        const [t0, d0] = beforeDir;
        const [t1, d1] = afterDir;
        // Interpolate circularly
        let delta = ((d1 - d0 + 540) % 360) - 180;
        const interp = (d0 + (delta * (t - t0)) / (t1 - t0) + 360) % 360;
        resultDirs.push(interp);
      } else {
        resultDirs.push(null);
      }
    }
  }

  return windDirs
    ? { times: times.slice(), values: resultValues, windDirs: resultDirs }
    : { times: times.slice(), values: resultValues };
}

async function setGraph() {
  const data = await getGraph();
  document.getElementById("tempMin").innerHTML = `${(
    Math.round(Math.min(...data.temp.values) * 10) / 10
  ).toFixed(1)} °C`;
  document.getElementById("tempMax").innerHTML = `${(
    Math.round(Math.max(...data.temp.values) * 10) / 10
  ).toFixed(1)} °C`;

  document.getElementById("humiCurrent").innerHTML = `${data.humi.values[
    data.humi.values.length - 1
  ].toFixed(1)} %`;
  document.getElementById("humiMax").innerHTML = `${(
    Math.round(Math.max(...data.humi.values) * 10) / 10
  ).toFixed(1)} %`;

  document.getElementById("rainCurrent").innerHTML = `${(
    Math.round(data.rain.values[data.rain.values.length - 1] * 100) / 100
  ).toFixed(2)} mm/h`;
  document.getElementById("rainMax").innerHTML = `${(
    Math.round(Math.max(...data.rain.values) * 100) / 100
  ).toFixed(2)} mm/h`;

  const windAvg = averageByInterval(
    data.windSpeed.time,
    data.windSpeed.values,
    5,
    data.windSpeed.windDir
  );

  document.getElementById("windCurrent").innerHTML = `${data.windSpeed.values[
    data.windSpeed.values.length - 1
  ].toFixed(1)} m/s`;
  document.getElementById("windMax").innerHTML = `${Math.max(
    ...data.windSpeed.values
  ).toFixed(1)} m/s`;

  var arrowData = [];
  var arrowRotations = [];

  const isMobile = window.innerWidth <= 1024;

  for (var i = 0; i < windAvg.times.length; i++) {
    var t = new Date(windAvg.times[i]);
    const contidion = isMobile
      ? t.getMinutes() === 0 && t.getHours() % 2 === 0
      : t.getMinutes() === 0;
    if (contidion) {
      var v = windAvg.values[i];
      var d = windAvg.windDirs[i];
      arrowData.push([t, v]);
      arrowRotations.push(d);
    }
  }

  tempChart = createEChart(
    "tempChart",
    data.temp.values,
    data.temp.time,
    "Temperature [°C]"
  );

  humiChart = createEChart(
    "humiChart",
    data.humi.values,
    data.humi.time,
    "Humidity [%]"
  );

  rainChart = createEChart(
    "rainChart",
    data.rain.values,
    data.rain.time,
    "Rain intensity [mm/h]"
  );

  const symbolOptions = {
    enabled: true,
    image: ARROW_SVG_URL,
    symbolData: arrowData,
    rotations: arrowRotations,
  };

  windChart = createEChart(
    "windChart",
    windAvg.values,
    windAvg.times,
    "Wind speed [m/s]",
    "#ffffff",
    symbolOptions
  );
}

function setTimeDate() {
  const now = moment();
  const dateDiv = document.getElementById("date");
  dateDiv.innerHTML = now.format("DD.MM.YYYY");
  const timeDiv = document.getElementById("time");
  timeDiv.innerHTML = now.format("HH:mm:ss");
}

function createChart(id, data, labels, options, pointStyle = false) {
  let ctx = document.getElementById(id).getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.map((l) => {
        return moment(l);
      }),
      datasets: [
        {
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "#ffffff",
          borderWidth: 3,
          data: data,
          pointBorderColor: "rgba(0, 0, 0, 0)",
          pointStyle: pointStyle,
        },
      ],
    },
    options: options,
  });
}

let prevBoundingRect = null;
let resizeTimeout = null;

function handleChartResize() {
  if (resizeTimeout) clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const container = document.querySelector(".container");
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Only skip if dimensions didn’t actually change (to avoid false resizes)
    if (
      prevBoundingRect &&
      Math.abs(rect.width - prevBoundingRect.width) < 2 &&
      Math.abs(rect.height - prevBoundingRect.height) < 2
    ) {
      return;
    }

    // Update previous rect (whether it's first resize or not)
    prevBoundingRect = rect;

    // Proper redraw
    if (tempChart) {
      tempChart.dispose();
      humiChart.dispose();
      rainChart.dispose();
      windChart.dispose();
    }

    setGraph();
  }, 150);
}

function resizeToAspect() {
  const container = document.querySelector(".container");
  const qrCol = document.querySelector(".col-2-2");
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw <= 1024;

  if (!container) return;

  // Clear dimensions first
  container.style.removeProperty("width");
  container.style.removeProperty("height");

  if (isMobile) {
    // Mobile layout: natural height and stacking
    container.style.height = "auto";
    container.style.width = "100%";

    // Set smaller base unit (u) for scaling
    container.style.setProperty("--u", "7px");

    // Hide QR code column
    if (qrCol) {
      qrCol.style.width = "0px";
      qrCol.style.height = "0px";
    }
    return;
  }

  // Desktop 16:9 layout
  const aspectW = 16;
  const aspectH = 9;

  let width = vw;
  let height = Math.round((vw * aspectH) / aspectW);

  if (height > vh) {
    height = vh;
    width = Math.round((vh * aspectW) / aspectH);
  }

  container.style.width = width + "px";
  container.style.height = height + "px";

  const scaleUnit = height / 100;
  container.style.setProperty("--u", scaleUnit + "px");

  if (qrCol) {
    const row = qrCol.parentElement;
    const rowHeight = row.clientHeight;
    qrCol.style.width = rowHeight + "px";
    qrCol.style.height = rowHeight + "px";
  }
}

function adjustQrSquare() {
  const qrCol = document.querySelector(".col-2-2");
  if (!qrCol) return;

  // row height is defined as 20% of container height
  const row = qrCol.parentElement;
  const rowHeight = row.clientHeight;

  qrCol.style.width = rowHeight + "px";
  qrCol.style.height = rowHeight + "px";
}

async function init() {
  setTimeDate();
  
  window.addEventListener("resize", () => {
    resizeToAspect();
    adjustQrSquare();
    handleChartResize();
  });

  window.addEventListener("load", () => {
    resizeToAspect();
    adjustQrSquare();
  });

  setTimeout(async () => {
    await setMeteo();
    await setGraph();
    const loadingDiv = document.querySelector("#loading");
    loadingDiv.style.display = "none";
  }, 150);

  setInterval(() => {
    setMeteo();
    setGraph();
  }, 15000);

  setInterval(() => {
    setTimeDate();
  }, 1000);
}

init();
