function getVideo() {
    return document.getElementsByClassName("webplayer-internal-video")[0]
}
function checkIsPlaying() {
    let livePlayer = document.getElementById('live_player_layout')
    let player = document.getElementById('player_layout')
    
    return (livePlayer !== undefined && livePlayer !== null) ||
        (player !== undefined && player !== null)
}
function getVolume() {
    return getVideo().volume;
}
function setVolume(size) {
    getVideo().muted = false

    if (size < 0) size = 0;
    if (size > 1) size = 1;

    getVideo().volume = size;
}
function getSpeed() {
    return getVideo().playbackRate;
}
function setSpeed(size) {
    if (size < 0.25) size = 0.25;
    if (size > 2) size = 2;

    getVideo().playbackRate = size;
}

// 조작
function playFollowChannel(index) {
    let moreButton = $("button[class^='navigator_button_more']")[0]
    if (moreButton !== undefined && moreButton !== null && moreButton.textContent == '더보기') {
        moreButton.click()
    }
    
    let channel = $("[class^='navigator_list']")[0].children[index - 1]
    if (channel != null)
        channel.click();
}
function clickPauseBtn() {
    let pauseBtn = document.getElementsByClassName('pzp-pc-playback-switch')[0];

    if (pauseBtn != null)
        pauseBtn.click();
}
function upVolume() {
    setVolume(getVolume() + 0.1);
}
function downVolume() {
    setVolume(getVolume() - 0.1);
}
function upSpeed() {
    setSpeed(getSpeed() + 0.25);
}
function downSpeed() {
    setSpeed(getSpeed() - 0.25);
}
function clickTheatreMode() {
    document.getElementsByClassName('pzp-pc-viewmode-button')[0].click()
}
function extendChatting() {
    let extendButton = $("button[class^='live_information_player_folded_button']")[0]
    let foldButton = $("button[class^='live_chatting_header_button'][aria-label='채팅 접기']")[0]

    
    let vodExtendButton = $("button[class^='vod_player_header_folded_button']")[0]
    let vodFoldButton = $("button[class^='vod_chatting_close_button']")[0]

    if (extendButton !== undefined && extendButton !== null)
        extendButton.click()
    else if (foldButton !== undefined && foldButton !== null)
        foldButton.click()
    else if (vodExtendButton !== undefined && vodExtendButton !== null)
        vodExtendButton.click()
    else if (vodFoldButton !== undefined && vodFoldButton !== null)
        vodFoldButton.click()
}
function backward() {
    let video = getVideo();

    if (video.currentTime - 5 < 0)
        video.currentTime = 1;
    else
        video.currentTime -= 5;
}
function forward() {
    let video = getVideo();

    if (video.currentTime != -1)
        video.currentTime += 5;
    
    if (video.buffered.length > 0) {
        let lastTime = video.buffered.end(video.buffered.length-1);
        if (video.currentTime > lastTime)
            video.currentTime = -1;
    }
    else
        video.currentTime = -1;
}
function test() {
    let button = document.getElementsByClassName('btn_skip')[0]
    if (button !== undefined && button !== null)
        button.click()
}

function connect() {
    websocket = new WebSocket("ws://localhost:9002/");

    websocket.onmessage = function (event) {
        let msg = event.data.split(' ');
        switch (msg[0]) {
        case "start":           playFollowChannel(msg[1]);  break;
        case "start_mix":       test();                     break;
        case "volume_down":     downVolume();               break;
        case "volume_up":       upVolume();                 break;
        case "speed_down":      downSpeed();                break;
        case "speed_up":        upSpeed();                  break;
        case "theatre_mode":    clickTheatreMode();         break;
        case "extend_chatting": extendChatting();           break;
        case "backward":        backward();                 break;
        case "forward":         forward();                  break;
        case "pause": {
                if (checkIsPlaying())
                    clickPauseBtn();
                else
                    playFollowChannel(1);
                break;
            }
        }
    };
}

connect();
