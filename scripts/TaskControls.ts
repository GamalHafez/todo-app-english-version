import { DomManager } from "./DomManager.ts";
import { LocalStorageUtils } from "./LocalStorageUtils.ts";
import type {
  ButtonAction,
  SwitchOnFilters,
  TaskFilters,
  VoidFunction,
} from "./types.ts";

class TaskControls {
  constructor() {
    this.filterButtonsListener();
    this.checkSelectedFilter();
    this.clearCompletedButtonListener();
  }

  static updateLeftTasks: VoidFunction = () => {
    const leftTasksElement = document.querySelector(
      ".controls__left-number"
    ) as HTMLSpanElement;

    let leftTasks = LocalStorageUtils.getLeftTasksCount();
    leftTasksElement.textContent = leftTasks?.toString() || "0";
  };

  checkSelectedFilter: VoidFunction = () => {
    const selectedFilter = LocalStorageUtils.getKey("selectedFilter");
    const selectedFilterButton = document.querySelector(
      `[data-filter="${selectedFilter}"]`
    ) as HTMLButtonElement;

    selectedFilterButton?.click();
  };

  applyClickedStyle: ButtonAction = (element) => {
    // Remove Previous Clicked
    const previousClicked = document.querySelector(".active-button");
    if (previousClicked) previousClicked.classList.remove("active-button");

    element.classList.add("active-button");
  };

  // Static: Apply filters (all, active, completed)
  static switchOnFilters: SwitchOnFilters = (switchKey) => {
    switch (switchKey) {
      case "all":
        new DomManager();
        break;
      case "active": {
        const activeTasks = LocalStorageUtils.getFilteredTasks("active");
        new DomManager(activeTasks);
        break;
      }
      case "completed": {
        const completedTasks = LocalStorageUtils.getFilteredTasks("completed");
        new DomManager(completedTasks);
        break;
      }
      default:
        new DomManager();
        break;
    }
  };

  filterButtonsListener: VoidFunction = () => {
    const filterButtons = document.querySelectorAll(
      "[data-filter]"
    ) as NodeListOf<HTMLButtonElement>;

    filterButtons?.forEach((button) => {
      button.addEventListener("click", () => {
        // shared code
        this.applyClickedStyle(button);

        // Update and Save selectedFilter key in LocalStorage
        LocalStorageUtils.setKey(
          "selectedFilter",
          button?.dataset.filter as TaskFilters
        );

        // specific code separately
        TaskControls.switchOnFilters(button.dataset.filter as TaskFilters);
      });
    });
  };

  clearCompletedConfirm: ButtonAction = (clearCompletedButton) => {
    clearCompletedButton.textContent = "Click again to clear"; // First click → warn the user

    // Temporary handler for the second click
    const confirmHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLButtonElement &&
        target.classList.contains("controls__clear")
      ) {
        LocalStorageUtils.removeCompletedTasks();

        clearCompletedButton.textContent = "Clear Completed"; // Reset button text
        clearCompletedButton.classList.remove("active-button");
        new DomManager();

        // Remove this temporary handler so it doesn't stack up
        clearCompletedButton.removeEventListener("click", confirmHandler);
      }
    };

    clearCompletedButton.addEventListener("click", confirmHandler);
  };

  clearCompletedButtonListener: VoidFunction = () => {
    const clearCompletedButton = document.querySelector(
      ".controls__clear"
    ) as HTMLButtonElement;

    clearCompletedButton.addEventListener("click", () => {
      this.applyClickedStyle(clearCompletedButton);

      LocalStorageUtils.setKey("selectedFilter", "none"); // Clear Any Previous filters selection

      const completedTasks = LocalStorageUtils.getFilteredTasks("completed");
      new DomManager(completedTasks);

      // Ask for confirmation if there's completed tasks
      if (!completedTasks?.length) return;
      this.clearCompletedConfirm(clearCompletedButton);
    });
  };
}

export { TaskControls };
