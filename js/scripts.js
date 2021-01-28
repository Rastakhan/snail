const questions = [];
const users = [];
var qs = [];
window.onload = () => {
    const btnPlay = document.getElementById('btn-play');
    const btnScore = document.getElementById('btn-score');
    const btnhome = document.getElementById('btn-home');
    const btnhome2 = document.getElementById('btn-home2');
    const hero = document.getElementById('hero');
    const data = document.getElementById('data');
    const games = document.getElementById('games');
    const score = document.getElementById('high-score');
    const form = document.getElementById('form-player');
    const question = document.getElementById('span-question');
    const category = document.getElementById('span-category');
    const difficulty = document.getElementById('span-difficulty');
    const listQuestion = document.getElementById('list-options');
    const listPlayers = document.getElementById('list-players');
    const finishv = document.getElementById('finishv');
    const h1score = document.getElementById('h1-result');
    const spscore = document.getElementById('rscore');
    const rtext = document.getElementById('rtext');
    const player = document.getElementById('player');


    var usersgo = {
        name: 'Ignorance',
        points: '0',
        time: '0'
    }



    var cont = 0;
    var points = 0;
    var playerName;



    btnPlay.addEventListener("click", play);
    btnScore.addEventListener("click", hscores);
    btnhome.addEventListener("click", vhome);
    btnhome2.addEventListener("click", vhome);


    function vhome() {
        hero.style.display = "block";
        score.style.display = "none";
        finishv.style.display = "none";


    }


    fetch('https://opentdb.com/api.php?amount=20')
        .then(res => res.json())
        .then(data => {
            questions.push(...data.results);
        });




    fetch('https://server-k5obqqq6h.vercel.app/api/users')
        .then(res => res.json())
        .then(data => {
            users.push(...data);
            users.sort((a, b) => {
                return parseFloat(b.points) - parseFloat(a.points);
            });
        });


    function play() {
        hero.style.display = "none";
        data.style.display = "block";
        cont = 0;
        points = 0;
    }

    function hscores() {
        hero.style.display = "none";
        score.style.display = "block";
        users.sort();
        listPlayers.innerHTML = "";
        for (var i = 0; i < 10; i++) {
            u = '<li> <span class="playern">' + users[i].name + '</span> <span>' + users[i].points + '</span></li>';
            listPlayers.innerHTML += u;
        }
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        playerName = player.value;
        player.value = '';
        if (playerName !== '') {
            game();
        } else {
            alert("Type your name to play")
        }
    }

    function game() {
        data.style.display = "none";
        games.style.display = "block";
        qs = [];

        if (cont >= 20) {
            finish();
        } else {
            question.innerHTML = questions[cont].question;
            category.innerHTML = questions[cont].category;
            difficulty.innerHTML = questions[cont].difficulty;

            questions[cont].incorrect_answers.forEach(element => {
                qs.push(element);
            });
            qs.push(questions[cont].correct_answer);
            qs.sort();

            if (questions[cont].type === "multiple") {
                loption = '<li class="btn btn-danger">' + qs[0] + '</li>' + '<li class="btn btn-success">' + qs[1] + '</li>' + '<li class="btn btn-primary">' + qs[2] + '</li>' + '<li class="btn btn-warning">' + qs[3] + '</li>';
                listQuestion.innerHTML = loption;
            } else {
                loption = '<li class="btn btn-danger">' + qs[0] + '</li>' + '<li class="btn btn-success">' + qs[1] + '</li>';
                listQuestion.innerHTML = loption;
            }
            const element = document.querySelectorAll("#list-options li");

            element.forEach((element, i) => {
                element.addEventListener('click', () => {
                    if (element.textContent === questions[cont].correct_answer) {
                        points++;
                        cont++;
                        game();
                    } else {
                        cont++;
                        game();
                    }
                });
            })
        }
    }

    function finish() {
        games.style.display = "none";
        finishv.style.display = "flex";
        spscore.innerHTML += points;
        if (points < 12) {
            h1score.innerHTML = "Sorry, Ignorance Wins"
            rtext.innerHTML = "you almost won";
        } else {
            h1score.innerHTML = "Congratulations!";

            if (points === 12) {
                rtext.innerHTML = "You almost lost";
            }
            if (points >= 13 && points <= 15) {
                rtext.innerHTML = "Good Job";
            }
            if (points > 15 && points <= 18) {
                rtext.innerHTML = "You're inteligent";
            }
            if (points > 18) {
                rtext.innerHTML = "You're really inteligent";

            }
        }
        usersgo.name = playerName;
        usersgo.points = points;
        fetch('https://server-k5obqqq6h.vercel.app/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usersgo)
        })
    }


}