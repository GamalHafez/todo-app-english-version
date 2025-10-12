import { DomManager } from "./DomManager.ts";
import { LocalStorageUtils } from "./LocalStorageUtils.ts";
import type {
  DragEvents,
  GetDragItems,
  HandleDragEvent,
  Task,
  TaskListHandler,
} from "./types.ts";

class DragAndDrop {
  private sourceItem?: HTMLLIElement; // Item being dragged
  private draggedItem?: HTMLLIElement; // Item dropped on
  private tasks: () => Task[];

  constructor() {
    this.tasks = () => LocalStorageUtils.getKey("tasks") as Task[];
    this.attachDragHandlers(this.tasks());
  }

  displayNewOrder = () => {
    const selectedFilter = LocalStorageUtils.getKey("selectedFilter");

    if (selectedFilter) {
      // Try to "click" the filter button again to trigger re-render
      const selectedFilterElement = document.querySelector(
        `[data-filter="${selectedFilter}"]`
      ) as HTMLButtonElement;

      selectedFilterElement.click();
    } else {
      new DomManager();
    }
  };

  domReOrder: VoidFunction = () => {
    const sourceItemId = this.sourceItem?.dataset.id;
    const draggedItemId = this.draggedItem?.dataset.id;
    if (!sourceItemId || !draggedItemId) return;

    LocalStorageUtils.reOrderedTasks(this.tasks(), sourceItemId, draggedItemId);

    this.displayNewOrder();
  };

  // Central handler for all drag events
  handleDragEvent: HandleDragEvent = (dragEvent, event) => {
    switch (dragEvent) {
      case "dragstart":
        this.sourceItem = event.currentTarget as HTMLLIElement;
        this.sourceItem.classList.add("dragging");
        break;
      case "dragend":
        this.sourceItem?.classList.remove("dragging");
        break;
      case "dragover":
        event.preventDefault();
        break;
      case "drop":
        this.draggedItem = event.currentTarget as HTMLLIElement;
        this.domReOrder();
        break;
      default:
        break;
    }
  };

  // Attach the four drag events to a single task element
  attachDragEvents: GetDragItems = (taskElement) => {
    const dragEvents: DragEvents[] = [
      "dragstart",
      "dragend",
      "dragover",
      "drop",
    ];
    if (!taskElement) return;

    // attach the four dragEvents to the task element:
    dragEvents.forEach((dragEvent) =>
      taskElement.addEventListener(dragEvent, (event: DragEvent) =>
        this.handleDragEvent(dragEvent, event)
      )
    );
  };

  // Attach drag handlers to all tasks in the list
  attachDragHandlers: TaskListHandler = (tasks) => {
    if (!tasks.length) return;

    tasks.forEach((task) => {
      const taskElement = document.querySelector(
        `[data-id="${task.id}"]`
      ) as HTMLLIElement;

      this.attachDragEvents(taskElement);
    });
  };
}

export { DragAndDrop };
