import { Sortable, Plugins } from "./draggable.js";

let words = []; // Initialize an empty array for words
let startTime;
let timeout;
let elapsedTime = 0;
let toggleHints = false;
let dayIndex = 0;

function daysSinceJanFirst2024ET() {
  let nowInNY = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  nowInNY = new Date(nowInNY);

  let janFirst2024InNY = new Date("2024-01-01T00:00:00-05:00").toLocaleString(
    "en-US",
    {
      timeZone: "America/New_York",
    }
  );
  janFirst2024InNY = new Date(janFirst2024InNY);

  // Calculate the difference in milliseconds
  let differenceInMilliseconds = nowInNY - janFirst2024InNY;

  // Convert milliseconds to days
  let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  // Round down to get a whole number and return
  return Math.floor(differenceInDays);
}

function daysSinceJanFirst2024PT() {
  // Get the current date in Pacific Time
  let nowInPT = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  nowInPT = new Date(nowInPT);

  // Set January 1st, 2024 date in Pacific Time
  let janFirst2024InPT = new Date("2024-01-01T00:00:00-08:00").toLocaleString(
    "en-US",
    {
      timeZone: "America/Los_Angeles",
    }
  );
  janFirst2024InPT = new Date(janFirst2024InPT);

  // Calculate the difference in milliseconds
  let differenceInMilliseconds = nowInPT - janFirst2024InPT;

  // Convert milliseconds to days
  let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  // Round down to get a whole number and return
  return Math.floor(differenceInDays);
}

// Function to fetch words from JSON file
async function loadWords() {
  try {
    const response = await fetch("words.b2178ad5.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const wordData = await response.json();
    dayIndex = daysSinceJanFirst2024ET();
    words = wordData[dayIndex];
  } catch (e) {
    console.error("Failed to load words:", e);
  }
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  var interval = 1000; // ms
  var expected = Date.now() + interval;
  timeout = setTimeout(step, interval);
  function step() {
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
      // something really bad happened. Maybe the browser (tab) was inactive?
      // possibly special handling to avoid futile "catch up" run
    }
    elapsedTime = Date.now() - startTime;
    document.getElementById("timer").textContent = formatTime(elapsedTime);

    expected += interval;
    timeout = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
  }
}

function stopTimer() {
  clearTimeout(timeout);
}

function formatTime(milliseconds) {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadWords(); // Load words before proceeding

  if (words.length === 0) {
    console.error("No words loaded. Check your JSON file and fetch call.");
    return;
  }

  let currentWord = words[0].split("");

  // Reference to the modal and start button
  const modal = document.getElementById("startModal");
  const startButton = document.getElementById("start-button");

  // Display the modal immediately
  modal.style.display = "block";

  // Start button click event
  startButton.addEventListener("click", () => {
    startTimer(); // Start the timer
    modal.style.display = "none"; // Hide the modal
  });

  const toggleHintsCheckbox = document.getElementById("disable-hints");
  toggleHintsCheckbox.addEventListener("change", () => {
    toggleHints = toggleHintsCheckbox.checked;
    if (toggleHints) {
      console.log("Hints enabled");
    } else {
      console.log("Hints disabled");
    }
  });

  var resultMessage = document.getElementById("result-message");
  resultMessage.addEventListener("click", () => {
    const time = formatTime(elapsedTime);
    const hintStr = toggleHints ? "w/ hints" : "w/o hints";
    const shareMsg = `⏱️ ${time} ${hintStr}! (Shuffle #${dayIndex})`;

    if (navigator.share) {
      navigator.share({ text: shareMsg }).catch(console.error);
    } else {
      navigator.clipboard
        .writeText(shareMsg)
        .then(() => {
          resultMessage.textContent = "Copied to clipboard!";
          setTimeout(() => {
            resultMessage.textContent = "Woot! Share results ↗️";
          }, 1000);
        })
        .catch((err) => {
          console.error("Error in copying text: ", err);
        });
    }
  });

  function doTheWave() {
    const tiles = Array.from(
      document.querySelectorAll(
        ".tile:not(.draggable-mirror):not(.draggable-original)"
      )
    );
    tiles.forEach((tile, index) => {
      // Set a timeout for each tile to create the staggered wave effect
      setTimeout(() => {
        tile.classList.add("wave");
        // Remove the class after the animation is complete
        setTimeout(() => {
          tile.classList.remove("wave");
        }, 1500); // This should match the animation duration
      }, index * 100); // Staggered delay, increase this value to slow down the wave
    });
  }

  function checkAnswer() {
    const resultMessage = document.getElementById("result-message");
    const currentOrder = Array.from(
      document.querySelectorAll(
        ".tile:not(.draggable--original):not(.draggable-mirror)"
      )
    )
      .map((tile) => tile.textContent)
      .join("");
    if (currentOrder === words[1]) {
      stopTimer();
      resultMessage.textContent = "Woot! Share results ↗️";
      resultMessage.className = "correct-answer";
      draggable.destroy();
      setTimeout(() => {
        doTheWave();
      }, 0);
      return true;
    } else {
      resultMessage.textContent = "";
      resultMessage.className = "incorrect-answer";
      return false;
    }
  }

  function highlightCorrectTile(tile, index, targetWord) {
    if (tile.textContent === targetWord[index]) {
      tile.classList.add("correct-position"); // Highlight the tile if it's correct
      setTimeout(() => {
        tile.classList.remove("correct-position"); // Remove the highlight after a short delay
      }, 800); // Delay in milliseconds
    }
  }

  function createTiles(word) {
    const tileContainer = document.getElementById("tile-container");
    tileContainer.innerHTML = "";
    word.forEach((letter) => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.textContent = letter;
      tileContainer.appendChild(tile);
    });
  }

  createTiles(currentWord);

  const draggable = new Sortable(
    document.querySelectorAll(".draggable-container"),
    {
      draggable: ".tile",
      plugins: [Plugins.SortAnimation],
      swapAnimation: {
        duration: 200,
        easingFunction: "ease-in-out",
      },
      delay: {
        mouse: 0,
        drag: 0,
        touch: 5,
      },
    }
  );

  draggable.on("drag:start", (evt) => {
    // When dragging starts, set the size of the tile to its original size
    const originalSize = evt.source.getBoundingClientRect();
    evt.source.style.width = `${originalSize.width}px`;
    evt.source.style.height = `${originalSize.height}px`;
  });

  draggable.on("drag:stop", (evt) => {
    // Reset the styles after dragging stops
    evt.source.style.width = "";
    evt.source.style.height = "";
    if (!checkAnswer() && toggleHints) {
      setTimeout(() => {
        const droppedTile = document.querySelector(".draggable-source--placed");
        const tileIndex = Array.from(
          document.querySelectorAll(
            ".tile:not(.draggable--original):not(.draggable-mirror)"
          )
        ).indexOf(droppedTile);
        // Highlight the correct tile
        highlightCorrectTile(droppedTile, tileIndex, words[1]);
      }, 0);
    }
  });
});
