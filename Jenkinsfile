pipeline {
    agent any
    stages {
        stage ('Build') {
            when {
                expression {
                    return env.BRANCH_NAME != 'develop' && env.BRANCH_NAME != 'master';
                }
             }
             steps {
                sh 'yarn'
                sh 'yarn build'
             }
       }
        stage ('Docker build & Push -dev') {
            when {
                branch 'develop' 
            }
             steps {
                 sh 'yarn'
                 sh 'yarn build'
                 sh 'docker build -t go-cms -f Dockerfile .'
                 sh 'docker tag go-cms saliuk/go-cms:latest'
                 sh 'docker push saliuk/go-cms:latest'
                 sh 'ssh root@ec2-13-48-104-249.eu-north-1.compute.amazonaws.com ./go-cms'
             }
        }
        stage ('Docker build & Push -prod') {
            when {
                branch 'master' 
            }
             steps {
                 sh 'yarn'
                 sh 'yarn build:production'
                 sh 'docker build -t go-cms -f Dockerfile .'
                 sh 'docker tag go-cms saliuk/go-cms:latest'
                 sh 'docker push saliuk/go-cms:latest'
                 sh 'ssh root@ec2-13-49-112-255.eu-north-1.compute.amazonaws.com ./go-cms'
             }
        }
        stage ('Recycle') {
             steps {
                 sh 'rm -rf node_modules/ build/'
             }     
        }

    }
}
