// Common Function Types
export type TaskListHandler = (tasks: Task[]) => void;
export type VoidFunction = () => void;

// Task Types
export interface Task {
  id: string;
  text: string;
  done: boolean;
}

// Local Storage Types
export type TaskFilters = "all" | "active" | "completed" | "none" | undefined;

type LocalData = {
  darkTheme: boolean;
  tasks: Task[];
  selectedFilter: TaskFilters;
};

export type StorageKey = keyof LocalData;

export type GetKey = <K extends StorageKey>(key: K) => LocalData[K] | null;

export type SetKey = <K extends StorageKey>(
  key: K,
  value: LocalData[K]
) => void;

export type InitializeKey = <K extends StorageKey>(
  key: K,
  defaultValue: LocalData[K]
) => void;

export type AddTask = (text: string, id: string) => void;
export type ChangeDoneStatus = (id: string, newStatus: boolean) => void;
export type IsTaskRepeated = (text: string) => Task | undefined;
export type TaskIdAction = (id: string) => void;
export type GetDoneStatus = (id: string) => boolean | undefined;
export type GetLeftTasksCount = () => number | undefined;
export type GetActiveTasks = () => Task[] | boolean;
export type GetFilteredTasks = (
  filterBy: "active" | "completed"
) => Task[] | undefined;
export type ReOrderedTasks = (
  tasks: Task[],
  sourceItemId: string,
  draggedItemId: string
) => void;

// Error Handling Types
export type Errors = {
  emptyTask: string;
  noError: string;
  repeatedTask: string;
};

export type DisplayError = (errorType: keyof Errors) => void;

// DomManager Types
export type CreateNewTaskElement = (task: string, id: string) => string;
export type GetTaskCheckBox = (id: string) => HTMLInputElement;
export type PopUpAppearance = (appearanceState: boolean) => void;
export type KeyDownListener = (element: HTMLLabelElement) => void;

// TaskForm Types
export type UniqueId = () => string;
export type ErrorsCheck = (task: string) => boolean;

// Task Controls
export type SwitchOnFilters = (switchKey: TaskFilters) => void;
export type ButtonAction = (button: HTMLButtonElement) => void;

// DragAndDrop
export type GetDragItems = (taskElement: HTMLLIElement) => void;
export type DragEvents = "dragstart" | "dragend" | "dragover" | "drop";

export type HandleDragEvent = (dragEvent: DragEvents, event: DragEvent) => void;
