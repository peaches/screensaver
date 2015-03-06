#!/bin/bash

is_idle=0
screensaver_name=rpi-screensaver
timeout=5*60  # 5 minutes

while [ true ]; do
  time=$(xprintidle)
  let time/=1000
  if (($time > $timeout)); then
    if [ $is_idle == 0 ]; then
      wmctrl -R $screensaver_name
      let is_idle=1
    fi
  else
    wmctrl -r $screensaver_name -t 1
    let is_idle=0
  fi
  sleep 0.4
done
