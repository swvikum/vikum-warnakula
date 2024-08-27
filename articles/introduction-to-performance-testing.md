---
title: "Kick-start to Performance Testing"
date: "September 12, 2020"
description: "Has your organization experienced a failure that could have been avoided with performance testing? Most organizations have. Stable websites may crash under the peak load of a holiday sale. Transaction processing may fail due to issues in data transfer rates, network bandwidth or throughput. "
---

### Why Companies Concern About Performance Testing?

Has your organization experienced a failure that could have been avoided with performance testing? Most organizations have. Stable websites may crash under the peak load of a holiday sale. Transaction processing may fail due to issues in data transfer rates, network bandwidth, or throughput.

### Examples of Performance Failures

- **October 4th, 2021**: WhatsApp, Instagram, and Facebook all went down in a major outage.
- **July 2016**: People go crazy for Pokemon GO and the app crashes.
- **November 2016**: Canadian Immigration website crashes after US elections.
- **Black Friday 2016**: Macy’s website and mobile app crash under heavy loads.
- **GCE Examination**: Result portal usually unresponsive just after results released due to high traffic.

[Link to GCE Examination Results](https://www.doenets.lk/examresults)

### Performance Testing in Software Testing

Performance testing is critical as it provides valuable information on the scalability, stability, and reliability of your application. Planning an effective performance test strategy is complex because it covers many specialized test types that must be applied in specific ways.

#### Attributes of Performance Testing:

- **Speed**: Determines whether the application responds quickly.
- **Scalability**: Determines the maximum user load the software application can handle.
- **Stability**: Determines if the application is stable under varying loads.

[Types of Software Testing](https://www.testbytes.net/blog/types-of-software-testing/)

#### Types of Performance Testing:

- **Performance Testing**: Determines how fast a system performs under a particular workload. Its purpose is to determine speed, scalability, and stability.
- **Load Testing**: Checks the application’s ability to perform under anticipated user loads.
- **Stress Testing**: Involves testing an application under extreme workloads to see how it handles high traffic or data processing.
- **Endurance Testing**: Ensures the software can handle the expected load over a long period of time.
- **Spike Testing**: Tests the software’s reaction to sudden large spikes in load.
- **Volume Testing**: Populates a large amount of data in a database and monitors the overall software system’s behavior.
- **Scalability Testing**: Determines the software application’s effectiveness in scaling up to support an increase in user load.

### Performance Testing vs Performance Engineering

- **Performance Testing**: Concerned with testing and reporting the current performance of a software application under various parameters.
- **Performance Engineering**: The process by which software is tested and tuned to realize the required performance, optimizing user experience.

### Performance Testing Activities

- **Server resource usage**: CPU, memory, disk resources used by a system.
- **Bandwidth**: Shows the bits per second used by a network interface.
- **Throughput**: Rate at which a computer or network receives requests per second.
- **Thread counts**: Measures the number of threads that are running and active.
- **Garbage collection**: Monitors the efficiency of returning unused memory back to the system.
- **Response time**: Time from when a user enters a request until the first character of the response is received.
- **Latency**: A measure of responsiveness representing the time it takes to complete a request.
- **Think Time**: Time between the completion of one request and the start of the next request.
- **Percentiles**: A performance testing metric that gives a measure under which a percentage of the sample is found.
- **Average**: Adds up all values of the samples and then divides that number by the number of samples.
- **Medians**: Arranges members from minimum to maximum and identifies the middle member.
- **Concurrent Users**: The number of users accessing a system simultaneously.
- **Transactions per second**: The number of transactions completed by a system per second.
- **Error rate**: The percentage of requests that result in errors.

### Bottlenecks in Performance Testing

- **Bottleneck**: Refers to a phenomenon where the performance or capacity of an entire system is limited by a single or small number of components or resources.

Performance testing helps identify bottlenecks in a system, establish a baseline for future testing, support a performance tuning effort, and determine compliance with performance goals and requirements. Including performance testing very early in your development life cycle tends to add significant value to the project.

---

### Application Server Performance Bottlenecks

- Memory leaks
- Useless/inefficient garbage collection
- DB connections poor configuration
- Useless/inefficient code transactions
- Sub-optimal session model
- Application server poor configuration
- Useless/inefficient hardware resources
- Useless/inefficient object access model
- Useless/inefficient security model
- Less utilization of OS resources

### DB Server Performance Bottlenecks

- Inefficient/ineffective SQL statement
- Small/insufficient query plan cache
- Inefficient/ineffective SQA query model
- Inefficient/ineffective DB configurations
- Small/insufficient data cache
- Excess DB connections
- Excess rows at a time processing
- Missing/ineffective indexing
- Inefficient/ineffective concurrency model
- Outdated statistics
- Deadlocks

### Web Application Performance Bottlenecks

- Slow CSS Selectors on Internet Explorer
- Slow executing external services
- Multiple CSS Lookups for the same object
- Extensive XHR Calls
- Large DOM
- Expensive DOM Manipulations
- Extensive Visual Effects
- Extensive JavaScript files
- Extensive Event Handler Bindings
- Too fine granular logging and monitoring