console.log("script.js connected!");

// Grab renamed elements
let title        = document.getElementById("quiz-title");
let instructions = document.getElementById("quiz-instructions");
let debugLine    = document.getElementById("debug-output");

let showBtn      = document.getElementById("show-result");
let resultBox    = document.getElementById("result-container");
let resultText   = document.getElementById("result-text");

// Select all answer buttons under the new wrapper
let buttons = document.querySelectorAll("#quiz-questions .answer-btn");

// Store selections by question number, e.g. { "1":"B", "2":"D" }
let userAnswers = {};

// Find the parent .question-block of a button 
function getQuestionBlock(btn) {
  let node = btn.parentElement;
  while (node && node.classList && !node.classList.contains("question-block")) {
    node = node.parentElement;
  }
  return node;
}

// Click handler: highlight within the same block + store answer
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    let q = button.dataset.question; // "1".."5"
    let a = button.dataset.answer;   // "A".."D"

    // limit toggle to this question block
    let block = getQuestionBlock(button);
    if (block) {
      let blockButtons = block.querySelectorAll(".answer-btn");
      blockButtons.forEach(function (b) { b.classList.remove("selected"); });
    }
    button.classList.add("selected");

    // store and show feedback
    userAnswers[q] = a;
    title.textContent = "Selection saved";
    instructions.textContent = "Q" + q + " = " + a + ". Pick the rest, then click Show Results.";
    debugLine.textContent = "Current answers: " + JSON.stringify(userAnswers);
    console.log("userAnswers:", userAnswers);
  });
});

// Simple scoring (adjust these later for your theme)
let points = { "A": 1, "B": 2, "C": 3, "D": 4 };

function categoryFromTotal(total) {
  if (total <= 6)  { return "Jock"; }
  if (total <= 10)  { return "Party Animal"; }
  if (total <= 15) { return "Flirt"; }
  if (total >= 16) { return "Nerd"; }
}

function displayResult() {
  let totalQuestions = document.querySelectorAll(".question-block").length;
  let answeredCount = Object.keys(userAnswers).length;

  if (answeredCount < totalQuestions) {
    resultText.textContent = "Please answer all " + totalQuestions +
      " questions. (" + answeredCount + "/" + totalQuestions + " done)";
    resultBox.classList.remove("d-none");
    return;
  }

  let total = 0;
  for (let q in userAnswers) {
    let letter = userAnswers[q];
    let add = points[letter] || 0;
    total += add;
  }

  let category = categoryFromTotal(total);
  resultText.textContent = " → You are a: " + category + "!";
  resultBox.classList.remove("d-none");

  title.textContent = "Your Result: " + category;
  instructions.textContent = "Change answers anytime and click Show Results again.";
}

showBtn.addEventListener("click", function () {
  displayResult();
});