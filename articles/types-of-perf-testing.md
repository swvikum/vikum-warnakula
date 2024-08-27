---
title: "Conducting Different Types of Performance Tests with k6"
date: "August 10, 2024"
description: "A quick examples on performing load, stress, spike, and endurance testing using k6."
---

Performance testing is a critical aspect of ensuring the reliability, scalability, and responsiveness of web applications under various conditions. k6, an open-source load testing tool, provides developers with a flexible and powerful platform for conducting performance tests. In this quick guide, we’ll explore how to conduct different types of performance tests using k6.

### Types of Performance Tests with k6

k6 supports various types of performance tests, which can be configured using k6 options. By adjusting the options in k6, you can perform different types of tests. Let’s explore each type:

#### Load Testing
Load testing evaluates the system’s performance under expected usage conditions by subjecting it to typical and peak loads. The goal is to ensure that the system can handle the anticipated volume of users and transactions without significant degradation in performance.

```javascript
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '5m', target: 50 }, // Ramp-up traffic from 1 to 50 users over 5 minutes.
    { duration: '10m', target: 50 }, // Maintain 50 users for 10 minutes.
    { duration: '5m', target: 0 }, // Ramp-down to 0 users.
  ],
};

export default function () {
  let response = http.get('https://example.com');
}
```

#### Stress Testing
Stress testing assesses the system’s resilience by subjecting it to extreme conditions beyond its normal operational capacity. This test helps identify performance bottlenecks and potential failure points.

```javascript
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '2m', target: 200 },
    { duration: '3m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '3m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '3m', target: 400 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let response = http.get('https://example.com');
}
```

#### Endurance (Soak) Testing
Endurance testing involves subjecting the system to a sustained load over an extended period to evaluate its stability and performance under continuous usage.

```javascript
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30m', target: 100 }, // Ramp-up to 100 users over 30 minutes.
    { duration: '4h', target: 100 }, // Maintain 100 users for 4 hours.
    { duration: '30m', target: 0 }, // Ramp-down to 0 users.
  ],
};

export default function () {
  let response = http.get('https://example.com');
}
```

#### Spike Testing
Spike testing evaluates how the system responds to sudden spikes or surges in user traffic, simulating real-world scenarios like flash sales or marketing campaigns.

```javascript
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '5m', target: 10 }, // Ramp-up to 10 users over 5 minutes.
    { duration: '30s', target: 500 }, // Spike to 500 users over 30 seconds.
    { duration: '5m', target: 10 }, // Return to 10 users over 5 minutes.
    { duration: '10s', target: 0 }, // Ramp-down to 0 users.
  ],
};

export default function () {
  let response = http.get('https://example.com');
}
```

