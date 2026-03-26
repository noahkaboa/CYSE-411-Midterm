// ============================================================
//  CYSE 411 Q4 Starter Code
//  Employee Directory Application


function loadSession() {
    const raw = sessionStorage.getItem("session");
    let session;
    try {
        session = JSON.parse(raw);          // No try/catch
    } catch(e) {
        console.log(e)
        console.log("Error parsing JSON from session storage")
        return;
    }

    if (session.userId == "") return null;
    if (session.role == "") return null;
    if (session.displayName == "") return null;

    return session;                            // No field validation
}


//  Q4.A  Status Message Rendering
//  Displays an employee's status message on their profile card.
//  VULNERABILITY: The message is inserted via innerHTML,
//  allowing any HTML or script tags in the message to
//  execute in the viewer's browser (stored XSS).


function renderStatusMessage(containerElement, message) {
    containerElement.innerHTML = "";
    pElement = document.createElement("p")
    pElement.textContent = message
    containerElement.appendChild(pElement);
}



//  Q4.B  Search Query Sanitization
//  Builds a display label from the user's search input.
//  VULNERABILITY: The raw input is used directly with no
//  character filtering, no length limit, and no trimming.


function sanitizeSearchQuery(input) {
    // TODO: Implement sanitization.
    // Requirements:
    //   - Trim leading/trailing whitespace before processing
    //   - Allow only letters, digits, spaces, hyphens, underscores
    //   - Max 40 characters
    //   - Return null if the result is empty after sanitization
    
    let final = input;
    final.trim(); // removes whitespace
    const re = /[a-zA-Z0-9-_ ]{1,40}/g;
    final = "".concat(...final.matchAll(re));
    if (final == "") return null;
    return final.substring(0,40);
    
}

function performSearch(query) {
    const sanitized = sanitizeSearchQuery(query);
    const label = document.getElementById("search-label");
    label.innerHTML = "Showing results for: " + sanitized;  // UNSAFE
}



//  Application Bootstrap
//  Runs when the page finishes loading.


document.addEventListener("DOMContentLoaded", function () {

    // Load session
    const session = loadSession();
    if (session) {
        document.getElementById("welcome-msg").textContent =
            "Welcome, " + session.displayName;
    }

    // Simulate receiving a profile card with a status message
    // In production this would come from an API response.
    const simulatedProfiles = [
        {
            name: "Alice Johnson",
            department: "Engineering",
            status: "Working from home today"
        },
        {
            name: "Bob Martinez",
            department: "Security",
            // Attacker-controlled payload – should NOT execute
            status: "<img src=x onerror=\"alert('XSS: session stolen')\">"
        },
        {
            name: "Carol Lee",
            department: "HR",
            status: "Out of office until Friday"
        }
    ];

    const directory = document.getElementById("directory");

    simulatedProfiles.forEach(function (profile) {
        const card = document.createElement("div");
        card.className = "profile-card";

        const nameEl = document.createElement("h3");
        nameEl.textContent = profile.name;

        const deptEl = document.createElement("p");
        deptEl.textContent = "Department: " + profile.department;

        const statusContainer = document.createElement("div");
        statusContainer.className = "status";

        // Q4.A – fix this call
        renderStatusMessage(statusContainer, profile.status);

        card.appendChild(nameEl);
        card.appendChild(deptEl);
        card.appendChild(statusContainer);
        directory.appendChild(card);
    });

    // Search button handler
    document.getElementById("search-btn").addEventListener("click", function () {
        const query = document.getElementById("search-input").value;
        performSearch(query);
    });

});
