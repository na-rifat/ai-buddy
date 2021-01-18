const btn = document.querySelector(`.talk`);
const stop = document.querySelector(`.stop`);
const display = document.querySelector(`.display`);
const body = document.querySelector(`body`);

const questions = {
    // [`do you know me`]:
};

var isauto = true;

const speechRecognition =
    window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new speechRecognition();

recognition.onstart = () => {
    display.innerHTML = `Listening...`;
};
recognition.onend = () => {
    display.innerHTML = ``;
};

recognition.onresult = (event) => {
    let speech = event.results[0][0].transcript;

    readtOut(speech);
};

btn.addEventListener(`click`, () => {
    isauto = true;
    recognition.start();
});
stop.addEventListener(`click`, () => {
    isauto = false;
});

const mouth = new SpeechSynthesisUtterance();
function readtOut(text) {
    text = text.toLowerCase();
    let output = process_response(text);

    mouth.text = output;
    mouth.rate = 0.8;
    mouth.volume = 1;
    mouth.pitch = 0.1;

    window.speechSynthesis.speak(mouth);

    console.log(text);
    console.log(mouth.text);
}

mouth.onend = () => {
    if (isauto) {
        recognition.start();
    }
};

function set_body_background() {
    body.style.backgroundColor = rand_rgb();
}

function rand_rgb() {
    let rgb = [rand_255(), rand_255(), rand_255()];
    rgb = rgb.join(`, `);
    return `rgb(${rgb})`;
}

function rand_255() {
    return Math.floor(Math.random() * 1000) % 255;
}

function set_data(key, value) {
    let previous = getCookie(`_user_info`);
    previous = previous.length == 0 ? `{}` : previous;
    previous = JSON.parse(previous);

    previous[key] = value;

    let data = JSON.stringify(previous);

    setCookie(`_user_info`, data, 14);
}

function get_data(key) {
    let data = getCookie(`_user_info`);
    data = JSON.parse(data);

    if (data == undefined) {
        data = {};
    }
    return data[key];
}

function init() {
    if (getCookie(`_user_info`) == 0) {
        setCookie(`_user_info`, `{}`, 7);
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var cond_holder = {};

function process_response(text) {
    let output;

    if (text.indexOf(`change my name`) > -1) {
        set_data(
            "user_name",
            text.replace(`change my name to`, ``).replace(`change my name`, ``)
        );
        output = `Your name just changed!`;
        return output;
    }
    if (text.indexOf(`haha`) > -1) {
        return `hahahhahaha, why you're laughing man!`;
    }

    if(text.indexOf(`say`) > -1){
        return text.replace(`say`, ``);
    }
    
    switch (text) {
        case `hey buddy`:
        case `hi buddy`:
        case `hello buddy`:
        case `hello`:
        case `hi`:
        case `hey`:
        case `hellow`:
            output = `Hello`;
            break;
        case `how are you`:
        case `what's up`:
        case `whats up`:
            output = `I'm fine buddy.`;
            break;
        case `do you know me`:
        case `can you tell about me`:
        case `do you know my name`:
        case `what is my name`:
            if (get_data("user_name") == undefined) {
                output = `I'm sorry buddy, I don't know you at this moment. Can you introduce yourself?`;
                cond_holder.will_save_name = true;
            } else {
                let name = get_data("user_name");
                output = `Of course mister ${name}`;
            }
            break;
        case `change my background colour`:
        case `change my background color`:
        case `change my background colour`:
        case `change the background color`:
        case `change the background colour`:
            output = `Your background color changed`;
            set_body_background();
            break;
        case `can you help me`:
            output = `How may I help you sir?`;
            break;
        case `do you know my sister`:
            output = `Yes, I know your Volluk syster`;
            break;
        case `what is her full name`:
            output = `Sharmin Jahan Rima`;
            break;
        case `what are you doing`:
            output = `talking with you at this moment`;
            break;
        case `who are you`:
            output = `I'm Buddy 1.0, your talking mate`;
            break;
        case `you mad buddy`:
        case `you crazy dude`:
        case `you mad dude`:
            output = `No, you're mad crazy boy`;
            break;
        default:
            let processed_info = process_info(text);
            if (processed_info) {
                return processed_info;
            }

            output = `I can't understand what are you saying.`;
            break;
    }
    return output;
}

function process_info(text) {
    if (cond_holder.will_save_name) {
        let name;
        name = text
            .toLowerCase()
            .replace(`my name is`, ``)
            .replace(`my name`, ``)
            .replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
            });
        output = `Thanks ${name}, I'll remember you for next 7 days `;
        set_data(`user_name`, name);
        cond_holder.will_save_name = false;
        return output;
    }

    return false;
}

function typewritter() {
    let self = $(`.typewritter`);
    let text = self.text();
}

init();
