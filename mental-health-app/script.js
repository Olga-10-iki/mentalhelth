// Global variables
let selectedMood = null
let selectedMoodEmoji = null
let breathingInterval = null
let breathingActive = false

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  setupTabNavigation()
  loadDashboardData()
  loadMoodHistory()
  fetchDailyQuote()
  updateMoodSummary()
}

// Tab Navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab")

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })
}

// Dashboard Functions
function loadDashboardData() {
  fetchDailyTip()
}

async function fetchDailyTip() {
  const tips = [
    "Take 5 deep breaths when you feel overwhelmed. This activates your parasympathetic nervous system and helps you feel calmer.",
    "Practice gratitude by writing down 3 things you're thankful for each day. This simple practice can significantly improve your mood.",
    "Get some sunlight exposure in the morning. Natural light helps regulate your circadian rhythm and boosts serotonin levels.",
    "Stay hydrated! Dehydration can affect your mood and cognitive function. Aim for 8 glasses of water daily.",
    "Connect with a friend or family member today. Social connections are crucial for mental health and well-being.",
    "Take a 10-minute walk outside. Physical activity and nature exposure can reduce stress and improve mental clarity.",
    "Practice the 5-4-3-2-1 grounding technique: Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
    "Set boundaries with technology. Consider a digital detox for an hour each day to reduce anxiety and improve focus.",
    "Practice self-compassion. Treat yourself with the same kindness you would show a good friend.",
    "Establish a consistent sleep schedule. Quality sleep is fundamental to good mental health.",
  ]

  const randomTip = tips[Math.floor(Math.random() * tips.length)]
  document.getElementById("daily-tip").textContent = randomTip
}

// Quote Functions
async function fetchDailyQuote() {
  try {
    showLoading("quote-text")
    const response = await fetch("https://api.quotable.io/random?tags=motivational,wisdom,happiness")

    if (!response.ok) {
      throw new Error("Failed to fetch quote")
    }

    const data = await response.json()
    document.getElementById("quote-text").textContent = data.content
    document.getElementById("quote-author").textContent = data.author
  } catch (error) {
    console.error("Error fetching quote:", error)
    document.getElementById("quote-text").textContent = "The only way to do great work is to love what you do."
    document.getElementById("quote-author").textContent = "Steve Jobs"
  }
}

async function fetchNewQuote() {
  await fetchDailyQuote()
}

async function fetchQuoteByTag(tag) {
  try {
    showLoading("quote-text")
    const response = await fetch(`const response = await fetch("https://api.quotable.io/random");
`)

    if (!response.ok) {
      throw new Error("Failed to fetch quote")
    }

    const data = await response.json()
    document.getElementById("quote-text").textContent = data.content
    document.getElementById("quote-author").textContent = data.author
  } catch (error) {
    console.error("Error fetching quote:", error)
    showErrorMessage("Failed to fetch quote. Please try again.")
  }
}

// Mood Tracking Functions
function selectMood(mood, emoji) {
  selectedMood = mood
  selectedMoodEmoji = emoji

  // Remove selected class from all mood buttons
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.remove("selected")
  })

  // Add selected class to clicked button
  document.querySelector(`[data-mood="${mood}"]`).classList.add("selected")
}

function saveMood() {
  if (!selectedMood) {
    showErrorMessage("Please select a mood first.")
    return
  }

  const note = document.getElementById("mood-note").value
  const timestamp = new Date().toISOString()

  const moodEntry = {
    mood: selectedMood,
    emoji: selectedMoodEmoji,
    note: note,
    timestamp: timestamp,
    date: new Date().toLocaleDateString(),
  }

  // Save to localStorage
  let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || []
  moodHistory.unshift(moodEntry) // Add to beginning of array

  // Keep only last 30 entries
  if (moodHistory.length > 30) {
    moodHistory = moodHistory.slice(0, 30)
  }

  localStorage.setItem("moodHistory", JSON.stringify(moodHistory))

  // Reset form
  selectedMood = null
  selectedMoodEmoji = null
  document.getElementById("mood-note").value = ""
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.remove("selected")
  })

  // Reload mood history and update summary
  loadMoodHistory()
  updateMoodSummary()

  showSuccessMessage("Mood entry saved successfully!")
}

function loadMoodHistory() {
  const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || []
  const entriesContainer = document.getElementById("mood-entries")

  if (moodHistory.length === 0) {
    entriesContainer.innerHTML =
      '<p style="text-align: center; color: var(--text-light);">No mood entries yet. Start tracking your mood today!</p>'
    return
  }

  entriesContainer.innerHTML = ""

  // Show last 5 entries
  moodHistory.slice(0, 5).forEach((entry) => {
    const entryElement = document.createElement("div")
    entryElement.className = "mood-entry"

    entryElement.innerHTML = `
            <span class="mood-entry-emoji">${entry.emoji}</span>
            <div class="mood-entry-content">
                <strong>${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</strong>
                ${entry.note ? `<p>${entry.note}</p>` : ""}
                <div class="mood-entry-date">${entry.date}</div>
            </div>
        `

    entriesContainer.appendChild(entryElement)
  })
}

