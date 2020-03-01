"use strict";
require('custom-env').env();
const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const https = require("https");
const http = require("http");
const fs = require("fs");
const request = require('request');

const jenkinsapi = require("jenkins-api");
const jenkinsUrl = `http://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_TOKEN}@${process.env.JENKINS_URL}:${process.env.JENKINS_PORT}`;
console.log(jenkinsUrl);
const jenkins = jenkinsapi.init(jenkinsUrl);
const exp_session = require("express-session");

const CrowdClient = require("atlassian-crowd-client");
const User = require("atlassian-crowd-client/lib/models/user");

const app = express();
app.use("/public", express.static("public"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

app.get("/", function (req, res) {
  res.render('index.html', { error: null });
});


app.post("/install-linux", urlencodedParser, function (req, res) {
  let params = {
    CHOOSE_DEFAULT_REGISTRY: true,
    API_DEPLOYMENT: true,
    CHECKOUT: true,
    // BUILD: true,
    DEPLOY: true,
    SERVER_IP: req.body.SERVER_IP,
    SERVER_USER: req.body.SERVER_USER,
    SERVER_PASSWORD: req.body.SERVER_PASSWORD
  };

  res.contentType("json");
  jenkins.build_with_params("auto-product-deployment-build", params, function (err, data) {
    if (err) {
      console.log("Error: " + err);
      res.send({ error: err });
    } else {
      sendDataCall(data.location, req.body.SERVER_IP, res);
    }
  });
});

function sendDataCall(location, target_ip, res) {
  console.log("Sending data call");
  var loc = location;
  var response = res;
  var targetIp = target_ip;

  http
    .get(location + "api/json?pretty=true", resp => {
      let data = "";

      resp.on("data", chunk => {
        data += chunk;
      });

      resp.on("end", () => {
        if (!JSON.parse(data).executable) {
          setTimeout(function () {
            sendDataCall(loc, targetIp, response);
          }, 2000);
        } else {
          var finalUrl = `${jenkinsUrl}/blue/organizations/jenkins/${
            JSON.parse(data).task.name
            }/detail/${JSON.parse(data).task.name}/${
            JSON.parse(data).executable.number
            }/pipeline`;
          response.send({
            finalUrl: finalUrl,
            buildNo: JSON.parse(data).executable.number,
            targetIp: targetIp
          });
        }
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
      response.send({ error: err.message });
    });
}

app.get("/getBuildStatus", function (req, res) {
  let result;
  try {
    console.log(req.query.buildNo);
    console.log(req.query.targetIp);
    build_Status(req.query.buildNo, req.query.targetIp, res);
  } catch (err) {
    result = { error: err };
    res.send(result);
  }
});

function build_Status(buildNo, targetIp, resp) {
  var response = resp;
  console.log("Sending build status call" ,targetIp);

  jenkins.build_info("invoke_via_api", buildNo, function (err, data) {
    if (err) {
      return console.log("BUILD INFO ERROR", err);
    } else if (data.result) {
      if (data.result === "FAILURE") {
        console.log(data);
        response.send({ error: data.result });
      } else if (data.result === "ABORTED") {
        console.log(data.result);
        response.send({ success: data.result });
      } else if (data.result === "SUCCESS") {
        console.log(data.result);
        response.send({ success: data.result });
      }
    } else {
      setTimeout(function () {
        build_Status(buildNo, targetIp, response);
      }, 5000);
    }
  });
}

app.listen(3333);


