const resultEl = document.querySelector(".result");
const inputCalendars = document.querySelectorAll(".input-calendar");
const [calendarInput1, calendarInput2] = inputCalendars;
const btnCalendarEl = document.querySelector(".btn-calendar");
const inputNavFieldsEl = document.querySelectorAll(".input-nav");
const [inputEmail, inputPassowrd] = inputNavFieldsEl;
const btnSubmitNav = document.querySelector(".sumbit-nav");
const detailsFormEl = document.querySelector(".details-form");
const liNavEl = document.querySelector(".details");
const nameDetails = document.querySelector(".user-details");
const paidLeavesEl = document.querySelector(".paidleave");
const tableBodyel = document.querySelector(".t-body");
const daysrequestEl = document.querySelector(".days-request");
const btnCalculate = document.querySelector(".btn-calendar-submit");

class Request {
  constructor(id, dataIn, DataOut, days) {
    this.id = id;
    this.dataIn = dataIn;
    this.DataOut = DataOut;
    this.days = days;
  }
}

class Application {
  #listRequests = [];
  #count;
  #startDate;
  #endDate;
  #data = 0;
  #firstName = "";
  #userName = "";
  #countRequest = 0;

  bulgarianHolidays = [
    "01.01", // New Year's Day
    "03.03", // Liberation Day
    "01.05", // Labour Day
    "06.05", // St. George's Day
    "24.05", // Saints Cyril and Methodius Day
    "06.09", // Unification Day
    "22.09", // Independence Day
    "24.12", // Christmas Eve
    "25.12", // Christmas Day
    "26.12", // Second Christmas Day
  ];

  constructor() {
    btnCalculate.addEventListener(
      "click",
      this._calculateDeltaBetweenDates.bind(this)
    );
    this._getDataLocalStorage("paid");
    btnCalendarEl.addEventListener("click", (e) => {
      e.preventDefault();
      const today = new Date();
      if (this.#startDate < today || this.#endDate < today) {
        resultEl.textContent = "You cannot select past dates.";
        return;
      }

      if (isNaN(this.#startDate) || isNaN(this.#endDate)) {
        resultEl.textContent = "Please select valid dates.";
        return;
      }
      this._renderHTMLtable(this.#startDate, this.#endDate, this.#count);
      this._calculateDateForPaidLeaves();
      this._inputCalendarFormHidden(daysrequestEl);
    });

    btnSubmitNav.addEventListener("click", this._checkLoginDetails.bind(this));
  }

  _calculateDeltaBetweenDates(e) {
    e.preventDefault();
    this.#startDate = new Date(calendarInput1.value);
    this.#endDate = new Date(calendarInput2.value);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.#startDate < today || this.#endDate < today) {
      resultEl.textContent = "You cannot select past dates.";
      return;
    }

    if (isNaN(this.#startDate) || isNaN(this.#endDate)) {
      resultEl.textContent = "Please select valid dates.";
      return;
    }

    this.#count = 0;
    let currentDate = new Date(Math.min(this.#startDate, this.#endDate));
    const finalDate = new Date(Math.max(this.#startDate, this.#endDate));

    while (currentDate <= finalDate) {
      const day = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      const formatted = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}.${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

      if (
        day !== 0 &&
        day !== 6 &&
        !this.bulgarianHolidays.includes(formatted)
      ) {
        this.#count++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    resultEl.textContent = `${this.#count} working day(s)`;
  }

  _getDataLocalStorage(dataBase) {
    this.#data = JSON.parse(localStorage.getItem(dataBase));
    if (!this.#data) return this.#data;
  }

  _checkLoginDetails(e) {
    e.preventDefault();
    const emailToLower = inputEmail.value.toLowerCase();
    const password = inputPassowrd.value;

    this.#userName = this.#data.find((user) => user.email === emailToLower);
    if (!this.#userName) return alert("User doesnt exist");
    if (this.#userName.password !== inputPassowrd.value)
      return alert("Password is not the same");
    this.#firstName = this.#userName.email.split(".")[0];
    const upperCase =
      this.#firstName[0].toUpperCase() + this.#firstName.slice(1);
    nameDetails.innerHTML = `Hello ${upperCase}`;
    inputEmail.value = "";
    inputPassowrd.value = "";
    liNavEl.classList.add("hidden");

    this._inputCalendarFormHidden(detailsFormEl);
    this._inputCalendarFormHidden(nameDetails);
    paidLeavesEl.innerHTML = this.#userName.days;
  }

  _inputCalendarFormHidden(element) {
    element.classList.remove("hidden");
  }

  _calculateDateForPaidLeaves() {
    // Subtract count from current user's days
    this.#userName.days -= this.#count;

    // Update UI
    paidLeavesEl.innerHTML = this.#userName.days;

    // Find the user in the full dataset and update it
    const index = this.#data.findIndex(
      (user) => user.email === this.#userName.email
    );
    if (index !== -1) {
      this.#data[index].days = this.#userName.days;
    }

    // Save updated data to localStorage
    this._addLocalStorage("paid", this.#data);
    //
  }

  _addLocalStorage(dataBase, data) {
    localStorage.setItem(dataBase, JSON.stringify(data));
  }
  _renderHTMLtable(startDate, endDate, count) {
    this.#countRequest++;

    // Format dates as dd.mm.yyyy
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const formattedStart = formatDate(this.#startDate);
    const formattedEnd = formatDate(this.#endDate);

    const html = `<tr>
          <td class="id">${this.#countRequest}</td>
          <td class="date-in">${formattedStart}</td>
          <td class="date-out">${formattedEnd}</td>
          <td class="totalDays">${this.#count} days</td>
          <td>
            <ion-icon name="construct-sharp" class="icon-change"></ion-icon>
            <ion-icon name="close-sharp" class="icon-delete"></ion-icon>
          </td>
        </tr>`;

    tableBodyel.insertAdjacentHTML("beforeend", html);

    const newRequest = new Request(
      this.#countRequest,
      formattedStart,
      formattedEnd,
      this.#count
    );
    this.#listRequests.push(newRequest);
    this._addLocalStorage("request", this.#listRequests);
  }
}

const newApp = new Application();
