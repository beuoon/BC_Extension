function getMusicTitle() {
    return document.getElementsByClassName('title style-scope ytmusic-player-bar')[0].getAttribute('title');
}
function checkIsPlaying() {
    return getMusicTitle() != "";
}
function dispatchEvenetToVolumeSlider(keyEvent) {
    let slider = document.getElementById('volume-slider');

    for (let i = 0; i < 5; i++) {
        slider.dispatchEvent(keyEvent);
    }
}

function getPlayList() {
    let playListSection = document.getElementById('sections').children[1]
    return playListSection.children.items.children
}

// 조작
function clickPrevBtn() {
    let prevBtn = document.getElementsByClassName('previous-button')[0];
    prevBtn.click();
}
function clickPauseBtn() {
    let pauseBtn = document.getElementsByClassName('play-pause-button')[0];
    pauseBtn.click();
}
function clickNextBtn() {
    let nextBtn = document.getElementsByClassName('next-button')[0];
    nextBtn.click();
}
function upVolume() {
    let keyEvent = new KeyboardEvent('keydown', {key: 'ArrowRight'})
    dispatchEvenetToVolumeSlider(keyEvent);
}
function downVolume() {
    let keyEvent = new KeyboardEvent('keydown', {key: 'ArrowLeft'})
    dispatchEvenetToVolumeSlider(keyEvent);
}
function clickRepeatBtn() {
    let repeatBtn = document.getElementById('expand-repeat');
    repeatBtn.click();
}
function clickShuffleBtn() {
    let shuffleBtn = document.getElementById('expand-shuffle');
    shuffleBtn.click();
}
function startPlayList(playListIndex) {
    let playList = getPlayList();
    if (playListIndex < 0 || playListIndex >= playList.length)
        return ;
    
    let playListBtn = playList[playListIndex].getElementsByTagName('ytmusic-play-button-renderer')[0];
    playListBtn.click();
}

function connect() {
    websocket = new WebSocket("ws://localhost:9002/");

    websocket.onmessage = function (event) {
        let msg = event.data.split(' ');
        switch (msg[0]) {
        case "prev":        clickPrevBtn();         break;
        case "next":        clickNextBtn();         break;
        case "start":       startPlayList(msg[1]);  break;
        case "start_mix":   startPlayList(0);       break;
        case "volume_down": downVolume();           break;
        case "volume_up":   upVolume();             break;
        case "repeat":      clickRepeatBtn();       break;
        case "shuffle":     clickShuffleBtn();      break;
        case "pause":
            {
                if (checkIsPlaying())
                    clickPauseBtn();
                else
                    startPlayList(0);
                break;
            }
        }
    };
}

connect();