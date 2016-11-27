nrf [![Build Status](https://travis-ci.org/progre/nrf.svg?branch=master)](https://travis-ci.org/progre/nrf)
====

A frontend for [nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module) and FFmpeg.
This will help in these things;
- Easily switch the delivery service. for example, [Twitch](http://www.twitch.tv/), [Livecoding.tv](http://www.livecoding.tv/), [niconico](http://live.nicovideo.jp/), and [PeerCastStation](http://www.pecastation.org/).
- It will be delivered to **multiple services**.

Usage
----

You need to install two applications;

- nginx that nginx-rtmp-module is plugged in.
- FFmpeg

### nginx with nginx-rtmp-module

If your platform is **Windows**, You can download binary from **[here](http://nginx-win.ecsds.eu/download/)**.<br>
(It is recommended that you download the **nginx&#160;1.7.12.1&#160;Lizard.zip**. The reason is that the 1.9.x will not work probably.)

If your platform is **OSX**, You can install the nginx-full (not nginx) with brew.
see also: [Homebrew/homebrew-nginx](https://github.com/Homebrew/homebrew-nginx)
```
$ brew tap homebrew/nginx
$ brew install nginx-full --with-rtmp-module
```

### FFmpeg

If your platform is **Windows**, You can download binary from **[here](https://ffmpeg.zeranoe.com/builds/)**.<br>

If your platform is **OSX**, You can install the ffmpeg with brew.
```
$ brew install ffmpeg
```

----

After that, execute `nrf.exe` or `nrf`.

First time, you need configuration. 

### [Download it here!](https://github.com/progre/nrf/releases)
