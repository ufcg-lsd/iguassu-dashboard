#!/bin/bash

DIRNAME=`dirname $0`
cd $DIRNAME/..

kill -9 $(ps aux | grep -v "grep" | grep grunt | awk '{print $2}')
