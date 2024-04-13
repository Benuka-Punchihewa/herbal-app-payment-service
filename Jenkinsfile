pipeline {
    agent any
    stages{
        stage('Clone App'){
            steps{
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-credentials', url: 'git@github.com:Benuka-Punchihewa/herbal-app-payment-service.git']]])
            }
        }

        stage('Build docker images'){
            steps{
                script{
                    dockerImage = docker.build("benukapunchihewa/payment-service:latest")
                }
            }
        }
        stage('Push image to Hub'){
            steps{
                script{
                   withDockerRegistry([ credentialsId: "dockerHub", url: "" ]) {
                    dockerImage.push()
                    }
                }
            }
        }
        stage('Deploy to k8s') {
            steps {
                script {
                    withKubeConfig([credentialsId: '68fa5218-2e07-4c4b-8cc6-2d2024ce171a', serverUrl: 'https://192.168.49.2:8443']) {
                        dir('kubernetes_config') {
                            sh 'kubectl apply -f payment-config.yaml'
                            sh 'kubectl apply -f payment.yaml'
                        }
                    }
                }
            }
        }
    }
}