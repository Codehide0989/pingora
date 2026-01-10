package job_test

import (
	"context"
	"testing"

	"github.com/pingorahq/pingora/apps/checker/pkg/job"
	v1 "github.com/pingorahq/pingora/apps/checker/proto/private_location/v1"
)

func TestTCPJob_Success(t *testing.T) {

	monitor := &v1.TCPMonitor{
		Uri:     "pingora.dev:80",
		Timeout: 1,
		Retry:   1,
	}
	data, err := job.NewJobRunner().TCPJob(context.Background(), monitor)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if data.RequestStatus != "active" {
		t.Errorf("expected RequestStatus 'active', got '%s'", data.RequestStatus)
	}
	if data.Error != 0 {
		t.Errorf("expected Error 0, got %d", data.Error)
	}
}

func TestTCPJob_Failure(t *testing.T) {

	monitor := &v1.TCPMonitor{
		Uri:     "localhost:1234",
		Timeout: 1,
		Retry:   1,
	}

	data, err := job.NewJobRunner().TCPJob(context.Background(), monitor)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if data.RequestStatus != "error" {
		t.Errorf("expected RequestStatus 'error', got '%s'", data.RequestStatus)
	}
	if data.Error != 1 {
		t.Errorf("expected Error 1, got %d", data.Error)
	}
}
