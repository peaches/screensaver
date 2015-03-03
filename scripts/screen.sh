#!/bin/bash
# Turns off and on hdmi port
# Usage:
#
#   ./screen.sh on
#   ./screen.sh off
#

if [ "$1" == 'on' ]; then
  tvservice -p;
  fbset -depth 8;
  fbset -depth 32;
  sudo chvt 6;
  sudo chvt 7;
  echo 'Switched Screen ON!'
fi

if [ "$1" == 'off' ]; then
  tvservice -o
  echo 'Switched Screen OFF!'
fi
