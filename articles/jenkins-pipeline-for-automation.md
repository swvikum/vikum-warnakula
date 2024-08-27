---
title: How to Create Jenkins Pipeline to Execute Automation Tests
date: "June 9, 2024"
description: Guide on integrating Jenkins Pipeline with K6. 
---

Integrating Jenkins with automation testing tools allows you to streamline test execution, capture results, and maintain continuous integration. 

### Step-by-Step Guide

- **Install Jenkins**: Download and install Jenkins from the [official website](https://www.jenkins.io/download/). Ensure Jenkins is properly set up and running on your server.
- **Configure Jenkins Pipeline**: Open Jenkins and navigate to your project, Create a new pipeline job or configure an existing one.(attached photos in sample repo)
- **Create a Jenkinsfile**:  Jenkinsfile defines the pipeline and contains the stages, steps, and environment configurations. Below is a generic Jenkinsfile example for running automation tests for k6. Similar approach can be used for other frameworks. 



```shell
pipeline {
    agent any
    options {
        skipDefaultCheckout true
    }
    parameters {
        string(name: 'DURATION', defaultValue: '30s,50s,60s,20s', description: 'Duration of each test stage')
        string(name: 'TARGET', defaultValue: '5,10,15,0', description: 'Target load for each test stage')
        string(name: 'TEST_SCRIPT', defaultValue: 'tests/loadTest.js', description: 'Path to test script')
        string(name: 'BRANCH', defaultValue: 'main', description: 'Branch to checkout')
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    currentBuild.description = "Executing tests for branch: ${params.BRANCH}"
                    echo 'Checking out source code...'
                }
                checkout scm: [$class: 'GitSCM', branches: [[name: "${params.BRANCH}"]],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/YourRepo/your-project.git']]]
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies...'
                }
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    echo 'Running tests...'
                }
                sh '''
                DURATION=${DURATION} TARGET=${TARGET} TEST_SCRIPT=${TEST_SCRIPT} \
                node ${TEST_SCRIPT}
                '''
            }
        }
    }
    post {
        success {
            script {
                echo 'Pipeline succeeded'
            }
            archiveArtifacts artifacts: 'reports/*', allowEmptyArchive: true
            publishHTML(target: [
                reportDir: 'reports',
                reportFiles: 'html-report.html',
                reportName: 'Test Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: false
            ])
        }
        failure {
            script {
                echo 'Pipeline failed'
            }
        }
        always {
            script {
                echo 'Cleaning workspace...'
            }
            cleanWs()
        }
    }
}

  ```


### Explanation of Jenkinsfile

- **Agent**: Defines the agent where the pipeline runs. `any` allows the pipeline to run on any available agent.
  
- **Parameters**: Parameters like `DURATION`, `TARGET`, `TEST_SCRIPT`, and `BRANCH` are used to customize the test run.

- **Stages**:
  - **Checkout**: Checks out the code from the specified branch.
  - **Install Dependencies**: Installs necessary dependencies, e.g., via `npm install`.
  - **Run Tests**: Executes the test script with specified parameters.

- **Post**:
  - **Success**: Archives artifacts and publishes the HTML report.
  - **Failure**: Executes steps on failure.
  - **Always**: Always runs steps like cleaning the workspace.

I have created a sample project to illustrate project structure and files [here](https://github.com/swvikum/k6-load-testing). 