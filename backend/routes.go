package main

import "net/http"

func (app *application) routes() *http.ServeMux {
	router := http.NewServeMux()

	router.HandleFunc("GET /api/meteo", app.getMeteo)
	router.HandleFunc("GET /api/graph", app.getGraph)

	return router
}
