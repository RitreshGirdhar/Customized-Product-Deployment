# Customized-Product-Deployment
Nodejs based application will provide UI to Customer where customer will enter Server IP and Username/Password of his/her server. Node Application will invoke Jenkins API internally and start the product docker based installation via ansible.

### Installation UI - is a node based application where end user will provide server detail and in background it will invoke jenkins api and deploy the application on provided server.

#### Pre-requisite
* User should have basic knowledge of git and docker
* Basic knowledge of Prometheus and Grafana

#### Steps to build and run installation ui module on local environment
* Before build change the environment variables
```
JENKINS_USERNAME=
JENKINS_TOKEN=
JENKINS_URL=
JENKINS_PORT=
```

* Lets run and build the codebase
```
docker-compose up -d --build
```


