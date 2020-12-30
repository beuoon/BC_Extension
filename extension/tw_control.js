
let gVideo = null;

function sleep(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

function getVideo() {
    if (gVideo == null)
        gVideo = document.getElementsByTagName('video')[0];
    return gVideo;
}
function getVideoID() {
    let strs = document.URL.split('/')
    if (strs.lenght <= 3)
        return "";
    return strs[3];
}
function checkIsPlaying() {
    return getVideoID() != "";
}

function getVolume() {
    return getVideo().volume;
}
function setVolume(size) {
    if (size < 0) size = 0;
    if (size > 1) size = 1;

    getVideo().volume = size;
}


// 조작
function clickPauseBtn() {
    let pauseBtn = null;

    let btns = document.getElementsByTagName('button');
    for (let i = 0; i < btns.length; i++) {
        let target = btns[i].getAttribute('data-a-target');
        if (target == 'player-play-pause-button') {
            pauseBtn = btns[i];
            break;
        }
    }

    if (pauseBtn != null)
        pauseBtn.click();
}
function upVolume() {
    setVolume(getVolume() + 0.1);
}
function downVolume() {
    setVolume(getVolume() - 0.1);
}

function connect() {
    websocket = new WebSocket("ws://localhost:9002/");

    websocket.onmessage = function (event) {
        let msg = event.data.split(' ');
        switch (msg[0]) {
        case "start":       startVideo(msg[1]);  break;
        case "volume_down": downVolume();        break;
        case "volume_up":   upVolume();          break;
        case "pause": {
                if (checkIsPlaying())
                    clickPauseBtn();
                break;
            }
        }
    };
}

connect();