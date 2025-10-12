import type { DisplayError, Errors } from "./types.ts";

class ErrorsManager {
  private errorElement: HTMLParagraphElement;
  private readonly errors: Errors;

  constructor() {
    this.errorElement = document.querySelector(
      ".error"
    ) as HTMLParagraphElement;

    if (!this.errorElement) {
      throw new Error("Error element not found in DOM");
    }

    // Map of all possible error messages
    this.errors = {
      // When adding new error messages here, also update the `Errors` type

      emptyTask: "Please enter a task.",
      repeatedTask: "This task already exists.",
      noError: "",
    };
  }

  displayError: DisplayError = (errorType) => {
    if (errorType === "noError") {
      // Hide error if no error
      this.errorElement.classList.remove("error-active");
    } else {
      this.errorElement.classList.add("error-active");
    }
    this.errorElement.textContent = this.errors[errorType];
  };
}

export { ErrorsManager };
