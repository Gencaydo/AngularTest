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

        stage('Test Image') {
            steps {
                script {
                    def containerId = sh(
                        script: "docker run -d -p ${CONTAINER_PORT}:${CONTAINER_PORT} ${FULL_IMAGE}:${IMAGE_TAG}",
                        returnStdout: true
                    ).trim()

                    try {
                        sh """
                            CONTAINER_IP=\$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${containerId})
                            echo "Container IP: \$CONTAINER_IP"
                            echo "Waiting for Nginx to be ready on \$CONTAINER_IP:${CONTAINER_PORT}..."
                            for i in \$(seq 1 15); do
                                if wget -qO- http://\$CONTAINER_IP:${CONTAINER_PORT} 2>/dev/null | grep -q 'app-root'; then
                                    echo "Health check passed on attempt \$i"
                                    exit 0
                                fi
                                echo "Attempt \$i/15 - not ready yet, retrying in 3s..."
                                sleep 3
                            done
                            echo "=== Container logs ==="
                            docker logs ${containerId}
                            echo "Health check failed after 15 attempts"
                            exit 1
                        """
                    } finally {
                        sh "docker stop ${containerId} && docker rm ${containerId}"
                    }
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
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "Deploying ${FULL_IMAGE}:${IMAGE_TAG}"
                    sh """
                        docker-compose down --remove-orphans || true
                        IMAGE_TAG=${IMAGE_TAG} docker-compose up -d --force-recreate
                    """
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
