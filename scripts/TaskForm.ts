import { DomManager } from "./DomManager.ts";
import { ErrorsManager } from "./ErrorsManager.ts";
import { LocalStorageUtils } from "./LocalStorageUtils.ts";
import { TaskControls } from "./TaskControls.ts";
import type { ErrorsCheck, UniqueId } from "./types.ts";

class TaskForm {
  private errorsManager: ErrorsManager;
  private form: HTMLFormElement;
  private formInput: HTMLInputElement;

  constructor() {
    this.errorsManager = new ErrorsManager();
    this.form = document.querySelector(".todo-form") as HTMLFormElement;
    this.formInput = document.querySelector(
      ".todo-form__input"
    ) as HTMLInputElement;

    this.formEventListener();
  }

  // Validate task input: returns true if there's an error
  errorsCheck: ErrorsCheck = (task) => {
    if (!task) {
      this.errorsManager.displayError("emptyTask");
      return true;
    } else if (LocalStorageUtils.isTaskRepeated(task)) {
      this.errorsManager.displayError("repeatedTask");
      return true;
    }

    this.errorsManager.displayError("noError");
    return false;
  };

  uniqueId: UniqueId = () => crypto.randomUUID();

  formEventListener() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      const task = this.formInput.value;

      if (!this.errorsCheck(task)) {
        LocalStorageUtils.addTask(task, this.uniqueId());

        new DomManager(); // Re-render tasks
        TaskControls.updateLeftTasks();
        this.formInput.value = "";
      }
    });

    // Clear errors while typing
    this.formInput.addEventListener("input", () => {
      this.errorsManager.displayError("noError");
    });
  }
}

export { TaskForm };
