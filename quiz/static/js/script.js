let time = 30;

function countDown() {
    let timeBox = document.querySelector(".time-box");
    x = setInterval(() => {
        if (time > 0) {
            time -= 1;
            timeBox.innerText = time.toString();
        } else {
            clearInterval(x)
            document.querySelectorAll(".option").forEach(button => {
                button.disabled = true;
                button.classList.add("time-out");
            });
        }
    }, 1000)
}

function speakWord(word) {
    let utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-Us";
    window.speechSynthesis.speak(utterance);
}

function calcScore(add) {
    let scoreBox = document.querySelector(".score-box");
    var score = Number(scoreBox.innerText);
    if (add) {
        score += 1;
        scoreBox.innerText = score.toString();
    } else {
        score -= 1;
        scoreBox.innerText = score.toString();
    }
}


function convertToAscii(text) {
    const turkishChars = {
        "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
        "Ç": "C", "Ğ": "G", "İ": "I", "Ö": "O", "Ş": "S", "Ü": "U"
    };

    let fixText = text.split('').map(char => turkishChars[char] || char).join('');
    console.log(fixText.replaceAll(" ", "-"))
    return fixText.replaceAll(" ", "-")
}

function loadNewQuestion() {
    fetch("/api/quiz")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.querySelector(".question-box").innerHTML = "No question found.";
                return;
            }
            let qBox = document.querySelector(".question-box")
            qBox.querySelector("p").innerText = data.question;
            qBox.setAttribute("data-question-id", data.question_id);

            let optionsContainer = document.querySelector(".options-container");
            optionsContainer.innerHTML = ""; // Önceki seçenekleri temizle

            data.options.forEach(option => {
                let btn = document.createElement("button");
                btn.classList.add("option");
                btn.innerText = option;
                optionsContainer.appendChild(btn);
            });
        })
        .catch(error => console.error("Error fetching question:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    loadNewQuestion();
    countDown();
});
document.querySelector(".options-container").addEventListener("click", function (event) {
    if (event.target.classList.contains("option")) {
        if (time <= 0) {
            document.querySelectorAll(".option").forEach(button => {
                button.disabled = true;
                button.classList.add("time-out");
            });
        }
        let questionId = document.querySelector(".question-box").getAttribute("data-question-id");
        let userAnswer = convertToAscii(event.target.innerText);
        document.querySelectorAll(".option").forEach(button => {
            button.disabled = true;
        });
        fetch(`/api/check-answer/${questionId}/${userAnswer}`)
            .then(response => response.json())
            .then(data => {
                console.log(`/api/check-answer/${questionId}/${userAnswer}`, data);
                if (data.correct) {
                    event.target.style.backgroundColor = "green";
                    time += 3;
                    calcScore(true)
                } else {
                    event.target.style.backgroundColor = "red";
                    calcScore(false)
                    document.querySelectorAll(".option").forEach(button => {
                        console.log(button.innerText, data.correct_answer)
                        if (button.innerText == data.correct_answer) {
                            button.style.backgroundColor = "green";
                        }
                    })
                }
            })
        setTimeout(() => {
            loadNewQuestion();
        }, 800)
    }
})

document.querySelector(".question-box p").addEventListener("click", function () {
    word = this.innerText;
    speakWord(word);
});