import type {
  AddTask,
  ChangeDoneStatus,
  GetDoneStatus,
  GetFilteredTasks,
  GetKey,
  GetLeftTasksCount,
  ReOrderedTasks,
  InitializeKey,
  IsTaskRepeated,
  SetKey,
  TaskIdAction,
} from "./types.ts";

class LocalStorageUtils {
  static getKey: GetKey = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  static setKey: SetKey = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  static initializeKey: InitializeKey = (key, defaultValue) => {
    if (LocalStorageUtils.getKey(key) === null) {
      LocalStorageUtils.setKey(key, defaultValue);
    }
  };

  static addTask: AddTask = (text, id) => {
    const tasks = LocalStorageUtils.getKey("tasks");
    tasks?.push({
      id,
      text,
      done: false,
    });
    tasks && LocalStorageUtils.setKey("tasks", tasks);
  };

  static changeDoneStatus: ChangeDoneStatus = (id, newStatus) => {
    const tasks = LocalStorageUtils.getKey("tasks");
    if (!tasks) return;

    const fixedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: newStatus } : task
    );

    LocalStorageUtils.setKey("tasks", fixedTasks);
  };

  static isTaskRepeated: IsTaskRepeated = (text) => {
    const tasks = LocalStorageUtils.getKey("tasks");
    return tasks?.find((task) => task.text === text);
  };

  static removeTask: TaskIdAction = (id) => {
    let tasks = LocalStorageUtils.getKey("tasks");
    const taskIndexToDelete = tasks?.findIndex((task) => task.id === id);
    if (taskIndexToDelete === undefined || taskIndexToDelete < 0) return;

    tasks?.splice(taskIndexToDelete, 1);
    tasks && LocalStorageUtils.setKey("tasks", tasks);
  };

  static getDoneStatus: GetDoneStatus = (id) => {
    const tasks = LocalStorageUtils.getKey("tasks");
    return tasks?.find((task) => task.id === id)?.done;
  };

  static getLeftTasksCount: GetLeftTasksCount = () => {
    const tasks = LocalStorageUtils.getKey("tasks");
    return tasks?.filter((task) => !task.done).length;
  };

  static getFilteredTasks: GetFilteredTasks = (filterBy) => {
    const tasks = LocalStorageUtils.getKey("tasks");

    switch (filterBy) {
      case "active":
        return tasks?.filter((task) => !task.done);
      case "completed":
        return tasks?.filter((task) => task.done);
      default:
        break;
    }
  };

  static removeCompletedTasks: VoidFunction = () => {
    const activeTasks = LocalStorageUtils.getFilteredTasks("active");
    if (!activeTasks) return;

    LocalStorageUtils.setKey("tasks", activeTasks);
  };

  static reOrderedTasks: ReOrderedTasks = (
    tasks,
    sourceItemId,
    draggedItemId
  ) => {
    const sourceItem = tasks.find((task) => task.id === sourceItemId);
    const draggedItem = tasks.find((task) => task.id === draggedItemId);
    if (!sourceItem || !draggedItem) return;

    const sourceItemIndex = tasks.indexOf(sourceItem);
    const draggedItemIndex = tasks.indexOf(draggedItem);

    tasks[sourceItemIndex] = draggedItem;
    tasks[draggedItemIndex] = sourceItem;

    LocalStorageUtils.setKey("tasks", tasks);
  };
}

export { LocalStorageUtils };
