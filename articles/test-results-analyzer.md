---
title: Setting Up Jenkins Test Results Analyzer with Playwright
date: "May 28, 2024"
description: The Jenkins Test Results Analyzer is a plugin that provides a detailed view of test execution results across multiple builds.
---

The Jenkins Test Results Analyzer is a plugin that provides a detailed view of test execution results across multiple builds. My motivation for researching a tool to analyze results over several builds was to find and identify flaky tests — those tests that intermittently pass or fail. While there are various reports available, such as Playwright built-in reports, Allure, and Surefire, which offer detailed overviews of test results, they lack a mechanism to quickly identify flaky tests across multiple builds.

The Test Results Analyzer displays results in a tabular format, allowing users to drill down into individual test cases, track trends over time, and identify flaky tests effectively.

### Benefits of Using Test Results Analyzer

- **Historical Trends:** Track test results across multiple builds to identify patterns and trends.
- **Flaky Test Detection:** Easily spot tests that fail intermittently, helping to improve test reliability.
- **Detailed Drill-Down:** Drill down into test results to see individual test case outcomes.
- **Improved Debugging:** Quickly identify and diagnose test failures with enhanced visualization.

### Configuration

Assuming Jenkins is already configured and you have set up a pipeline or freestyle project for execution, configuring the Test Results Analyzer is straightforward. If not, there are numerous articles available that can guide you through the initial setup.

Configuring the Test Results Analyzer involves just two simple steps.

### Generating JUnit Reports with Playwright

Update `playwright.config.ts` to Include Reporter

```shell
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['junit', { outputFile: 'results.xml' }]],
});
```

### Setting Up Jenkins

Installing Test Results Analyzer Plugin and Junit Plugin

Go to Manage Jenkins:
Manage Plugins:
Click on Manage Plugins. → Go to the Available tab. → Search for Test Results Analyzer Plugin and install it.
And we need another plugin JUnit Plugin to publish results.

If you already have a Jenkins pipeline set up, you can easily configure it to run Playwright tests and publish the JUnit report. Here’s how you can do it using a Jenkins pipeline script (Jenkinsfile):

```typescript
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/your-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            junit 'results.xml'
        }
    }
}
```

If you are using a freestyle project, you can add the JUnit report publishing step as a post-build action.

make sure to specify junit xml file from project root.

That’s it! 🎉

Now you can build and see the results. ✅