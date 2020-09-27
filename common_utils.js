const FORM_SPREADSHEET = '1FAIpQLScwHoXoJAIj5jQqw2eLuICfLqzO4muqWV8ktPddKV8NDVskeA';
const FORM_TEACHER_Q = '704755290';
const FORM_SCORE_Q = '1151751802';
const FORM_ACTIVITY_Q = '901058729';


function setScoreFromCookie(activity, callback) {
    let checkScoreCookie = getCookie(activity + 'theScore');
    if (checkScoreCookie !== "0") {
        setScore(checkScoreCookie, activity);
        callback(parseInt(checkScoreCookie));
    }
}

function $(elem) {
    return document.querySelector(elem);
}

function getParameter(name) {
    return (new URL(window.location.href)).searchParams.get(name);
}

function getScoreString(score) {
    score = parseInt(score);
    let a = Math.round(Math.random() * (score + 128));
    let b = 255 - a - score;
    let c = 25 + (score * 3);

    a = a.toString(16);
    b = b.toString(16);
    c = c.toString(16);

    a = (a.length < 2 ? '0' : '') + a;
    b = (b.length < 2 ? '0' : '') + b;
    c = (c.length < 2 ? '0' : '') + c;

    return (a + c + b).toUpperCase();
}

function setScore(score, activity) {
    $('#score').innerHTML = score;
    setCookie(activity + 'theScore', score.toString(10), 7);

    let turnInString = `<a href="https://docs.google.com/forms/d/e/${FORM_SPREADSHEET}/viewform?usp=pp_url`;
    if (getParameter('teacher')) {
        turnInString += `&entry.${FORM_TEACHER_Q}=${getParameter('teacher')}`;
    }
    turnInString += `&entry.${FORM_SCORE_Q}=${getScoreString(score)}`;
    turnInString += `&entry.${FORM_ACTIVITY_Q}=${activity}`;
    turnInString += `">Turn in score</a>`;

    $('#codeZ').innerHTML = turnInString;
}

function getScore() {
    return parseInt($('#score').innerHTML);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "0";
}