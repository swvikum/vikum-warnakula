---
title: Hybrid Load Testing Using K6
date: "April 12, 2024"
description: Exploring the limitations of protocol-level and frontend performance testing, and introducing a hybrid approach using K6.
---

### Limitations of Load Testing a Website on the Protocol Level

Protocol-level load testing primarily focuses on network-level interactions, which has several limitations:

- **Inaccurate User Simulation:** It does not accurately simulate real user behavior, interactions, or browser rendering.
- **Lack of Frontend Performance Metrics:** Misses frontend performance aspects such as rendering time, DOM manipulation, and JavaScript execution.
- **Inability to Handle Dynamic Content:** Struggles to execute complex user scenarios involving dynamic content, JavaScript interactions, cookies, sessions, and authentication mechanisms.
- **Incomplete Performance Picture:** Measures server response times and throughput accurately but often fails to capture client-side performance metrics.

### Limitations of Only Doing Frontend Performance Testing

Frontend performance testing focuses on client-side aspects and has its own set of limitations:

- **Overlooks Backend Performance:** Neglects backend performance, network latency, and server response times.
- **No Traffic Condition Testing:** Without load, it does not test under traffic conditions.
- **Resource Intensive:** Browser-level load testing is resource-intensive and costly.
- **Limited Real-World Scenario Reflection:** May not accurately reflect real-world scenarios where backend processing, database queries, and network latency can affect page load times and user interactions.
- **Unable to Identify Backend Bottlenecks:** Cannot identify bottlenecks or issues within backend systems, such as slow database queries, inefficient server-side processing, or network congestion.

### Combining Frontend and Backend Performance Testing

A hybrid approach that combines both frontend and backend performance testing can provide a more comprehensive overview of the system:

- **Run Bulk Load on Protocol-Level:** Execute a large number of virtual users to test backend performance.
- **Spin Up Virtual Users at Browser Level:** Simulate a few real user interactions at the browser level to capture frontend performance metrics.

### What More Can We capture from the Browser Level?

As mentioned in previous sections, k6 captures various important metrics related to performance. To gain a deeper understanding of browser performance, we can utilize the following extended metrics when performing browser-level load testing.

referece: [Built-in metrics](https://k6.io/docs/using-k6/metrics/reference/#browser)

The k6 browser module emits its own metrics based on the Core Web Vitals.

| **CORE WEB VITAL**       | **DESCRIPTION**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| `browser_web_vital_lcp`  | Measures a page's loading performance.                                          |
| `browser_web_vital_fid`  | Measures a page's interactivity. First Input Delay (FID).                       |
| `browser_web_vital_cls`  | Measures a page's visual stability.                                             |
| `browser_web_vital_ttfb` | Measures the time between the browser request and the start of the server response. Time to First Byte (TTFB). |
| `browser_web_vital_fcp`  | Measures the time it takes for the browser to render the first DOM element on the page. First Contentful Paint (FCP). |
| `browser_web_vital_inp`  | An experimental metric that measures a page's responsiveness. Interaction to Next Paint (INP). |

### Example Code: Hybrid Load Testing with K6

Below is an example of how to set up a hybrid load test using K6, combining protocol-level and browser-level testing.

```javascript
import { browser, devices } from 'k6/experimental/browser';

export const options = {
  scenarios: {
    browser: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const iphoneX = devices['iPhone X'];
  const context = browser.newContext(iphoneX);
  const page = context.newPage();

  try {
    await page.goto('https://test.k6.io/');
  } finally {
    page.close();
  }
}