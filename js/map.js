document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return; 

    const map = L.map('map').setView([53.4808, -2.2426], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);

    let currentCenters = [];

    function renderCenters(centers) {
        currentCenters = centers;
        map.eachLayer((layer) => { if (layer instanceof L.Marker) map.removeLayer(layer); });
        centers.forEach(center => {
            const marker = L.marker([center.lat, center.lng]).addTo(map);
            marker.bindPopup(`<b>${center.name}</b><br>Accepts: ${center.type}<br><br>
                              <button onclick="openBooking(${center.id})" class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">Book Visit</button>`);
        });
    }

    renderCenters([
        { id: 1, name: "Manchester City Centre Hub", lat: 53.4808, lng: -2.2426, type: "Recycling, Plastic" },
        { id: 2, name: "Salford E-Waste Point", lat: 53.4830, lng: -2.2700, type: "E-Waste, Batteries" },
        { id: 3, name: "Ancoats Compost Site", lat: 53.4850, lng: -2.2200, type: "Organic, Garden" }
    ]);

    // Search Functionality
    const searchBtn = document.getElementById('searchBtn');
    const postcodeSearch = document.getElementById('postcodeSearch');

    searchBtn.addEventListener('click', async () => {
        const query = postcodeSearch.value.trim();
        if (!query) return;
        searchBtn.textContent = "Searching...";
        searchBtn.disabled = true;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                map.flyTo([lat, lng], 13, { duration: 1.5 });
                renderCenters([
                    { id: Date.now() + 1, name: "Local Recycling Hub", lat: lat + 0.012, lng: lng + 0.012, type: "Recycling, Plastic" },
                    { id: Date.now() + 2, name: "Community E-Waste Point", lat: lat - 0.010, lng: lng - 0.005, type: "E-Waste, Batteries" },
                    { id: Date.now() + 3, name: "Green Compost Site", lat: lat + 0.005, lng: lng - 0.015, type: "Organic, Garden" }
                ]);
                setTimeout(() => { map.eachLayer((layer) => { if (layer instanceof L.Marker) { layer.openPopup(); return; } }); }, 1600);
            } else {
                alert("Location not found.");
            }
        } catch (error) {
            alert("Error connecting to map service.");
        } finally {
            searchBtn.textContent = "Search";
            searchBtn.disabled = false;
        }
    });

    postcodeSearch.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); searchBtn.click(); } });

    // Booking Panel
    const bookingPanel = document.getElementById('bookingPanel');
    const overlay = document.getElementById('overlay');
    const closeBookingBtn = document.getElementById('closeBooking');
    const bookingForm = document.getElementById('bookingForm');
    const carPlate = document.getElementById('carPlate');
    const plateError = document.getElementById('plateError');
    const ukPlateRegex = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/i;

    window.openBooking = (centerId) => {
        const center = currentCenters.find(c => c.id === centerId);
        if (!center) return;
        document.getElementById('centerName').textContent = center.name;
        document.getElementById('centerType').textContent = "Accepts: " + center.type;
        bookingForm.reset();
        plateError.style.display = 'none';
        document.getElementById('bookDate').value = new Date().toISOString().split('T')[0];
        bookingPanel.classList.remove('hidden');
        overlay.classList.remove('hidden');
        updateBusyness();
    };

    const closeBooking = () => { bookingPanel.classList.add('hidden'); overlay.classList.add('hidden'); };
    closeBookingBtn.addEventListener('click', closeBooking);
    overlay.addEventListener('click', closeBooking);

    carPlate.addEventListener('input', () => {
        if (carPlate.value.length > 0 && !ukPlateRegex.test(carPlate.value)) {
            carPlate.style.borderColor = '#dc2626';
            plateError.style.display = 'block';
        } else {
            carPlate.style.borderColor = '#ccc';
            plateError.style.display = 'none';
        }
    });

    // Calendar and Time Picker
    flatpickr("#bookDate", { dateFormat: "Y-m-d", minDate: "today", disableMobile: true });
    
    function updateBusyness() {
        const dateStr = document.getElementById('bookDate').value + document.getElementById('bookTime').value;
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
        const busyness = Math.abs(hash % 100); 
        const dot = document.querySelector('.busy-indicator .dot');
        const text = document.getElementById('busyText');
        
        dot.className = 'dot';
        if (busyness < 40) { dot.classList.add('green'); text.textContent = "Not busy"; }
        else if (busyness < 75) { dot.classList.add('orange'); text.textContent = "Moderate"; }
        else { dot.classList.add('red'); text.textContent = "Very Busy!"; }
    }
    document.getElementById('bookDate').addEventListener('change', updateBusyness);
    document.getElementById('bookTime').addEventListener('change', updateBusyness);

    // Save Booking
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!ukPlateRegex.test(carPlate.value)) {
            carPlate.focus();
            plateError.style.display = 'block';
            carPlate.style.borderColor = '#dc2626';
            return;
        }
        const newBooking = {
            code: Math.floor(100000 + Math.random() * 900000),
            date: document.getElementById('bookDate').value,
            time: document.getElementById('bookTime').value,
            waste: document.getElementById('bookWaste').value,
            center: document.getElementById('centerName').textContent,
            plate: carPlate.value.toUpperCase()
        };
        let bookings = JSON.parse(localStorage.getItem('ll_bookings')) || [];
        bookings.push(newBooking);
        localStorage.setItem('ll_bookings', JSON.stringify(bookings));
        localStorage.setItem('ll_last_booking', JSON.stringify(newBooking));
        window.location.href = 'booking.html';
    });

    // Report Issue
    document.getElementById('reportIssueBtn').addEventListener('click', () => {
        alert("⚠️ Issue Reported! Our team has been notified.");
    });
});