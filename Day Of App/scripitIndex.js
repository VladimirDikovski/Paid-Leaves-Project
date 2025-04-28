const resultEl = document.querySelector(".result");
const inputCalendars = document.querySelectorAll(".input-calendar");
const [calendarInput1, calendarInput2] = inputCalendars;
const btnCalendarEl = document.querySelector(".btn-calendar");
const data = 0;

btnCalendarEl.addEventListener("click", function (e) {
  e.preventDefault();
  const date1 = new Date(calendarInput1.value);
  const date2 = new Date(calendarInput2.value);

  // Difference in milliseconds
  const diffTime = Math.abs(date1 - date2);

  // Convert milliseconds to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  getDataLocalStorage();
  console.log(data);

  resultEl.textContent = `${diffDays} day(s)`;
});

function getDataLocalStorage() {
  data = JSON.parse(localStorage.getItem("paidLeaves"));
  if (!data) return;
}
