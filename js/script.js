/**
 * Personality Quiz JavaScript
 * This script handles the interactive functionality of a personality quiz where users
 * answer multiple-choice questions and receive a personality category based on their answers.
 */

// Verify script connection to HTML
console.log("script.js connected!");

/**
 * --- DOM Element Selection ---
 * Get references to all major UI elements we'll need to manipulate.
 * Each element is selected using its unique ID from the HTML.
 */

// Main UI Elements
let title        = document.getElementById("quiz-title");        // Main quiz title heading
let instructions = document.getElementById("quiz-instructions"); // Instructions paragraph
let debugLine    = document.getElementById("debug-output");     // Debug output container

// Result-related Elements
let showBtn      = document.getElementById("show-result");      // Button to display final results
let resultBox    = document.getElementById("result-container"); // Container for quiz results
let resultText   = document.getElementById("result-text");      // Text element for result display

/**
 * Select all answer buttons within the quiz questions section
 * These buttons have the structure:
 * <button class="answer-btn" data-question="1" data-answer="A">Answer text</button>
 * where data-question indicates question number and data-answer indicates A/B/C/D
 */
let buttons = document.querySelectorAll("#quiz-questions .answer-btn");

/**
 * Object to store the user's selected answers
 * Format: { questionNumber: selectedAnswer }
 * Example: { "1":"B", "2":"D" } means Question 1 = B, Question 2 = D
 */
let userAnswers = {};

/**
 * Helper function that finds the parent question block container of a clicked button
 * This is used to ensure we only highlight/unhighlight buttons within the current question
 * @param {HTMLElement} btn - The clicked answer button
 * @returns {HTMLElement|null} The parent question block element or null if not found
 */
function getQuestionBlock(btn) {
  let node = btn.parentElement;
  while (node && node.classList && !node.classList.contains("question-block")) {
    node = node.parentElement;
  }
  return node;
}

/**
 * Add click event handlers to all answer buttons
 * When a button is clicked:
 * 1. Records the selected answer
 * 2. Updates the UI to show the selected state
 * 3. Provides user feedback
 * 4. Updates debug information
 */
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Extract question number and answer choice from button's data attributes
    let q = button.dataset.question; // Question number (1-5)
    let a = button.dataset.answer;   // Answer letter (A-D)

    // Find and update button highlighting within this question block only
    let block = getQuestionBlock(button);
    if (block) {
      let blockButtons = block.querySelectorAll(".answer-btn");
      blockButtons.forEach(function (b) { b.classList.remove("selected"); });
    }
    button.classList.add("selected");

    // Store answer and update UI feedback
    userAnswers[q] = a;
    title.textContent = "Selection saved";
    instructions.textContent = "Q" + q + " = " + a + ". Pick the rest, then click Show Results.";
    debugLine.textContent = "Current answers: " + JSON.stringify(userAnswers);
    console.log("userAnswers:", userAnswers);
  });
});

/**
 * Scoring System
 * Points are assigned to each answer choice:
 * A = 1 point
 * B = 2 points
 * C = 3 points
 * D = 4 points
 */
let points = { "A": 1, "B": 2, "C": 3, "D": 4 };

/**
 * Determines the personality category based on total points
 * @param {number} total - The total points from all answers
 * @returns {string} The personality category
 */
function categoryFromTotal(total) {
  if (total <= 6)  { return "Jock"; }        // 6 or fewer points
  if (total <= 10) { return "Party Animal"; } // 7-10 points
  if (total <= 15) { return "Flirt"; }        // 11-15 points
  if (total >= 16) { return "Nerd"; }         // 16 or more points
}

/**
 * Calculates and displays the final quiz result
 * This function:
 * 1. Checks if all questions are answered
 * 2. Calculates total points from answers
 * 3. Determines personality category
 * 4. Updates UI with results
 */
function displayResult() {
  // Count total questions and answered questions
  let totalQuestions = document.querySelectorAll(".question-block").length;
  let answeredCount = Object.keys(userAnswers).length;

  // Check if all questions have been answered
  if (answeredCount < totalQuestions) {
    resultText.textContent = "Please answer all " + totalQuestions +
      " questions. (" + answeredCount + "/" + totalQuestions + " done)";
    resultBox.classList.remove("d-none"); // Show result box with warning
    return;
  }

  // Calculate total points from all answers
  let total = 0;
  for (let q in userAnswers) {
    let letter = userAnswers[q];
    let add = points[letter] || 0; // Get point value for answer, default to 0 if invalid
    total += add;
  }

  // Get personality category and display results
  let category = categoryFromTotal(total);
  resultText.textContent = " → You are a: " + category + "!";
  resultBox.classList.remove("d-none"); // Show result box with personality

  // Update page title and instructions for final state
  title.textContent = "Your Result: " + category;
  instructions.textContent = "Change answers anytime and click Show Results again.";
}

// Add click handler to the "Show Results" button
showBtn.addEventListener("click", function () {
  displayResult();
});