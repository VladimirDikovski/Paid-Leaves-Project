class PaidLeaves {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.days = 22;
  }
}

const bodyEl = document.querySelector("body");
const formContainerEl = document.querySelector(".form-container");
const labelRequired = document.querySelectorAll(".required");
const inputForm = document.querySelectorAll(".input-form");
const btnEl = document.querySelector(".btn-submit");
const validationMessagesel = document.querySelector(".error-status ");

const [input1, input2] = inputForm;

class Application {
  #objectArrays = [];

  constructor() {
    btnEl.addEventListener("click", this._btnSubmit.bind(this));
    this._getDataLocalStorage();
  }

  _btnSubmit(e) {
    e.preventDefault();
    let input1ToLower = input1.value.toLowerCase();

    // Hide required labels if both fields are empty
    if (input1.value === "" || input2.value === "") {
      this._AddDisplayProperry("inline-block");
      this._AddValidationMessages("Fields should not be empty");
    } else {
      // Check if email already exists
      const isItIn = this.#objectArrays.find(
        (obj) => obj.email === input1.value
      );
      if (isItIn)
        return this._AddValidationMessagesl(
          "This email is already registered!"
        );

      // Validate email format using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input1.value)) {
        return this.AddValidationMessages(
          "Please enter a valid email address."
        );
      }

      // Password Validation
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
      if (!passwordRegex.test(input2.value)) {
        return this._AddValidationMessages(
          "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
        );
      }

      // Proceed to create a new user if validation is successful
      const newPerson = new PaidLeaves(input1.value, input2.value);
      this.#objectArrays.push(newPerson);
      this._addLocalStorage();
      this._clearFields(input1, input2);
      this._AddDisplayProperry("none");
      validationMessagesel.style.color = "green";
      this._AddValidationMessages("You have successfully registered!");
    }
  }

  _clearFields(input1, input2) {
    input1.value = "";
    input2.value = "";
  }

  _addLocalStorage() {
    localStorage.setItem("paid", JSON.stringify(this.#objectArrays));
  }

  _getDataLocalStorage() {
    this.#objectArrays = JSON.parse(localStorage.getItem("paid"));
    if (!this.#objectArrays) {
      this.#objectArrays = [];
    }
  }

  _AddDisplayProperry(display) {
    labelRequired.forEach((label) => (label.style.display = display));
  }

  _AddValidationMessages(messages) {
    validationMessagesel.style.opacity = "1";
    validationMessagesel.innerHTML = messages;
  }
}

const newApplication = new Application();
