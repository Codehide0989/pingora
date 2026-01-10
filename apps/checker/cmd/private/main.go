package main

import (
	"context"
	"fmt"
	"net/http"

	"os"
	"os/signal"
	"syscall"
	"time"

	"connectrpc.com/connect"
	"github.com/madflojo/tasks"
	"github.com/pingorahq/pingora/apps/checker/pkg/job"
	"github.com/pingorahq/pingora/apps/checker/pkg/scheduler"

	v1 "github.com/pingorahq/pingora/apps/checker/proto/private_location/v1"
)

const (
	configRefreshInterval = 10 * time.Minute
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Graceful shutdown on interrupt
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigChan
		cancel()
	}()
	fmt.Println("Launching pingora private location checker")
	s := tasks.New()
	defer s.Stop()

	apiKey := getEnv("PINGORA_KEY", "")

	monitorManager := scheduler.MonitorManager{
		Client:    getClient(apiKey),
		JobRunner: job.NewJobRunner(),
		Scheduler: s,
	}
	configTicker := time.NewTicker(configRefreshInterval)
	defer configTicker.Stop()

	monitorManager.UpdateMonitors(ctx)
	for {
		select {
		case <-ctx.Done():
			return
		case <-configTicker.C:
			fmt.Println("fetching monitors")
			monitorManager.UpdateMonitors(ctx)
		}
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getClient(apiKey string) v1.PrivateLocationServiceClient {
	ingestUrl := getEnv("PINGORA_INGEST_URL", "https://pingora-private-location.fly.dev")

	client := v1.NewPrivateLocationServiceClient(
		http.DefaultClient,
		ingestUrl,
		connect.WithHTTPGet(),
		connect.WithInterceptors(NewAuthInterceptor(apiKey)),
	)

	return client
}

func NewAuthInterceptor(token string) connect.UnaryInterceptorFunc {

	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		return connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			if req.Spec().IsClient {
				// Send a token with client requests.
				req.Header().Set("pingora-token", token)
			}

			return next(ctx, req)
		})
	}
	return connect.UnaryInterceptorFunc(interceptor)

}
