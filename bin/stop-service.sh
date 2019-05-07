#!/bin/bash

DIRNAME=`dirname $0`
cd $DIRNAME/..

readonly DASHBOARD_PORT=9000

kill -9 $(lsof -ti tcp:$DASHBOARD_PORT)