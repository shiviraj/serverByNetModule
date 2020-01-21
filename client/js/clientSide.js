const clock = document.getElementById('clock');
const setDate = function() {
  clock.innerHTML = `<strong>${new Date()}</strong>`;
};
setInterval(setDate, 1000);
setDate();