function updateMoodSummary() {
  const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || []

  if (moodHistory.length === 0) {
    document.getElementById("week-mood").textContent = "No data"
    document.getElementById("mood-streak").textContent = "0 days"
    return
  }

  // Calculate average mood for the week
  const lastWeek = moodHistory.filter((entry) => {
    const entryDate = new Date(entry.timestamp)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate >= weekAgo
  })

  if (lastWeek.length > 0) {
    const moodValues = { excellent: 5, good: 4, okay: 3, low: 2, struggling: 1 }
    const averageMood = lastWeek.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / lastWeek.length

    let moodText = "Okay"
    if (averageMood >= 4.5) moodText = "Excellent"
    else if (averageMood >= 3.5) moodText = "Good"
    else if (averageMood >= 2.5) moodText = "Okay"
    else if (averageMood >= 1.5) moodText = "Low"
    else moodText = "Struggling"

    document.getElementById("week-mood").textContent = moodText
  }

  // Calculate streak
  let streak = 0
  const today = new Date().toDateString()
  const currentDate = new Date()

  for (const entry of moodHistory) {
    const entryDate = new Date(entry.timestamp).toDateString()
    const checkDate = currentDate.toDateString()

    if (entryDate === checkDate) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  document.getElementById("mood-streak").textContent = `${streak} day${streak !== 1 ? "s" : ""}`
}

function logMood() {
  // Switch to mood tracker tab
  document.querySelector('[data-tab="mood"]').click()
}

// Breathing Exercise Functions
function showBreathingExercise() {
  document.getElementById("breathing-modal").style.display = "block"
}

function closeBreathingExercise() {
  document.getElementById("breathing-modal").style.display = "none"
  stopBreathingExercise()
}

function startBreathingExercise() {
  if (breathingActive) {
    stopBreathingExercise()
    return
  }

  breathingActive = true
  const circle = document.getElementById("breathing-circle")
  const instruction = document.getElementById("breathing-instruction")
  const button = document.getElementById("breathing-btn")

  button.textContent = "Stop"

  let phase = "inhale" // inhale, hold, exhale, hold
  let count = 0

  function updateBreathing() {
    switch (phase) {
      case "inhale":
        instruction.textContent = "Breathe in..."
        circle.classList.add("inhale")
        circle.classList.remove("exhale")
        setTimeout(() => {
          if (breathingActive) {
            phase = "hold1"
            updateBreathing()
          }
        }, 4000)
        break

      case "hold1":
        instruction.textContent = "Hold..."
        setTimeout(() => {
          if (breathingActive) {
            phase = "exhale"
            updateBreathing()
          }
        }, 2000)
        break

      case "exhale":
        instruction.textContent = "Breathe out..."
        circle.classList.add("exhale")
        circle.classList.remove("inhale")
        setTimeout(() => {
          if (breathingActive) {
            phase = "hold2"
            updateBreathing()
          }
        }, 4000)
        break

      case "hold2":
        instruction.textContent = "Hold..."
        setTimeout(() => {
          if (breathingActive) {
            count++
            if (count >= 5) {
              stopBreathingExercise()
              instruction.textContent = "Great job! You completed the breathing exercise."
            } else {
              phase = "inhale"
              updateBreathing()
            }
          }
        }, 2000)
        break
    }
  }

  updateBreathing()
}

function stopBreathingExercise() {
  breathingActive = false
  const circle = document.getElementById("breathing-circle")
  const instruction = document.getElementById("breathing-instruction")
  const button = document.getElementById("breathing-btn")

  circle.classList.remove("inhale", "exhale")
  instruction.textContent = "Click Start to begin"
  button.textContent = "Start"

  if (breathingInterval) {
    clearInterval(breathingInterval)
    breathingInterval = null
  }
}

// Utility Functions
function showLoading(elementId) {
  document.getElementById(elementId).innerHTML = '<span class="loading"></span> Loading...'
}

function showSuccessMessage(message) {
  const messageDiv = document.createElement("div")
  messageDiv.className = "success-message"
  messageDiv.textContent = message

  // Insert after mood notes section
  const moodNotes = document.querySelector(".mood-notes")
  moodNotes.parentNode.insertBefore(messageDiv, moodNotes.nextSibling)

  // Remove after 3 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

function showErrorMessage(message) {
  const messageDiv = document.createElement("div")
  messageDiv.className = "error-message"
  messageDiv.textContent = message

  // Insert after mood notes section
  const moodNotes = document.querySelector(".mood-notes")
  moodNotes.parentNode.insertBefore(messageDiv, moodNotes.nextSibling)

  // Remove after 3 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("breathing-modal")
  if (event.target === modal) {
    closeBreathingExercise()
  }
}

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}
