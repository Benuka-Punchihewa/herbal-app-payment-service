pipeline {
    agent any
    stages{
        stage('Clone App'){
            agent { label 'copper' }
            steps{
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-credentials-copper', url: 'https://github.com/Benuka-Punchihewa/herbal-app-payment-service.git']]])
            }
        }

        stage('Build docker images'){
            agent { label 'copper' }
            steps{
                script{
                    dockerImage = docker.build("benukapunchihewa/payment-service:latest")
                }
            }
        }
        stage('Push image to Hub'){
            agent { label 'copper' }
            steps{
                script{
                   withDockerRegistry([ credentialsId: "dockerHub", url: "" ]) {
                    dockerImage.push()
                    }
                }
            }
        }
        stage('Deploy to k8s') {
            agent { label 'zink' }
            steps {
                script {
                    withKubeConfig([credentialsId: 'google-cloud-service-account', serverUrl: 'https://104.196.35.11']) {
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