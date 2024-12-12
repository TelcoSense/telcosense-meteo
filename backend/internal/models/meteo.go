package models

import (
	"context"
	"log"
	"time"

	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/joho/godotenv"
	"github.com/nathan-osman/go-sunrise"
)

type Meteo struct {
	Humi      float64   `json:"humi"`
	Press     float64   `json:"press"`
	Visib     float64   `json:"visib"`
	Temp      float64   `json:"temp"`
	WindSpeed float64   `json:"windSpeed"`
	Rain      float64   `json:"rain"`
	Code      float64   `json:"code"`
	Sunrise   time.Time `json:"sunrise"`
	Sunset    time.Time `json:"sunset"`
	RainSum   float64   `json:"rainSum"`
	SnowSum   float64   `json:"snowSum"`
}

type MeteoModel struct {
	QueryAPI api.QueryAPI
}

func (m *MeteoModel) Get() (*Meteo, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	query := `from(bucket: "realtime_gauges")
		|> range(start: -5m)
		|> filter(fn: (r) => r._measurement == "reference_vut")
		|> filter(fn: (r) => (
			r._field == "rain"
			or r._field == "humi"
			or r._field == "temp"
			or r._field == "wind_speed"
			or r._field == "press"
			or r._field == "pwd_visibility"
			or r._field == "pwd_pw_code"
		))
		|> last()`
	results, err := m.QueryAPI.Query(context.Background(), query)
	if err != nil {
		log.Print(err)
	}
	var meteo Meteo
	for results.Next() {
		if results.Record().Field() == "rain" {
			meteo.Rain = results.Record().Value().(float64)
			continue
		} else if results.Record().Field() == "humi" {
			meteo.Humi = results.Record().Value().(float64)
			continue
		} else if results.Record().Field() == "temp" {
			meteo.Temp = results.Record().Value().(float64)
			continue
		} else if results.Record().Field() == "wind_speed" {
			meteo.WindSpeed = results.Record().Value().(float64)
			continue
		} else if results.Record().Field() == "press" {
			meteo.Press = results.Record().Value().(float64)
			continue
		} else if results.Record().Field() == "pwd_visibility" {
			meteo.Visib = results.Record().Value().(float64)
			continue
		} else if results.Record().Field() == "pwd_pw_code" {
			meteo.Code = results.Record().Value().(float64)
			continue
		}
	}
	rainSumQuery := `from(bucket: "realtime_gauges")
		|> range(start: -24h)
		|> filter(fn: (r) => r._measurement == "reference_vut")
		|> filter(fn: (r) => (
			r._field == "rain"
		))
		|> sum()`
	rainSumResult, err := m.QueryAPI.Query(context.Background(), rainSumQuery)
	if err != nil {
		log.Print(err)
	}

	for rainSumResult.Next() {
		meteo.RainSum = rainSumResult.Record().Value().(float64)
	}

	snowSumQuery := `from(bucket: "realtime_gauges")
		|> range(start: -24h)
		|> filter(fn: (r) => r._measurement == "reference_vut")
		|> filter(fn: (r) => (
			r._field == "pwd_snow_sum"
		))`
	snowSumResult, err := m.QueryAPI.Query(context.Background(), snowSumQuery)
	if err != nil {
		log.Print(err)
	}
	var snowSumSlice []float64

	for snowSumResult.Next() {
		snowSumSlice = append(snowSumSlice, snowSumResult.Record().Value().(float64))
	}
	snowSumArray := [2]float64{snowSumSlice[0], snowSumSlice[len(snowSumSlice)-1]}

	if snowSumArray[1]-snowSumArray[0] < 0 {
		meteo.SnowSum = 999 - snowSumArray[0] + snowSumArray[1]
	} else {
		meteo.SnowSum = snowSumArray[1] - snowSumArray[0]
	}

	rise, set := sunrise.SunriseSunset(
		49.2271187779858, 16.57441338218726,
		time.Now().Year(), time.Now().Month(), time.Now().Day(),
	)
	meteo.Sunrise = rise
	meteo.Sunset = set

	if err := results.Err(); err != nil {
		log.Print(err)
	}

	return &meteo, nil
}
