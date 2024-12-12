package main

import (
	"log"
	"net/http"
	"os"

	"gihub.com/kubja711/GO_backend/internal/models"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/joho/godotenv"
)

type application struct {
	errorLog *log.Logger
	infoLog  *log.Logger
	meteo    *models.MeteoModel
	graph    *models.GraphModel
}

func main() {
	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	token := os.Getenv("METEO_INFLUXDB_TOKEN")
	org := os.Getenv("METEO_INFLUX_ORG")
	url := os.Getenv("METEO_INFLUX_URL")
	client := influxdb2.NewClient(url, token)
	queryAPI := client.QueryAPI(org)

	app := &application{
		errorLog: errorLog,
		infoLog:  infoLog,
		meteo:    &models.MeteoModel{QueryAPI: queryAPI},
		graph:    &models.GraphModel{QueryAPI: queryAPI},
	}

	server := &http.Server{
		Addr:     os.Getenv("METEO_PORT"),
		ErrorLog: errorLog,
		Handler:  app.routes(),
	}
	infoLog.Printf("Starting server on %s", server.Addr)
	err = server.ListenAndServe()
	errorLog.Fatal(err)
}
