import {disableFocusMode, enableFocusMode} from "macos-focus-mode";

export class ShortcutsMontereyFocusMode {
    enable() {
        enableFocusMode();
    }

    disable() {
        disableFocusMode();
    }
}
