#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
$DIR/launcher.sh 2 iceweasel -P calendar http://calendar.google.com --no-remote
