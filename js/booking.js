document.addEventListener('DOMContentLoaded', () => {
    const lastBooking = JSON.parse(localStorage.getItem('ll_last_booking'));
    const receiptContainer = document.getElementById('receiptContainer');
    const noBookingMessage = document.getElementById('noBookingMessage');

    if (lastBooking) {
        receiptContainer.classList.remove('hidden');
        noBookingMessage.classList.add('hidden');
        document.getElementById('displayCode').textContent = '#' + lastBooking.code;
        document.getElementById('rcCenter').textContent = lastBooking.center;
        document.getElementById('rcDate').textContent = lastBooking.date;
        document.getElementById('rcTime').textContent = lastBooking.time;
        document.getElementById('rcWaste').textContent = lastBooking.waste;
        document.getElementById('rcPlate').textContent = lastBooking.plate;
    } else {
        receiptContainer.classList.add('hidden');
        noBookingMessage.classList.remove('hidden');
    }
});