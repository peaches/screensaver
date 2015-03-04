#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
$DIR/launcher.sh 1 iceweasel -P screensaver http://localhost:1234 --no-remote
