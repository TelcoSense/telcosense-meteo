const mapCode = (code, isDay) => {
  switch (code) {
    case 0:
      return {
        text: "Clear",
        rain: 0,
        icon: isDay ? "PCLOUDY" : "PCLOUDY0",
        skyColor: isDay ? "#60B2FE" : "#203B54",
        cloudDensity: 80000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 4:
    case 5:
      return {
        text: "Haze/Smoke",
        rain: 0,
        icon: isDay ? "FOG" : "FOG0",
        skyColor: isDay ? "#91a3b4" : "#444C54",
        cloudDensity: 60000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 10:
      return {
        text: "Mist",
        rain: 0,
        icon: isDay ? "FOG" : "FOG0",
        skyColor: isDay ? "#91a3b4" : "#444C54",
        cloudDensity: 60000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 30:
    case 31:
    case 32:
    case 33:
    case 34:
      return {
        text: "Fog",
        rain: 0,
        icon: isDay ? "FOG" : "FOG0",
        skyColor: isDay ? "#48596a" : "#242D36",
        cloudDensity: 60000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 21:
    case 22:
    case 40:
    case 41:
    case 51:
      return {
        text: "Light Drizzle",
        rain: 200,
        icon: isDay ? "RAIN" : "RAIN0",
        skyColor: isDay ? "#3672b6" : "#17324F",
        cloudDensity: 40000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 50:
    case 52:
      return {
        text: "Moderate Drizzle",
        rain: 400,
        icon: isDay ? "RAIN" : "RAIN0",
        skyColor: isDay ? "#3063a0" : "#152B45",
        cloudDensity: 40000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 42:
    case 53:
      return {
        text: "Heavy Drizzle",
        rain: 800,
        icon: isDay ? "RAIN" : "RAIN0",
        skyColor: isDay ? "#295589" : "#142942",
        cloudDensity: 40000,
        cloudTexture: isDay ? "cloud" : "cloud",
        dropTexture: "drop",
      };
    case 61:
    case 80:
    case 81:
      return {
        text: "Light Rain",
        rain: 1600,
        icon: isDay ? "RAIN" : "RAIN0",
        skyColor: isDay ? "#224772" : "#132840",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 23:
      return {
        text: "Rain",
        rain: 3200,
        icon: isDay ? "SHOWER" : "SHOWER0",
        skyColor: isDay ? "#1b395b" : "#12263D",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud" : "cloud",
        dropTexture: "drop",
      };
    case 60:
    case 62:
    case 82:
      return {
        text: "Moderate Rain",
        rain: 3200,
        icon: isDay ? "SHOWER" : "SHOWER0",
        skyColor: isDay ? "#1b395b" : "#12263D",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud" : "cloud",
        dropTexture: "drop",
      };
    case 63:
    case 83:
    case 84:
      return {
        text: "Heavy Rain",
        rain: 6400,
        icon: isDay ? "SHOWER" : "SHOWER0",
        skyColor: isDay ? "#142b44" : "#102338",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud" : "cloud",
        dropTexture: "drop",
      };
    case 24:
    case 70:
      return {
        text: "Snow",
        rain: 3200,
        icon: isDay ? "SNOW" : "SNOW0",
        skyColor: isDay ? "#224772" : "#132840",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "snowflake",
      };
    case 71:
    case 74:
    case 85:
      return {
        text: "Light snow",
        rain: 1600,
        icon: isDay ? "SNOW" : "SNOW0",
        skyColor: isDay ? "#224772" : "#132840",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "snowflake",
      };
    case 72:
    case 75:
    case 86:
      return {
        text: "Moderate snow",
        rain: 3200,
        icon: isDay ? "SNOW" : "SNOW0",
        skyColor: isDay ? "#1b395b" : "#12263D",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "snowflake",
      };
    case 73:
    case 76:
    case 87:
      return {
        text: "Heavy snow",
        rain: 6400,
        icon: isDay ? "SNOW" : "SNOW0",
        skyColor: isDay ? "#142b44" : "#102338",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "snowflake",
      };
    case 25:
    case 64:
    case 65:
    case 66:
      return {
        text: "Freezing rain",
        rain: 3200,
        icon: isDay ? "SLEET" : "SLEET0",
        skyColor: isDay ? "#1b395b" : "#12263D",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud" : "cloud",
        dropTexture: "drop",
      };
    case 54:
    case 55:
    case 56:
      return {
        text: "Freezing drizzle",
        rain: 400,
        icon: isDay ? "SLEET" : "SLEET0",
        skyColor: isDay ? "#3063a0" : "#152B45",
        cloudDensity: 40000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
        dropTexture: "drop",
      };
    case 67:
    case 68:
      return {
        text: "Rain and snow",
        rain: 3200,
        icon: isDay ? "SLEET" : "SLEET0",
        skyColor: isDay ? "#1b395b" : "#12263D",
        cloudDensity: 20000,
        cloudTexture: isDay ? "cloud" : "cloud",
        dropTexture: "drop",
      };
    default:
      return {
        text: "-",
        rain: 0,
        icon: "UNKNOWN",
        skyColor: isDay ? "#60B2FE" : "#203B54",
        cloudDensity: 50000,
        cloudTexture: isDay ? "cloud_white" : "cloud_night",
      };
  }
};

const createRotatedArrowImg = (deg) => {
  const arrowSvg = `
    <svg
    width="60"
    height="60"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 300"
    >
   <g transform="rotate(${deg - 180} 150 150)" class="layer" id="Layer_1">
   <title>Layer 1</title>
   <path d="m129.77,93.36l20.23,-59.08l20.23,59.08l-10.12,0l0,59.36l-20.23,0l0,-59.36z" fill="#FF0000" id="svg_2" stroke="#FF0000" stroke-width="0"/>
  </g>
  </svg>
    `;

  const blob = new Blob([arrowSvg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const arrow = new Image();
  arrow.src = url;
  return arrow;
};
