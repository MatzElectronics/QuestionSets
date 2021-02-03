const FORM_SPREADSHEET = '1FAIpQLScwHoXoJAIj5jQqw2eLuICfLqzO4muqWV8ktPddKV8NDVskeA';
const FORM_TEACHER_Q = '704755290';  //704755290
const FORM_SCORE_Q = '1151751802';
const FORM_ACTIVITY_Q = '901058729';

const names = [
    'James',
    'John',
    'Robert',
    'Michael',
    'William',
    'David',
    'Richard',
    'Joseph',
    'Thomas',
    'Charles',
    'Christopher',
    'Daniel',
    'Matthew',
    'Anthony',
    'Donald',
    'Mark',
    'Paul',
    'Steven',
    'Andrew',
    'Kenneth',
    'George',
    'Joshua',
    'Kevin',
    'Brian',
    'Edward',
    'Ronald',
    'Timothy',
    'Jason',
    'Jeffrey',
    'Ryan',
    'Jacob',
    'Gary',
    'Nicholas',
    'Eric',
    'Stephen',
    'Jonathan',
    'Larry',
    'Justin',
    'Scott',
    'Brandon',
    'Frank',
    'Benjamin',
    'Gregory',
    'Raymond',
    'Samuel',
    'Patrick',
    'Alexander',
    'Jack',
    'Dennis',
    'Jerry',
    'Tyler',
    'Aaron',
    'Henry',
    'Jose',
    'Douglas',
    'Peter',
    'Adam',
    'Nathan',
    'Zachary',
    'Walter',
    'Kyle',
    'Harold',
    'Carl',
    'Jeremy',
    'Gerald',
    'Keith',
    'Roger',
    'Arthur',
    'Terry',
    'Lawrence',
    'Sean',
    'Christian',
    'Ethan',
    'Austin',
    'Joe',
    'Albert',
    'Jesse',
    'Willie',
    'Billy',
    'Bryan',
    'Bruce',
    'Noah',
    'Jordan',
    'Dylan',
    'Ralph',
    'Roy',
    'Alan',
    'Wayne',
    'Eugene',
    'Juan',
    'Gabriel',
    'Louis',
    'Russell',
    'Randy',
    'Vincent',
    'Philip',
    'Logan',
    'Bobby',
    'Harry',
    'Johnny',
    'Mary',
    'Patricia',
    'Jennifer',
    'Linda',
    'Elizabeth',
    'Barbara',
    'Susan',
    'Jessica',
    'Sarah',
    'Margaret',
    'Karen',
    'Nancy',
    'Lisa',
    'Betty',
    'Dorothy',
    'Sandra',
    'Ashley',
    'Kimberly',
    'Donna',
    'Emily',
    'Carol',
    'Michelle',
    'Amanda',
    'Melissa',
    'Deborah',
    'Stephanie',
    'Rebecca',
    'Laura',
    'Helen',
    'Sharon',
    'Cynthia',
    'Kathleen',
    'Amy',
    'Shirley',
    'Angela',
    'Anna',
    'Ruth',
    'Brenda',
    'Pamela',
    'Nicole',
    'Katherine',
    'Samantha',
    'Christine',
    'Catherine',
    'Virginia',
    'Debra',
    'Rachel',
    'Janet',
    'Emma',
    'Carolyn',
    'Maria',
    'Heather',
    'Diane',
    'Julie',
    'Joyce',
    'Evelyn',
    'Joan',
    'Victoria',
    'Kelly',
    'Christina',
    'Lauren',
    'Frances',
    'Martha',
    'Judith',
    'Cheryl',
    'Megan',
    'Andrea',
    'Olivia',
    'Ann',
    'Jean',
    'Alice',
    'Jacqueline',
    'Hannah',
    'Doris',
    'Kathryn',
    'Gloria',
    'Teresa',
    'Sara',
    'Janice',
    'Marie',
    'Julia',
    'Grace',
    'Judy',
    'Theresa',
    'Madison',
    'Beverly',
    'Denise',
    'Marilyn',
    'Amber',
    'Danielle',
    'Rose',
    'Brittany',
    'Diana',
    'Abigail',
    'Natalie',
    'Jane',
    'Lori',
    'Alexis',
    'Tiffany',
    'Kayla'
]

function randomName() {
    var n = Math.floor(Math.random() * names.length);
    return names[n];
}

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

function $$(elem) {
    return document.querySelectorAll(elem);
}

function addClass(selector, classToAdd) {
    if (typeof selector === 'string') {
        $$(selector).forEach((e) => {
            e.classList.add(classToAdd);
        });
    } else if (selector.classList) {
        selector.classList.add(classToAdd);
    }
}

function removeClass(selector, classToRemove) {
    if (typeof selector === 'string') {
        $$(selector).forEach((e) => {
            e.classList.remove(classToRemove);
        });
    } else if (selector.classList) {
        selector.classList.remove(classToRemove);
    }
}

function hasClass(selector, classToSearchFor) {
    if (selector !== 'string' && selector.classList) {
        return (selector.classList.toString().indexOf(classToSearchFor) > -1);
    } else {
        return ($(selector).classList.toString().indexOf(classToSearchFor) > -1);
    }
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

    return ' ' + (a + c + b).toUpperCase();
}

function setScore(score, activity) {
    $('#score').innerHTML = score;
    setCookie(activity + 'theScore', score.toString(10), 7);

    if (getParameter('teacher')) {
        let turnInString = `<a href="https://docs.google.com/forms/d/e/${FORM_SPREADSHEET}/viewform?usp=pp_url`;
        turnInString += `&entry.${FORM_TEACHER_Q}=${getParameter('teacher')}`;
        turnInString += `&entry.${FORM_SCORE_Q}=${getScoreString(score)}`;
        turnInString += `&entry.${FORM_ACTIVITY_Q}=${activity}`;
        turnInString += `">Turn in score</a>`;
    
        $('#codeZ').innerHTML = turnInString;
    } else {
        $('#codeZ').innerHTML = '';
    }
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