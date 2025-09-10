package models

import (
	"context"
	"log"
	"time"

	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/joho/godotenv"
)

type Graph struct {
	Temp         Data `json:"temp"`
	WindSpeed    WindData `json:"windSpeed"`
	Rain         Data `json:"rain"`
	Humi		 Data `json:"humi"`
}

type Data struct {
	Time []string `json:"time"`
	Values []float64 `json:"values"`
}

type WindData struct {
	Time []string `json:"time"`
	Values []float64 `json:"values"`
	WindDir []float64 `json:"windDir"`
}

type GraphModel struct{
	QueryAPI api.QueryAPI
}

func (m *GraphModel) Get() (*Graph, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	query := `from(bucket: "realtime_gauges")
		|> range(start: -12h4m)
		|> filter(fn: (r) => r._measurement == "reference_vut")
		|> filter(fn: (r) => (
			r._field == "pwd_water_intensity"
			or r._field == "temp"
			or r._field == "wind_speed"
			or r._field == "wind_dir"
			or r._field == "humi"
		))`
	results, err := m.QueryAPI.Query(context.Background(), query)
	if err != nil {
		log.Print(err)
	}
	var graphs Graph
	for results.Next() {
		field := results.Record().Field()
		if field == "pwd_water_intensity" {
			graphs.Rain.Time = append(graphs.Rain.Time, results.Record().Time().Format(time.UnixDate))
			graphs.Rain.Values = append(graphs.Rain.Values, results.Record().Value().(float64))
			continue
		} else if field == "temp" {
			graphs.Temp.Time = append(graphs.Temp.Time, results.Record().Time().Format(time.UnixDate))
			graphs.Temp.Values = append(graphs.Temp.Values, results.Record().Value().(float64))
			continue
		} else if field == "humi" {
			graphs.Humi.Time = append(graphs.Humi.Time, results.Record().Time().Format(time.UnixDate))
			graphs.Humi.Values = append(graphs.Humi.Values, results.Record().Value().(float64))
			continue
		} else if field == "wind_speed" {
			graphs.WindSpeed.Time = append(graphs.WindSpeed.Time, results.Record().Time().Format(time.UnixDate))
			graphs.WindSpeed.Values = append(graphs.WindSpeed.Values, results.Record().Value().(float64))
			continue
		} else if field == "wind_dir" {
			graphs.WindSpeed.WindDir = append(graphs.WindSpeed.WindDir, results.Record().Value().(float64))
		}
	}
	if err := results.Err(); err != nil {
		log.Print(err)
	}

	return &graphs, nil
}
