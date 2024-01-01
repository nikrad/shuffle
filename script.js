import { Sortable, Plugins } from "./draggable.js";

let words = []; // Initialize an empty array for words
let startTime;
let timeout;
let elapsedTime = 0;
let toggleHints = false;

function getEasternTimeDate() {
  // Create a new Date object for the current time
  const now = new Date();

  // Convert to Eastern Time
  // 'toLocaleString' allows specifying a timezone
  const easternTime = now.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  // Convert the Eastern Time string back to a Date object
  const etDate = new Date(easternTime);

  // Extract year, month, and day
  const year = etDate.getFullYear();
  const month = (etDate.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
  const day = etDate.getDate().toString().padStart(2, "0");

  // Format as "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
}

// Function to fetch words from JSON file
async function loadWords() {
  try {
    const response = await fetch("words.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const wordData = await response.json();
    const date = getEasternTimeDate();
    console.log(date);
    words = wordData[date];
    console.log(words);
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
  startButton.addEventListener("click", function () {
    startTimer(); // Start the timer
    modal.style.display = "none"; // Hide the modal
  });

  // Add this inside your DOMContentLoaded event handler
  const toggleHintsCheckbox = document.getElementById("disable-hints");
  toggleHintsCheckbox.addEventListener("change", () => {
    toggleHints = toggleHintsCheckbox.checked;
    if (toggleHints) {
      console.log("Hints enabled");
    } else {
      console.log("Hints disabled");
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
      resultMessage.textContent = "Woot!";
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
        highlightCorrectTile(droppedTile, tileIndex, words[1]); // Highlight the correct tile
      }, 0);
    }
  });
});
