
var TAB_HOME = 0;
var TAB_EXPLORE = 1;
var TAB_STORAGE = 2;
var TAB_SEARCH = 3;

function sleep(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

function getMusicTitle() {
    return document.getElementsByClassName('title style-scope ytmusic-player-bar')[0].getAttribute('title');
}
function checkIsPlaying() {
    return getMusicTitle() != "";
}
function checkIsCurrentTab(index) {
    var status = document.getElementsByClassName('style-scope ytmusic-pivot-bar-renderer')[index].getAttribute('aria-selected');
    return status == "true";
}
function moveTab(index) {
    return new Promise(async function(resolve) {
        document.getElementsByClassName('style-scope ytmusic-pivot-bar-renderer')[index].click();

        let MAX_LOOP_CNT = 100;
        let bMoved = false;

        for (let i = 0; i < MAX_LOOP_CNT; i++) {
            if (checkIsCurrentTab(index)) {
                bMoved = true;
                break;
            }
            await sleep(100);
        }

        resolve(bMoved);
    });
}

function getVolume() {
    return parseInt(document.getElementById('volume-slider').getAttribute('value'));
}
function setVolume(size) {
    if (size < 0) size = 0;
    if (size > 100) size = 100;

    document.getElementById('volume-slider').setAttribute('value', size);
}

function getPlayList() {
    let playList = [];
    
    let renderer = document.getElementsByClassName('style-scope ytmusic-grid-renderer');
    for (let i = 0; i < renderer.length; i++) {
        if (renderer[i].tagName == 'YTMUSIC-TWO-ROW-ITEM-RENDERER') {
            playList.push(renderer[i]);
        }
    }

    return playList;
}
function getMix() {
    let renderer = document.getElementsByClassName('yt-simple-endpoint image-wrapper style-scope ytmusic-two-row-item-renderer');
    for (let i = 0; i < renderer.length; i++) {
        let title = renderer[i].getAttribute('title');
        if (title == '나만의 믹스' || title == 'My Supermix')
            return renderer[i];
    }
    return null;
}
function checkExistMix() {
    return new Promise(async function(resolve) {
        let bExist = false;
    
        if (!checkIsCurrentTab(TAB_HOME)) {
            let bMoved = await moveTab(TAB_HOME);
            if (!bMoved) resolve(false);
        }
        
        let mix = getMix();
        bExist = mix != null;
        
        resolve(bExist);
    });
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
    if (document.hasFocus()) return ;
    setVolume(getVolume() + 10);
}
function downVolume() {
    if (document.hasFocus()) return ;
    setVolume(getVolume() - 10);
}
function clickRepeatBtn() {
    let repeatBtn = document.getElementById('expand-repeat');
    repeatBtn.click();
}
function clickShuffleBtn() {
    let shuffleBtn = document.getElementById('expand-shuffle');
    shuffleBtn.click();
}
async function startPlayList(playListIndex) {
    if (!checkIsCurrentTab(TAB_STORAGE)) {
        let bMoved = await moveTab(TAB_STORAGE);
        if (!bMoved) return ;
    }
    
    let playList = getPlayList();
    if (playListIndex < 0 || playListIndex >= playList.length)
        return ;
    
    let playListBtn = playList[playListIndex].getElementsByClassName('icon style-scope ytmusic-play-button-renderer')[0];
    playListBtn.click();
}
async function startMix() {
    if (!checkIsCurrentTab(TAB_HOME)) {
        let bMoved = await moveTab(TAB_HOME);
        if (!bMoved) return ;
    }

    let mix = getMix();
    let mixBtn = mix.getElementsByClassName('icon style-scope ytmusic-play-button-renderer')[0];
    mixBtn.click();
}
async function startMixIfExist() {
    let bExistMix = await checkExistMix();

    if (bExistMix)
        startMix();
}
async function startDefault() {
    let bExistMix = await checkExistMix();

    if (bExistMix)
        startMix();
    else
        startPlayList(1);
}

function connect() {
    websocket = new WebSocket("ws://localhost:9002/");

    websocket.onmessage = function (event) {
        let msg = event.data.split(' ');
        switch (msg[0]) {
        case "prev":        clickPrevBtn();         break;
        case "next":        clickNextBtn();         break;
        case "start":       startPlayList(msg[1]);  break;
        case "start_mix":   startMixIfExist();      break;
        case "volume_down": downVolume();           break;
        case "volume_up":   upVolume();             break;
        case "repeat":      clickRepeatBtn();       break;
        case "shuffle":     clickShuffleBtn();      break;
        case "pause":
            {
                if (checkIsPlaying())
                    clickPauseBtn();
                else
                    startDefault();
                break;
            }
        }
    };
}

connect();