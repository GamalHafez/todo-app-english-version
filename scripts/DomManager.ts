import { DeletePopUp } from "./DeletePopUp.ts";
import { DragAndDrop } from "./DragAndDrop.ts";
import { LocalStorageUtils } from "./LocalStorageUtils.ts";
import { TaskControls } from "./TaskControls.ts";
import type {
  CreateNewTaskElement,
  GetTaskCheckBox,
  KeyDownListener,
  Task,
  TaskListHandler,
} from "./types.ts";

class DomManager {
  private tasksContainer: HTMLUListElement;

  constructor(tasks?: Task[]) {
    this.tasksContainer = document.querySelector(".tasks") as HTMLUListElement;

    // Load tasks: either from LocalStorage or from provided array (e.g., filters)
    let tasksArray = LocalStorageUtils.getKey("tasks") ?? [];
    if (tasks) tasksArray = tasks;

    // Render tasks + enable drag and drop
    this.addTasksToDom(tasksArray);
    new DragAndDrop();
  }

  // Generate the HTML structure for a single task
  createNewTaskElement: CreateNewTaskElement = (task, id) => {
    return `       
        <li class="tasks__task" data-id="${id}" draggable="true">
          <div class="tasks__content">
            <div class="tasks__toggle">
              <input
                class="tasks__checkbox"
                type="checkbox"
                name="task-${id}"
                id="task-${id}"
              />
              <label role="button" tabindex="0" class="tasks__circle" for="task-${id}"></label>
              <label role="button" tabindex="0" class="tasks__text" for="task-${id}">${task}</label>
            </div>
            <button class="button tasks__delete" aria-label="Delete task">
              <img src="./images/icon-cross.svg" alt="" />
            </button>
          </div>

          <div class="delete-popup" data-popup="${id}">
            <p class="delete-popup__message">
              Are you sure you want to delete this task?
            </p>
            <div class="delete-popup__content">
              <p>
                <span class="delete-popup__task">${task}</span>
                <span class="delete-popup__status"></span>
              </p>
              <div class="delete-popup__buttons">
                <button class="button delete-popup__clear">Yes</button>
                <button class="button delete-popup__cancel">No</button>
              </div>
            </div>
          </div>
        </li>
        `;
  };

  // Restore the "done" status of tasks when rendering (based on LocalStorage)
  watchTaskDoneStatus: TaskListHandler = (tasks) => {
    tasks.forEach((task) => {
      const taskCheckBox = this.getTaskCheckBox(task.id);
      taskCheckBox.checked = task.done;
    });
  };

  checkEmptyTasks: TaskListHandler = (tasks) => {
    const emptyMessageElement = document.querySelector(
      ".empty-tasks"
    ) as HTMLParagraphElement;

    const emptyMessage = "This space is empty — for now.";
    emptyMessageElement.textContent = !tasks.length ? emptyMessage : "";
  };

  // Main renderer → adds tasks into DOM and wires up event listeners
  addTasksToDom: TaskListHandler = (tasks) => {
    this.tasksContainer.innerHTML = "";
    this.checkEmptyTasks(tasks);

    let tasksElementStrings: string[] = [];

    tasks.forEach((task) => {
      const newElement = this.createNewTaskElement(task.text, task.id);
      tasksElementStrings.push(newElement);
    });

    this.tasksContainer.insertAdjacentHTML(
      "beforeend",
      tasksElementStrings.join("")
    );

    this.watchTaskDoneStatus(tasks); // Chnage done tasks based on local storage data
    TaskControls.updateLeftTasks();

    // Attach event listeners to the new tasks
    this.tasksCheckBoxListener(tasks);

    this.deleteButtonListener(tasks);
    this.popUpConfirmButtonListener(tasks);
    this.popUpCancelButtonListener(tasks);
    this.tasksAccessibility(tasks);
  };

  getTaskCheckBox: GetTaskCheckBox = (id) => {
    return document.querySelector(`[name="task-${id}"]`) as HTMLInputElement;
  };

  updateTasksBasedOnFilter: VoidFunction = () => {
    const selectedFilter = LocalStorageUtils.getKey("selectedFilter");
    if (!selectedFilter) return;
    TaskControls.switchOnFilters(selectedFilter);
  };

  tasksCheckBoxListener: TaskListHandler = (tasks) => {
    tasks.forEach((task) => {
      const taskCheckBox = this.getTaskCheckBox(task.id);

      taskCheckBox?.addEventListener("change", () => {
        LocalStorageUtils.changeDoneStatus(task.id, taskCheckBox.checked);
        this.updateTasksBasedOnFilter();
      });
    });
  };

  keyDownListener: KeyDownListener = (element) => {
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") element.click();
    });
  };

  tasksAccessibility: TaskListHandler = (tasks) => {
    tasks.forEach((task) => {
      const taskLabels = document.querySelectorAll(
        `[for="task-${task.id}"]`
      ) as NodeListOf<HTMLLabelElement>;

      taskLabels.forEach(this.keyDownListener);
    });
  };

  deleteButtonListener: TaskListHandler = (tasks) => {
    tasks.forEach((task) => {
      const taskDeleteButton = document.querySelector(
        `[data-id="${task.id}"] .tasks__delete`
      ) as HTMLButtonElement;

      taskDeleteButton?.addEventListener(
        "click",
        () => new DeletePopUp(task.id, true)
      );

      taskDeleteButton?.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
          taskDeleteButton.style.opacity = "1";
        }
      });
    });
  };

  popUpConfirmButtonListener: TaskListHandler = (tasks) => {
    tasks.forEach((task) => {
      const taskConfirmButton = document.querySelector(
        `[data-popup="${task.id}"] .delete-popup__clear`
      ) as HTMLButtonElement;

      taskConfirmButton.addEventListener("click", () => {
        LocalStorageUtils.removeTask(task.id);

        // Update DOM after delete the task:
        this.updateTasksBasedOnFilter();

        TaskControls.updateLeftTasks();
      });
    });
  };

  popUpCancelButtonListener: TaskListHandler = (tasks) => {
    tasks.forEach((task) => {
      const taskCancelButton = document.querySelector(
        `[data-popup="${task.id}"] .delete-popup__cancel`
      ) as HTMLButtonElement;

      taskCancelButton.addEventListener(
        "click",
        () => new DeletePopUp(task.id, false)
      );
    });
  };
}

export { DomManager };
