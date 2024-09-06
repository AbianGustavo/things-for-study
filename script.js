const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const finish_btn = document.querySelector("footer .finish_btn");
const prev_btn = document.querySelector("footer .prev_btn");
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");
const startQuestionSelect = document.getElementById('start_question');


let userAnswers = [];
let timeValue = 60;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let widthValue = 0;
let initialQuestionIndex = 0; 
let totalQuestionsAnswered = 0;


start_btn.onclick = () => {
    info_box.classList.add("activeInfo"); 
}

exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); 
}

function showResult() {
    quiz_box.classList.remove("activeQuiz"); 
    result_box.classList.add("activeResult"); 

    totalQuestionsAnswered = que_count - initialQuestionIndex + 1;

    const scoreText = result_box.querySelector(".score_text");
    const totalQuestions = totalQuestionsAnswered;

    let scoreTag;
    if (userScore >= 0) {
        scoreTag = `<span>Lograste <p>${userScore}</p> de <p>${totalQuestions}</p></span>`;
    }

    scoreText.innerHTML = scoreTag; 
}

continue_btn.onclick = () => {
    que_count = parseInt(startQuestionSelect.value); 
    que_numb = que_count + 1; 
    initialQuestionIndex = que_count; 
    info_box.classList.remove("activeInfo"); 
    quiz_box.classList.add("activeQuiz"); 
    showQuetions(que_count); 
    queCounter(que_numb); 
    startTimer(60); 
}

const quit_quiz = result_box.querySelector(".buttons .quit");


quit_quiz.onclick = () => {
    window.location.reload(); 
}

next_btn.onclick = () => {
    if (que_count < questions.length - 1) { 
        que_count++; 
        que_numb++; 
        showQuetions(que_count); 
        queCounter(que_numb); 
        clearInterval(counter); 
        startTimer(timeValue); 
        timeText.textContent = "Tiempo restante"; 
        next_btn.classList.remove("show"); 
    } else {
        clearInterval(counter); 
        showResult(); 
    }
}

prev_btn.onclick = () => {
    if (que_count > initialQuestionIndex) { 
        que_count--; 
        que_numb--; 
        showQuetions(que_count); 
        queCounter(que_numb); 
        clearInterval(counter); 
        startTimer(timeValue);
        timeText.textContent = "Tiempo restante"; 
        next_btn.classList.remove("show"); 
        updatePrevBtn(); 
    }
}

function updatePrevBtn() {
    if (que_count === initialQuestionIndex) {
        prev_btn.style.display = 'none'; 
    } else {
        prev_btn.style.display = 'block'; 
    }
}

function showQuetions(index) {
    const que_text = document.querySelector(".que_text");

    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let option_tag = '<div class="option"><span>' + questions[index].options[0] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[1] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[2] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[3] + '</span></div>';
    que_text.innerHTML = que_tag; 
    option_list.innerHTML = option_tag; 

    const option = option_list.querySelectorAll(".option");

    for (let i = 0; i < option.length; i++) {
        if (userAnswers[index] === option[i].textContent) {
            option[i].classList.add("selected");
            option[i].classList.add(userAnswers[index] === questions[index].answer ? "correct" : "incorrect");
            option[i].insertAdjacentHTML("beforeend", userAnswers[index] === questions[index].answer ? tickIconTag : crossIconTag);
            option[i].classList.add("disabled"); 
        }
    }

    for (let i = 0; i < option.length; i++) {
        if (!userAnswers[index]) {
            option[i].setAttribute("onclick", "optionSelected(this)");
        } else {
            option[i].classList.add("disabled"); 
        }
    }

    updatePrevBtn(); 
}

let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer) {
    clearInterval(counter); 

    let userAns = answer.textContent; 
    let correcAns = questions[que_count].answer; 
    const allOptions = option_list.children.length; 

    if (!userAnswers[que_count]) {
        userAnswers[que_count] = userAns; 
    }

    if (userAns == correcAns) { 
        userScore += 1; 
        answer.classList.add("correct"); 
        answer.insertAdjacentHTML("beforeend", tickIconTag); 
    } else {
        answer.classList.add("incorrect"); 
        answer.insertAdjacentHTML("beforeend", crossIconTag); 

        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) { 
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
            }
        }
    }

    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }

    next_btn.classList.add("show"); 
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; 
        time--; 
        if (time < 9) { 
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) { 
            clearInterval(counter); 
            timeText.textContent = "Se acabó el tiempo"; 
            const allOptions = option_list.children.length; 
            let correcAns = questions[que_count].answer; 
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) { 
                    option_list.children[i].setAttribute("class", "option correct"); 
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); 
                    console.log("Tiempo agotado: Se seleccionó automáticamente la respuesta correcta.");
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled"); 
            }
            next_btn.classList.add("show"); 
        }
    }
}

function queCounter(index) {
    let totalQueCounTag = '<span><p>' + index + '</p> Pregunta</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag; 
}

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < questions.length; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = "Pregunta " + (i + 1);
        startQuestionSelect.appendChild(option);
    }

    updatePrevBtn();
});

finish_btn.onclick = () => {
    clearInterval(counter); 
    showResult(); 
}
