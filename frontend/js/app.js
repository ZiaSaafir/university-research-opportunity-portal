
const API_URL = "http://127.0.0.1:8000/api/opportunities/";

const form = document.getElementById("opportunityForm");
const container = document.getElementById("opportunitiesContainer");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
const researchAreaFilter = document.getElementById("researchAreaFilter");
const clearFiltersButton = document.getElementById("clearFilters");

let allOpportunities = [];
let editingId = null;

// Show success or error messages.
function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;
}

// Make API requests and handle errors consistently.
async function apiRequest(url, options = {}) {
    let response;

    try {
        response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            }
        });
    } catch (error) {
        throw new Error(
            "Cannot connect to the server. Make sure Django is running."
        );
    }

    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        let errorMessage = `Request failed (${response.status}).`;

        if (data && typeof data === "object") {
            errorMessage = Object.entries(data)
                .map(([field, errors]) => {
                    const detail = Array.isArray(errors)
                        ? errors.join(", ")
                        : typeof errors === "string"
                            ? errors
                            : JSON.stringify(errors);

                    return `${field}: ${detail}`;
                })
                .join(" | ") || errorMessage;
        } else if (typeof data === "string" && data) {
            errorMessage = data;
        }

        throw new Error(errorMessage);
    }

    return data;
}

// Load opportunities from Django.
async function loadOpportunities() {
    container.textContent = "Loading opportunities...";

    try {
        const data = await apiRequest(API_URL);

        allOpportunities = Array.isArray(data) ? data : data.results || [];

        populateResearchAreas();
        filterOpportunities();
    } catch (error) {
        container.textContent = "";
        showMessage(error.message, "error");
    }
}

// Populate the research-area filter.
function populateResearchAreas() {
    const selectedArea = researchAreaFilter.value;

    const areas = [
        ...new Set(
            allOpportunities
                .map(item => item.research_area)
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b));

    researchAreaFilter.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Research Areas";
    researchAreaFilter.appendChild(defaultOption);

    areas.forEach(area => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        researchAreaFilter.appendChild(option);
    });

    if (areas.includes(selectedArea)) {
        researchAreaFilter.value = selectedArea;
    }
}

// Search by title, faculty, or skills and filter by research area.
function filterOpportunities() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedArea = researchAreaFilter.value;

    const filtered = allOpportunities.filter(item => {
        const searchableText = [
            item.title,
            item.faculty_name,
            item.required_skills
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);
        const matchesArea =
            !selectedArea || item.research_area === selectedArea;

        return matchesSearch && matchesArea;
    });

    displayOpportunities(filtered);
}

// Create a text paragraph safely.
function createDetailParagraph(label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    paragraph.appendChild(strong);
    paragraph.appendChild(
        document.createTextNode(
            value === null || value === undefined || value === ""
                ? "Not provided"
                : String(value)
        )
    );

    return paragraph;
}

// Display opportunity cards.
function displayOpportunities(opportunities) {
    container.replaceChildren();

    if (opportunities.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.textContent = "No research opportunities found.";
        container.appendChild(emptyState);
        return;
    }

    opportunities.forEach(item => {
        const card = document.createElement("article");
        card.className = "opportunity-card";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const status = document.createElement("span");
        status.className = "status";

        if (item.status === "Closed") {
            status.classList.add("closed");
        }

        status.textContent = item.status;

        card.append(title, status);

        card.appendChild(
            createDetailParagraph("Research Area", item.research_area)
        );

        card.appendChild(
            createDetailParagraph("Faculty", item.faculty_name)
        );

        card.appendChild(
            createDetailParagraph("Department", item.department)
        );

        card.appendChild(
            createDetailParagraph(
                "Available Positions",
                item.available_positions
            )
        );

        card.appendChild(
            createDetailParagraph(
                "Application Deadline",
                item.application_deadline
            )
        );

        const buttons = document.createElement("div");
        buttons.className = "card-buttons";

        buttons.appendChild(
            createButton("Details", () => viewOpportunity(item.id))
        );

        buttons.appendChild(
            createButton("Edit", () => editOpportunity(item.id))
        );

        if (item.status !== "Closed") {
            const closeButton = createButton(
                "Close",
                () => closeOpportunity(item.id)
            );

            closeButton.classList.add("close-btn");
            buttons.appendChild(closeButton);
        }

        const deleteButton = createButton(
            "Delete",
            () => deleteOpportunity(item.id)
        );

        deleteButton.classList.add("delete-btn");
        buttons.appendChild(deleteButton);

        card.appendChild(buttons);
        container.appendChild(card);
    });
}

// Create functional buttons without inserting API text as HTML.
function createButton(label, callback) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", callback);
    return button;
}

