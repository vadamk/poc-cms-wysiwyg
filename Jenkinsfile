pipeline {
    agent any
    stages {
//        stage ('Build') {
//            steps {
//                sh 'yarn'
//                sh 'yarn build'
//             }
//       }
//       stage ('Recycle') {
//             steps {
//                 sh 'rm -rf node_modules/'
//             }     
//        }
        stage ('Docker build & Push -dev') {
            when {
                expression {
                    return env.BRANCH_NAME == 'master'
                }
            }
             steps {
                 sh 'docker build -t go-cms -f Dockerfile .'
                 sh 'docker tag go-cms saliuk/go-cms:latest'
                 sh 'docker push saliuk/go-cms:latest'
                 sh 'ssh root@ec2-13-48-104-249.eu-north-1.compute.amazonaws.com ./go-cms'
             }
        }

    }
}
