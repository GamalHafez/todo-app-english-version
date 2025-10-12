import { LocalStorageUtils } from "./LocalStorageUtils.ts";
import type { PopUpAppearance, TaskIdAction } from "./types.ts";

class DeletePopUp {
  private taskContent: HTMLDivElement;
  private popUpBox: HTMLDivElement;

  constructor(id: string, popUpAppearance: boolean) {
    this.taskContent = document.querySelector(
      `[data-id="${id}"] .tasks__content`
    ) as HTMLDivElement;

    this.popUpBox = document.querySelector(
      `[data-popup="${id}"]`
    ) as HTMLDivElement;

    this.updateStatusText(id);
    this.popUpAppearance(popUpAppearance);
  }

  updateStatusText: TaskIdAction = (id) => {
    const popUpStatus = document.querySelector(
      `[data-popup="${id}"] .delete-popup__status`
    ) as HTMLSpanElement;

    const status = LocalStorageUtils.getDoneStatus(id);
    switch (status) {
      case false:
        popUpStatus.textContent = "Uncompleted Task";
        break;
      case true:
        popUpStatus.textContent = "Completed Task";
        break;
      default:
        break;
    }
  };

  popUpAppearance: PopUpAppearance = (appearanceState) => {
    this.taskContent.classList.toggle("delete-popup--active", appearanceState);
    this.popUpBox.classList.toggle("delete-popup--active", appearanceState);
  };
}

export { DeletePopUp };
