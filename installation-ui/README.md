### Installation UI

### Pre-requisite
* User should have basic knowledge of git and docker

### Steps to build and run installation ui module on local environment
* Before build change the environment variables

```
JENKINS_USERNAME=
JENKINS_TOKEN=
JENKINS_URL=
JENKINS_PORT=
PROMETHEUS_RELOAD_URL=http://prometheus-url-if-required
PROMETHEUS_INTEGRATION_REQUIRED=false
```

* Lets run and build the codebase
```
docker-compose up -d --build
```
