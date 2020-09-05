
function clickPrevBtn() {
    let prev_btn = document.getElementsByClassName('previous-button')[0];
    prev_btn.click();
}
function clickPauseBtn() {
    let pause_btn = document.getElementsByClassName('play-pause-button')[0];
    pause_btn.click();
}
function clickNextBtn() {
    let next_btn = document.getElementsByClassName('next-button')[0];
    next_btn.click();
}

function connect() {
    websocket = new WebSocket("ws://localhost:9002/");

    websocket.onmessage = function (event) {
        console.log(event.data);
        switch (event.data) {
        case "prev":    clickPrevBtn();     break;
        case "pause":   clickPauseBtn();    break;
        case "next":    clickNextBtn();     break;
        }
    };
}

connect();