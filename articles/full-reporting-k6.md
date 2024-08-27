---
title: Full Reporting Mechanism in K6
date: "May 20, 2024"
description: Integrating real-time metrics and end-of-test reports using K6 with Datadog, including Docker setup for custom K6 binaries.
---

K6 allows us to emit real-time metrics and generate various end-of-test reports like JSON, CSS, or HTML. In this article, I will explain how to integrate these features using a custom K6 binary and how to create a complete Docker image that includes the K6 custom binary and Datadog to run K6 tests in a Docker container.

### Real-Time Metrics

Real-time metrics are crucial for monitoring performance as tests are running. They offer several benefits:

1. **Streams Performance Metrics:** Provides real-time performance metrics as the test is executing.
2. **Granular Metric Details:** Offers detailed metrics with timestamps for in-depth analysis.
3. **Performance Trend Monitoring:** Allows for visualization of performance trends and anomalies during test execution.
4. **Proactive Issue Identification:** Facilitates real-time adjustments and proactive identification of performance issues.

### K6 Integration with Datadog

To integrate K6 with Datadog, follow these main steps:

1. **Run the Datadog Agent.**
2. **Run the K6 Test.**
3. **Create a Datadog Dashboard and Visualize Metrics in Datadog.**

### K6 Setup for Datadog

K6 uses the StatsD output option, and you need to build a K6 binary using the xk6-output-statsd extension.

[StatsD Extension GitHub Repository](https://github.com/LeonAdato/xk6-output-statsd)

### End-of-Test Summary Report

The end-of-test summary report provides a top-level overview of test results after test execution completes. It includes:

- **Key Metrics Summary:** Response times, throughput, error rates, etc.
- **Performance Snapshot:** Overview of performance metrics at the end of the test run.
- **Immediate Issue Identification:** Helps in quickly assessing overall test performance and identifying any immediate issues.

To create an end-of-test HTML report, use K6 web dashboards and the HTML report generator.

[HTML Report Creation](https://qualitywithmillan.github.io/post/2024/01/k6-with-real-time-performance-monitoring-with-web-dashboards.html)

[GitHub Repository for xk6-dashboard](https://github.com/grafana/xk6-dashboard)

To implement both reporting mechanisms, you need to build K6 custom binaries using xk6-dashboard and xk6-output-statsd.

### Building K6 Custom Binary

Use the following command to build the K6 custom binary with the required extensions:

```bash
xk6 build v0.51.0 --with github.com/grafana/xk6-dashboard --with github.com/LeonAdato/xk6-output-statsd
```

### Docker Setup for K6 and Datadog

Below is how you can set up Docker Compose and Dockerfiles to build images that include both the K6 custom binary and the Datadog agent.

docker-compose.yml

```shell
version: '3'
services:
  k6:
    build: ./
    volumes:
      - ./k6.js:/scripts/script.js:ro
    environment:
      - K6_DATADOG_ADDR=datadog-agent:8125
      - K6_STATSD_ADDR=datadog-agent:8125
      - K6_STATSD_ENABLE_TAGS=true
      - AUTH_TOKEN=${AUTH_TOKEN}
      - BASE_URL=${BASE_URL}
    networks:
      - mynetwork

  datadog-agent:
    image: datadog/agent:latest
    environment:
      - DD_SITE=datadoghq.com
      - DD_API_KEY=${DD_API_KEY}
      - DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
    networks:
      - mynetwork
    ports:
      - "8125:8125/udp"

networks:
  mynetwork:
    driver: bridge

  ```

Dockerfile for K6

  ```shell
  # Use an official Go image as the base image
FROM golang:latest AS builder

# Set the working directory
WORKDIR /app

# Install xk6
RUN go install go.k6.io/xk6/cmd/xk6@latest

# Build the k6 script with the xk6-output-statsd and xk6-dashboard extensions
RUN xk6 build --with github.com/LeonAdato/xk6-output-statsd --with github.com/grafana/xk6-dashboard

# Set environment variables required by the k6 script
ENV K6_STATSD_ENABLE_TAGS=true
ENV STATSD_ADDR=127.0.0.1:8125

# Expose the port used by the Datadog agent
# This allows the k6 container to communicate with the Datadog agent
EXPOSE 8125/udp

# Define the command to run the k6 script
CMD ["K6_WEB_DASHBOARD=true", "K6_WEB_DASHBOARD_EXPORT=reports/html-report.html", "K6_STATSD_ENABLE_TAGS=true", "k6", "run", "--out", "statsd", "/scripts/script.js"]

```

### Conclusion

By using a hybrid reporting mechanism in K6, you can monitor real-time metrics and generate comprehensive end-of-test reports. 

---