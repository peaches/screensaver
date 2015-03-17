import os
import time
import subprocess
import RPi.GPIO as io

DIR = os.path.dirname(os.path.realpath(__file__))
PIR = 24
SCREEN_TIMEOUT = 20    #30 minutes
IDLE_TIMEOUT = 10
SCREENSAVER_NAME = 'rpi-screensaver'

io.setmode(io.BCM)
io.setup(PIR, io.IN)
 
last_activity = time.time()
is_idle = False
is_motion_activated = False
last_idle_time = 0

def screen_is_off():
    screen_status = subprocess.check_output(['tvservice', '-s'])
    return '0x120002' in screen_status

def idle_time():
    return int(subprocess.check_output(['xprintidle'])) / 1000
 
while True:
    if idle_time() > IDLE_TIMEOUT:
        if not is_idle:
            subprocess.call(['wmctrl', '-R', SCREENSAVER_NAME])
            is_idle = True
    elif not is_motion_activated or (last_idle_time > idle_time()):
        subprocess.call(['wmctrl', '-r', SCREENSAVER_NAME, '-t', '1'])

        # once we've detected that t
        is_motion_activated = False
        is_idle = False

    # As long as it is motion activated, we keep track of the latest idle_time.
    # This way, we can detect if the last idle time gets reset, since it means
    # that the current idle time is less than last idle time.
    if is_motion_activated:
        last_idle_time = idle_time()

    if io.input(PIR):
        last_activity = time.time()
        if screen_is_off():
            # turn it back on
            subprocess.call([os.path.join(DIR, 'screen.sh'), 'on'])

            # We should also turn on the screensaver, since tvservice itself
            # resets xprintidle :(
            subprocess.call(['wmctrl', '-R', SCREENSAVER_NAME])

            is_motion_activated = True
            last_idle_time = idle_time()

    if is_idle and (time.time() - last_activity) > SCREEN_TIMEOUT:
        if not screen_is_off():
            subprocess.call([os.path.join(DIR, 'screen.sh'), 'off'])

    time.sleep(0.5)