// Create a new opportunity or update an existing one.
form.addEventListener("submit", async event => {
    event.preventDefault();

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    const payload = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        research_area: document.getElementById("research_area").value.trim(),
        faculty_name: document.getElementById("faculty_name").value.trim(),
        department: document.getElementById("department").value.trim(),
        required_skills: document.getElementById("required_skills").value.trim(),
        available_positions: Number(
            document.getElementById("available_positions").value
        ),
        application_deadline:
            document.getElementById("application_deadline").value,
        status: document.getElementById("status").value
    };

    if (
        !payload.title ||
        !payload.description ||
        !payload.research_area ||
        !payload.faculty_name ||
        !payload.department ||
        !payload.required_skills ||
        !payload.application_deadline ||
        !Number.isInteger(payload.available_positions) ||
        payload.available_positions < 1
    ) {
        showMessage(
            "Please complete all required fields with valid values.",
            "error"
        );
        return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}${editingId}/` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    submitButton.disabled = true;

    try {
        await apiRequest(url, {
            method,
            body: JSON.stringify(payload)
        });

        showMessage(
            isEditing
                ? "Opportunity updated successfully."
                : "Opportunity created successfully."
        );

        resetForm();
        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        submitButton.disabled = false;
    }
});

// Load an opportunity into the form for editing.
async function editOpportunity(id) {
    try {
        const item = await apiRequest(`${API_URL}${id}/`);

        document.getElementById("title").value = item.title;
        document.getElementById("description").value = item.description;
        document.getElementById("research_area").value = item.research_area;
        document.getElementById("faculty_name").value = item.faculty_name;
        document.getElementById("department").value = item.department;
        document.getElementById("required_skills").value = item.required_skills;
        document.getElementById("available_positions").value =
            item.available_positions;
        document.getElementById("application_deadline").value =
            item.application_deadline;
        document.getElementById("status").value = item.status;

        editingId = id;

        form.querySelector('button[type="submit"]').textContent =
            "Update Opportunity";

        showMessage("Edit the fields below and submit your changes.");
        document.getElementById("management").scrollIntoView({
            behavior: "smooth"
        });
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// View complete opportunity details.
async function viewOpportunity(id) {
    try {
        const item = await apiRequest(`${API_URL}${id}/`);

        const title = document.getElementById("detailsTitle");
        const content = document.getElementById("detailsContent");
        const modal = document.getElementById("detailsModal");

        title.textContent = item.title;
        content.replaceChildren();

        content.appendChild(
            createDetailParagraph("Description", item.description)
        );
        content.appendChild(
            createDetailParagraph("Research Area", item.research_area)
        );
        content.appendChild(
            createDetailParagraph("Faculty Member", item.faculty_name)
        );
        content.appendChild(
            createDetailParagraph("Department", item.department)
        );
        content.appendChild(
            createDetailParagraph("Required Skills", item.required_skills)
        );
        content.appendChild(
            createDetailParagraph(
                "Available Positions",
                item.available_positions
            )
        );
        content.appendChild(
            createDetailParagraph(
                "Application Deadline",
                item.application_deadline
            )
        );
        content.appendChild(
            createDetailParagraph("Status", item.status)
        );

        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Close the details modal.
function closeDetails() {
    const modal = document.getElementById("detailsModal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
}

// Close an open opportunity.
async function closeOpportunity(id) {
    if (!confirm("Are you sure you want to close this opportunity?")) {
        return;
    }

    try {
        const item = await apiRequest(`${API_URL}${id}/`);

        if (item.status === "Closed") {
            showMessage("This opportunity is already closed.", "error");
            return;
        }

        item.status = "Closed";

        await apiRequest(`${API_URL}${id}/`, {
            method: "PUT",
            body: JSON.stringify(item)
        });

        showMessage("Opportunity closed successfully.");
        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Delete an opportunity.
async function deleteOpportunity(id) {
    if (!confirm("Are you sure you want to delete this opportunity?")) {
        return;
    }

    try {
        await apiRequest(`${API_URL}${id}/`, {
            method: "DELETE"
        });

        showMessage("Opportunity deleted successfully.");
        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Reset the form back to create mode.
function resetForm() {
    form.reset();
    editingId = null;

    form.querySelector('button[type="submit"]').textContent =
        "Create Opportunity";
}

// Search and filter events.
searchInput.addEventListener("input", filterOpportunities);

researchAreaFilter.addEventListener("change", filterOpportunities);

clearFiltersButton.addEventListener("click", () => {
    searchInput.value = "";
    researchAreaFilter.value = "";
    filterOpportunities();
});

// Close the details modal when clicking outside it.
document.getElementById("detailsModal").addEventListener("click", event => {
    if (event.target.id === "detailsModal") {
        closeDetails();
    }
});

// Close the modal using the Escape key.
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeDetails();
    }
});

// Start the application.
loadOpportunities();