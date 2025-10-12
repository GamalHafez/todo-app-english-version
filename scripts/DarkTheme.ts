import { LocalStorageUtils } from "./LocalStorageUtils.ts";

class DarkTheme {
  private themeInput: HTMLInputElement;
  private themeLabel: HTMLLabelElement;

  constructor() {
    this.themeInput = document.querySelector(
      ".theme-switcher__input"
    ) as HTMLInputElement;

    this.themeLabel = document.querySelector(
      ".theme-switcher__label"
    ) as HTMLLabelElement;

    // Ensure storage key exists before usage
    LocalStorageUtils.initializeKey("darkTheme", false);

    this.checkStoragedStatus();
    this.themeStatusListener();
    this.themeAccessibility();
  }

  themeStatusListener() {
    this.themeInput.addEventListener("change", () => {
      LocalStorageUtils.setKey("darkTheme", this.themeInput.checked);
      this.checkStoragedStatus();
    });
  }

  checkStoragedStatus() {
    this.themeInput.checked = LocalStorageUtils.getKey("darkTheme") ?? false;
    document.documentElement.classList.toggle(
      "dark-on",
      this.themeInput.checked
    );
  }

  themeAccessibility() {
    this.themeLabel.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") this.themeLabel.click();
    });
  }
}

export { DarkTheme };
