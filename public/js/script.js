document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

async function fetchEvents() {
    const container = document.getElementById('events-container');

    try {
        // Fetch events from our Node.js backend API
        const response = await fetch('/api/events');
        const events = await response.json();

        if (events.length === 0) {
            container.innerHTML = `<p class="loading">No sports events found right now. Check back soon!</p>`;
            return;
        }

        // Clear container and render event cards dynamically
        container.innerHTML = '';
        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <h3>${event.title}</h3>
                <div class="event-details">
                    <p><strong>Sport:</strong> ${event.sport}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Max Slots:</strong> ${event.maxParticipants}</p>
                </div>
                <a href="register.html?eventId=${event._id}&eventTitle=${encodeURIComponent(event.title)}" class="register-btn">Register Now</a>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error('Error fetching events:', err);
        container.innerHTML = `<p class="error">Failed to load sports events. Make sure the server is running!</p>`;
    }
}