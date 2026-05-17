pipeline {
    agent any

    environment {
        IMAGE_NAME = 'sit753-student-platform'
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    stages {
        stage('Unit Tests') {
            steps {
                echo 'Starting Unit Tests...'

                bat '''
                    npm install
                    npx jest tests/services.test.js --runInBand --ci
                '''

                echo 'Unit Tests completed successfully.'
            }
        }

        stage('Integration Tests') {
            steps {
                echo 'Starting Integration Tests...'

                bat '''
                    npx jest tests/health.test.js tests/students.test.js tests/courses.test.js tests/metrics.test.js --runInBand --ci
                '''

                echo 'Integration Tests completed successfully.'
            }
        }
        stage('Code Quality') {
            steps {
                echo 'Starting Code Quality Stage...'

                bat '''
                    echo Running SonarQube/SonarCloud scan...

                    npx sonar-scanner ^
                    -Dsonar.host.url=https://sonarcloud.io ^
                    -Dsonar.token=%SONAR_TOKEN% ^
                    -Dsonar.qualitygate.wait=true
                '''

                echo 'Code Quality Stage completed successfully.'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Starting Code Quality Stage...'

                bat '''
                    echo Generating coverage report...
                    npx jest --coverage --coverageReporters=lcov --runInBand --ci

                    if not exist sonar-scanner (
                        curl -L -o sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-6.2.1.4610-windows-x64.zip
                        powershell -Command "Expand-Archive -Path sonar-scanner.zip -DestinationPath . -Force"
                        ren sonar-scanner-6.2.1.4610-windows-x64 sonar-scanner
                    )

                    sonar-scanner\\bin\\sonar-scanner.bat 
                '''

                echo 'Code Quality Stage completed successfully.'
            }
        }
        stage('Build') {
            steps {
                echo 'Starting Build Stage...'

                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDENTIALS',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_PASS'
                )]) {
                    bat '''
                        @echo off
                        docker --version

                        if not exist artifacts mkdir artifacts

                        echo Logging in to Docker Hub...
                        echo %DOCKERHUB_PASS%| docker login -u %DOCKERHUB_USER% --password-stdin

                        echo Building Docker image...
                        docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .

                        echo Pushing Docker image with build number tag...
                        docker push %IMAGE_NAME%:%BUILD_NUMBER%

                        echo Pushing Docker image with latest tag...
                        docker push %IMAGE_NAME%:latest

                        echo Application: %IMAGE_NAME% > artifacts\\build-info.txt
                        echo Jenkins Build Number: %BUILD_NUMBER% >> artifacts\\build-info.txt
                        echo Docker Image Tag 1: %IMAGE_NAME%:%BUILD_NUMBER% >> artifacts\\build-info.txt
                        echo Docker Image Tag 2: %IMAGE_NAME%:latest >> artifacts\\build-info.txt
                        echo Git Commit: %GIT_COMMIT% >> artifacts\\build-info.txt
                        echo Git Branch: %GIT_BRANCH% >> artifacts\\build-info.txt
                        echo Artifact Storage: Docker image pushed to Docker Hub. >> artifacts\\build-info.txt

                        docker logout
                    '''
                }

                archiveArtifacts artifacts: 'artifacts/**', fingerprint: true

                echo 'Build Stage completed successfully.'
            }
        }
        stage('Security') {
            steps {
                echo 'Starting Security Stage...'

                bat '''
                    if not exist security-reports mkdir security-reports

                    echo Security Scan Summary > security-reports\\security-summary.txt
                    echo This stage checks dependency and Docker image vulnerabilities. >> security-reports\\security-summary.txt
                    echo CRITICAL vulnerabilities will fail the pipeline. >> security-reports\\security-summary.txt
                    echo HIGH vulnerabilities are recorded for review and mitigation. >> security-reports\\security-summary.txt

                    echo Running npm audit for dependency vulnerabilities...
                    npm audit --audit-level=critical --json > security-reports\\npm-audit-report.json

                    if %ERRORLEVEL% NEQ 0 (
                        echo Critical dependency vulnerabilities found.
                        echo Result: FAILED - Critical dependency vulnerability found. >> security-reports\\security-summary.txt
                        echo Mitigation: Update or replace vulnerable npm packages before deployment. >> security-reports\\security-summary.txt
                        exit /b 1
                    )

                    echo npm audit completed successfully. >> security-reports\\security-summary.txt

                    echo Checking Trivy installation...
                    where trivy

                    if %ERRORLEVEL% EQU 0 (
                        echo Running Trivy scan on Docker image...
                        trivy image --severity HIGH,CRITICAL --format table -o security-reports\\trivy-image-report.txt %IMAGE_NAME%:%BUILD_NUMBER%

                        echo Trivy image scan completed. >> security-reports\\security-summary.txt
                        echo Vulnerability categories checked: HIGH and CRITICAL. >> security-reports\\security-summary.txt

                        echo Applying Trivy security gate for CRITICAL vulnerabilities...
                        trivy image --severity CRITICAL --exit-code 1 %IMAGE_NAME%:%BUILD_NUMBER%

                        if %ERRORLEVEL% NEQ 0 (
                            echo Critical container image vulnerabilities found.
                            echo Result: FAILED - Critical Docker image vulnerability found. >> security-reports\\security-summary.txt
                            echo Mitigation: Rebuild the image using a patched base image or updated dependencies. >> security-reports\\security-summary.txt
                            exit /b 1
                        )

                        echo No critical Docker image vulnerabilities found. >> security-reports\\security-summary.txt
                    ) else (
                        echo Trivy is not installed on this Jenkins machine.
                        echo Trivy is not installed. > security-reports\\trivy-image-report.txt
                        echo Container image scan was not completed because Trivy is missing. >> security-reports\\security-summary.txt
                        echo Mitigation: Install Trivy on the Jenkins machine and rerun the pipeline. >> security-reports\\security-summary.txt
                    )

                    echo Security Stage completed successfully.
                    echo Result: PASSED - Security checks completed. >> security-reports\\security-summary.txt
                '''
            }

            post {
                always {
                    archiveArtifacts artifacts: 'security-reports/**', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting Deploy Stage to Staging...'

                bat '''
                    if not exist deployment mkdir deployment

                    if exist deployment\\staging.env (
                        copy /Y deployment\\staging.env deployment\\previous-staging.env
                    )

                    echo IMAGE_NAME=%IMAGE_NAME% > deployment\\staging.env
                    echo STAGING_IMAGE_TAG=%BUILD_NUMBER% >> deployment\\staging.env
                    echo STAGING_API_KEY=staging-api-key >> deployment\\staging.env

                    echo Deploying to staging environment...
                    docker compose --env-file deployment\\staging.env up -d student-platform-staging

                    if errorlevel 1 (
                        echo Docker Compose staging deployment failed.
                        exit /b 1
                    )

                    echo Waiting for staging application to start...
                    powershell -Command "Start-Sleep -Seconds 10"

                    echo Checking staging health...
                    powershell -Command "$r = Invoke-WebRequest -UseBasicParsing http://localhost:8081/health/ready; if ($r.StatusCode -ne 200) { exit 1 }"

                    if errorlevel 1 (
                        echo Staging deployment health check failed.

                        if exist deployment\\previous-staging.env (
                            echo Rolling back to previous staging deployment...
                            docker compose --env-file deployment\\previous-staging.env up -d student-platform-staging
                        )

                        exit /b 1
                    )

                    echo Staging deployment completed successfully.
                '''
            }
        }

        stage('Release') {
            steps {
                echo 'Starting Release Stage to Production...'

                input message: 'Promote this build to production?', ok: 'Release'

                bat '''
                    if not exist release mkdir release

                    echo Creating release Docker image tag...
                    docker tag %IMAGE_NAME%:%BUILD_NUMBER% %IMAGE_NAME%:release-%BUILD_NUMBER%

                    echo Creating production environment config...
                    echo IMAGE_NAME=%IMAGE_NAME% > release\\production.env
                    echo PROD_IMAGE_TAG=release-%BUILD_NUMBER% >> release\\production.env
                    echo PROD_API_KEY=production-api-key >> release\\production.env

                    echo Deploying release image to PRODUCTION environment...
                    docker compose --env-file release\\production.env up -d student-platform-prod

                    if errorlevel 1 (
                        echo Production deployment failed.
                        exit /b 1
                    )

                    echo Waiting for production application to start...
                    powershell -Command "Start-Sleep -Seconds 10"

                    echo Running production health check...
                    powershell -Command "$r = Invoke-WebRequest -UseBasicParsing http://localhost:8082/health/ready; if ($r.StatusCode -ne 200) { exit 1 }"

                    if errorlevel 1 (
                        echo Production health check failed.
                        exit /b 1
                    )

                    echo Creating release metadata...
                    echo Application: %IMAGE_NAME% > release\\release-info.txt
                    echo Release Version: release-%BUILD_NUMBER% >> release\\release-info.txt
                    echo Source Image: %IMAGE_NAME%:%BUILD_NUMBER% >> release\\release-info.txt
                    echo Production Image: %IMAGE_NAME%:release-%BUILD_NUMBER% >> release\\release-info.txt
                    echo Environment: production >> release\\release-info.txt
                    echo Production URL: http://localhost:8082/view >> release\\release-info.txt
                    echo Health Check URL: http://localhost:8082/health/ready >> release\\release-info.txt
                    echo Git Commit: %GIT_COMMIT% >> release\\release-info.txt
                    echo Git Branch: %GIT_BRANCH% >> release\\release-info.txt

                    echo Release Stage completed successfully.
                '''

                archiveArtifacts artifacts: 'release/**', fingerprint: true

                echo 'Release Stage to Production completed successfully.'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Starting Monitoring Stage...'

                bat '''
                    if not exist monitoring-reports mkdir monitoring-reports

                    echo Starting Prometheus monitoring service...
                    docker compose --env-file release\\production.env up -d prometheus

                    echo Waiting for Prometheus to start...
                    powershell -Command "Start-Sleep -Seconds 15"

                    echo Checking Prometheus health...
                    powershell -Command "$r = Invoke-WebRequest -UseBasicParsing http://localhost:9090/-/healthy; if ($r.StatusCode -ne 200) { exit 1 }"

                    echo Checking production metrics endpoint...
                    powershell -Command "$r = Invoke-WebRequest -UseBasicParsing http://localhost:8082/metrics; if ($r.StatusCode -ne 200) { exit 1 }"

                    echo Querying live metrics status from Prometheus...
                    powershell -Command "Invoke-WebRequest -UseBasicParsing 'http://localhost:9090/api/v1/query?query=up' | Select-Object -ExpandProperty Content" > monitoring-reports\\prometheus-up-query.json

                    echo Simulating incident by stopping staging container...
                    docker stop sit753-student-platform-staging

                    echo Waiting for Prometheus to detect the incident...
                    powershell -Command "Start-Sleep -Seconds 20"

                    echo Querying Prometheus alerts after incident simulation...
                    powershell -Command "Invoke-WebRequest -UseBasicParsing 'http://localhost:9090/api/v1/alerts' | Select-Object -ExpandProperty Content" > monitoring-reports\\prometheus-alerts.json

                    echo Restarting staging container after incident simulation...
                    docker compose --env-file deployment\\staging-current.env up -d student-platform-staging

                    echo Monitoring Stage completed successfully.
                '''

                archiveArtifacts artifacts: 'monitoring-reports/**', fingerprint: true

                echo 'Monitoring Stage completed successfully.'
            }
        }
    }
}