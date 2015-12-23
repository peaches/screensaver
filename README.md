Build
=====

This does a build and generates the `dist` folder, which is what the app needs
to run properly.

```
gulp
```

Run
===

You have to generate a config.json file and then encrypt it. The config.json
file takes the following format:

```
{
  "imageDir": "/media/screensaver",
  "imap": {
    "email": "someemail@gmail.com",
    "password": "password",
    "host": "imap.gmail.com",
    "secure": true
  },
  "glympse": {
    "url": "some url",
    "token": "some token"
  }
}
```

Now you can encrypt and decrypt with the command:

```
SCREENSAVER_ENCRYPTION_KEY=somepassword npm encrypt
```

This will generate a config.json.secure file that is used by the app. You
can view the content of the file by decrypting it:

```
SCREENSAVER_ENCRYPTION_KEY=somepassword npm decrypt
```

This will overwrite the current `config.json` file.  To run you'll also
have to specify the password

```
SCREENSAVER_ENCRYPTION_KEY=somepassword npm start
```
