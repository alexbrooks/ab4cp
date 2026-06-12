// Priority & page script copied from new-site/script.js

// Smooth scrolling for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Priority issues data
const priorities = [
    { id: 'affordable-housing', label: 'Affordable Housing' },
    { id: 'social-housing', label: 'Social Housing' },
    { id: 'ev-charging', label: 'EV Charging' },
    { id: 'antisocial', label: 'Anti-Social Behaviour' },
    { id: 'transport', label: 'Transport & Roads' },
    { id: 'crime', label: 'Crime & Safety' },
    { id: 'parks', label: 'Parks & Green Spaces' },
    { id: 'environment', label: 'Environment' },
    { id: 'shops', label: 'Local High Street' },
    { id: 'schools', label: 'Schools & Education' },
    { id: 'nhs', label: 'NHS & Healthcare' },
    { id: 'youth', label: 'Youth Services' },
    { id: 'bins', label: 'Household Bins' },
    { id: 'flytipping', label: 'Flytipping' },
    { id: 'parking', label: 'Parking' },
    { id: 'social-care', label: 'Social Care' },
];

let selectedPriorities = [];

function initPriorityCloud() {
    const cloud = document.getElementById('priorityCloud');
    if (!cloud) return;

    loadUserSelections();

    priorities.forEach(priority => {
        const bubble = document.createElement('button');
        bubble.className = 'priority-bubble';
        bubble.setAttribute('data-id', priority.id);
        bubble.setAttribute('aria-pressed', selectedPriorities.includes(priority.id));
        bubble.type = 'button';

        const label = document.createElement('span');
        label.className = 'priority-label';
        label.textContent = priority.label;

        bubble.appendChild(label);
        bubble.onclick = () => togglePriority(priority.id);

        if (selectedPriorities.includes(priority.id)) bubble.classList.add('selected');

        cloud.appendChild(bubble);
    });

    updateSelectionCount();
    updatePriorityFields();
}

function loadUserSelections() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'userPriorities') {
            try {
                selectedPriorities = JSON.parse(decodeURIComponent(value));
            } catch (e) {
                selectedPriorities = [];
            }
            break;
        }
    }
}

function saveUserSelections() {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `userPriorities=${encodeURIComponent(JSON.stringify(selectedPriorities))}; expires=${expires.toUTCString()}; path=/`;
}

function togglePriority(id) {
    const bubble = document.querySelector(`[data-id="${id}"]`);
    const wasSelected = selectedPriorities.includes(id);

    if (wasSelected) {
        selectedPriorities = selectedPriorities.filter(p => p !== id);
        bubble.classList.remove('selected');
        bubble.setAttribute('aria-pressed', 'false');
    } else {
        if (selectedPriorities.length >= 3) {
            const removed = selectedPriorities.shift();
            const removedBubble = document.querySelector(`[data-id="${removed}"]`);
            if (removedBubble) {
                removedBubble.classList.remove('selected');
                removedBubble.setAttribute('aria-pressed', 'false');
            }
        }
        selectedPriorities.push(id);
        bubble.classList.add('selected');
        bubble.setAttribute('aria-pressed', 'true');
    }

    saveUserSelections();
    updateSelectionCount();
    updatePriorityFields();
}

function updatePriorityFields() {
    const priorityFieldsContainer = document.getElementById('priorityFields');
    if (!priorityFieldsContainer) return;
    priorityFieldsContainer.innerHTML = '';

    if (selectedPriorities.length > 0) {
        const priorityList = selectedPriorities.map(id => {
            const priority = priorities.find(p => p.id === id);
            return priority ? priority.label : id;
        });

        const prioritiesInput = document.createElement('input');
        prioritiesInput.type = 'hidden';
        prioritiesInput.name = 'Selected Priorities';
        prioritiesInput.value = priorityList.join(', ');
        priorityFieldsContainer.appendChild(prioritiesInput);
    }
}

function updateSelectionCount() {
    const el = document.getElementById('selectedCount');
    if (el) el.textContent = selectedPriorities.length;
}

window.addEventListener('DOMContentLoaded', initPriorityCloud);
