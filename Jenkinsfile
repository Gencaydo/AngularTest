pipeline {
    agent any

    environment {
        IMAGE_NAME    = 'angulartest'
        IMAGE_TAG     = "${env.BUILD_NUMBER}"
        REGISTRY      = '' // e.g. 'myregistry.azurecr.io' or 'docker.io/myusername' — leave blank for local only
        FULL_IMAGE    = "${REGISTRY ? "${REGISTRY}/${IMAGE_NAME}" : IMAGE_NAME}"
        CONTAINER_PORT = '4200'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        stage('Checkout') {
            steps {
                // credentialsId is optional for public repos; add 'github-credentials' in Manage Jenkins > Credentials if needed
                git url: 'https://github.com/Gencaydo/AngularTest.git', branch: 'master'
                echo "Checked out branch: master | Build: #${env.BUILD_NUMBER} | Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Lint & Validate') {
            steps {
                sh 'docker info'
                sh 'docker --version'
                // Validate the Dockerfile with hadolint if available; skip gracefully if not
                sh 'hadolint Dockerfile || echo "hadolint not installed, skipping lint"'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building image: ${FULL_IMAGE}:${IMAGE_TAG}"
                    sh """
                        docker build \
                            --tag ${FULL_IMAGE}:${IMAGE_TAG} \
                            --tag ${FULL_IMAGE}:latest \
                            --label "build.number=${env.BUILD_NUMBER}" \
                            --label "build.url=${env.BUILD_URL}" \
                            --label "git.commit=${env.GIT_COMMIT ?: 'unknown'}" \
                            .
                    """
                }
            }
        }

        stage('Push to Registry') {
            when {
                allOf {
                    expression { return env.REGISTRY?.trim() }
                    anyOf {
                        branch 'main'
                        branch 'master'
                        branch 'develop'
                    }
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-registry-credentials',
                    usernameVariable: 'REGISTRY_USER',
                    passwordVariable: 'REGISTRY_PASS'
                )]) {
                    sh "echo ${REGISTRY_PASS} | docker login ${REGISTRY} -u ${REGISTRY_USER} --password-stdin"
                    sh "docker push ${FULL_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${FULL_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def latestTag = sh(
                        script: "docker images ${FULL_IMAGE} --format '{{.Tag}}' | grep -v latest | sort -rn | head -1",
                        returnStdout: true
                    ).trim()
                    echo "Latest image tag found: ${latestTag}"
                    echo "Deploying ${FULL_IMAGE}:${latestTag}"
                    sh """
                        # Stop and remove the named container if it exists
                        docker stop angulartest || true
                        docker rm angulartest || true

                        # Kill any other container still holding port 4200
                        EXISTING=\$(docker ps -q --filter "publish=${CONTAINER_PORT}")
                        if [ -n "\$EXISTING" ]; then
                            echo "Stopping container holding port ${CONTAINER_PORT}: \$EXISTING"
                            docker stop \$EXISTING || true
                            docker rm \$EXISTING || true
                        fi

                        docker run -d \
                            --name angulartest \
                            --restart unless-stopped \
                            -p ${CONTAINER_PORT}:${CONTAINER_PORT} \
                            ${FULL_IMAGE}:${latestTag}
                    """
                    echo "Container started successfully with image ${FULL_IMAGE}:${latestTag}"
                }
            }
        }

    }

    post {
        always {
            // Remove dangling/untagged images to free up disk space
            sh 'docker image prune -f || true'
        }
        success {
            echo "Build #${env.BUILD_NUMBER} succeeded. Image: ${FULL_IMAGE}:${IMAGE_TAG}"
        }
        failure {
            echo "Build #${env.BUILD_NUMBER} failed. Check the logs above."
        }
        cleanup {
            cleanWs()
        }
    }
}
