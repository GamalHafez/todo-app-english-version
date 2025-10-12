import { DarkTheme } from "./scripts/DarkTheme.ts";
import { DomManager } from "./scripts/DomManager.ts";
import { LocalStorageUtils } from "./scripts/LocalStorageUtils.ts";
import { TaskControls } from "./scripts/TaskControls.ts";
import { TaskForm } from "./scripts/TaskForm.ts";

// Ensure keys exist before anything else.
LocalStorageUtils.initializeKey("tasks", []);
LocalStorageUtils.initializeKey("selectedFilter", "none");

TaskControls.updateLeftTasks(); // Static utility call

new TaskForm();
new DomManager();
new TaskControls();
new DarkTheme();
