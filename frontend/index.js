let tempChart, rainChart, windChart;
let prevWeatherObj;

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

async function setMeteo() {
  const data = await getMeteo();
  const tempSpan = document.getElementById("temp");
  const humiSpan = document.getElementById("humi");
  const pressSpan = document.getElementById("press");
  const visibSpan = document.getElementById("visib");
  tempSpan.innerHTML = `${(Math.round(data.temp * 10) / 10).toFixed(1)}  °C`;
  humiSpan.innerHTML = `${(Math.round(data.humi * 10) / 10).toFixed(1)} %`;
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
    1,
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
    1,
  )} mm`;

  if ((Math.round(data.temp * 10) / 10).toFixed(1) < 3) {
    const snowDiv = document.getElementById("snowDiv");
    snowDiv.style.visibility = "visible";
    const snowSumSpan = document.getElementById("snowSum");
    snowSumSpan.innerHTML = `${(Math.round(data.snowSum * 10) / 10).toFixed(
      1,
    )} mm`;
  }
  else {
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

  document.body.style.backgroundColor = weather.skyColor;
  document.getElementById("main").style.backgroundColor = weather.skyColor;

  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.src = `../public/SVG/${weather.icon}.svg`;

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

async function setGraph() {
  const data = await getGraph();
  document.getElementById("tempMin").innerHTML = `${(
    Math.round(Math.min(...data.temp.values) * 10) / 10
  ).toFixed(1)} °C`;
  document.getElementById("tempMax").innerHTML = `${(
    Math.round(Math.max(...data.temp.values) * 10) / 10
  ).toFixed(1)} °C`;

  document.getElementById("rainCurrent").innerHTML = `${(
    Math.round(data.rain.values[data.rain.values.length - 1] * 100) / 100
  ).toFixed(2)} mm/h`;
  document.getElementById("rainMax").innerHTML = `${(
    Math.round(Math.max(...data.rain.values) * 100) / 100
  ).toFixed(2)} mm/h`;

  document.getElementById("windCurrent").innerHTML = `${data.windSpeed.values[
    data.windSpeed.values.length - 1
  ].toFixed(1)} m/s`;
  document.getElementById("windMax").innerHTML = `${Math.max(
    ...data.windSpeed.values,
  ).toFixed(1)} m/s`;

  if (tempChart) {
    tempChart.data.datasets[0].data = data.temp.values;
    tempChart.data.labels = data.temp.time;
    tempChart.update(0);
  } else {
    tempChart = createChart(
      "tempChart",
      data.temp.values,
      data.temp.time,
      tempChartOptions,
    );
  }

  if (rainChart) {
    rainChart.data.datasets[0].data = data.rain.values;
    rainChart.data.labels = data.rain.time;
    rainChart.update(0);
  } else {
    rainChart = createChart(
      "rainChart",
      data.rain.values,
      data.rain.time,
      rainChartOptions,
    );
  }

  const arrowPoints = data.windSpeed.windDir.map((item, index) => {
    if (index % 60 === 0) {
      return createRotatedArrowImg(item);
    }
    return false;
  });
  if (windChart) {
    windChart.data.datasets[0].data = data.windSpeed.values;
    windChart.data.labels = data.windSpeed.time;
    windChart.update(0);
  } else {
    windChart = createChart(
      "windChart",
      data.windSpeed.values,
      data.windSpeed.time,
      windChartOptions,
      arrowPoints,
    );
  }
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

function init() {
  setTimeDate();
  setGraph();
  setMeteo();
  setInterval(() => {
    setMeteo();
    setGraph();
  }, 15000);
  setInterval(() => {
    setTimeDate();
  }, 1000);
}

init();
