FROM node:11

ARG DASHBOARD_BRANCH

RUN \
    apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y curl git lsof vim

RUN \
    apt-get install -y ruby-full && \
    npm install -g grunt-cli bower yo generator-karma generator-angular

RUN \
    apt-get install -y ruby-compass && \
    gem install compass

#Set environment variables
ENV HOME /root

#Define working directory
WORKDIR /root

RUN \
    git clone -b $DASHBOARD_BRANCH https://github.com/fogbow/iguassu-dashboard.git --single-branch && \
    (cd iguassu-dashboard && npm install && bower install --allow-root)
