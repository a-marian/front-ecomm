/* Requires the Docker Pipeline plugin */
pipeline {
    agent any
    environment {
      VERSION = '1.0'

    }
    tools{
      nodejs "NodeJS",
      docker "docker"
    }

    stages {

      stage('build') {
        steps {
          git url: 'https://github.com/a-marian/front-ecomm.git', branch: 'master', credentialsId: 'be9b4cef-9d18-4126-ac78-2cd6e73cb208'
          sh 'npm install'
        }
      }
      stage('build image') {
        steps {
          sh 'docker build -t a-marian/front-ecomm-jenkins:${VERSION}.${BUILD_NUMBER} .'
        }
      }
      stage('push image to hub') {
        steps {
          withDockerRegistry([credentialsId: "dockerhub", url: ""]) {
            sh 'docker push luidasa/angular-app-jenkins:${VERSION}.${BUILD_NUMBER}'
          }
        }
      }
    }
}
