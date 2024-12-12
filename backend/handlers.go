package main

import (
	"encoding/json"
	"net/http"
)

func (app *application) getMeteo(w http.ResponseWriter, r *http.Request) {
	meteo, err := app.meteo.Get()
	if err != nil {
		app.errorLog.Print(err)
	}
	json, err := json.MarshalIndent(meteo, "", "\t")
	if err != nil {
		app.errorLog.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(json)
}

func (app *application) getGraph(w http.ResponseWriter, r *http.Request) {
	graphs, err := app.graph.Get()
	if err != nil {
		app.errorLog.Print(err)
	}
	json, err := json.MarshalIndent(graphs, "", "\t")
	if err != nil {
		app.errorLog.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(json)
}
