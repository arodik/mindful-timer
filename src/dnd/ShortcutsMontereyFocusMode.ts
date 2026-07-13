import {
    disableFocusMode,
    enableFocusMode,
    installFocusModeShortcut,
    isFocusModeShortcutInstalled
} from "macos-focus-mode";
import dialog from "dialog";
import { DndProvider } from "../types.js";

export class ShortcutsMontereyFocusMode implements DndProvider {
    ensurePackageIsInstalled(): void {
        if (isFocusModeShortcutInstalled()) {
            return;
        }

        const installMessage = "You'll be prompted to install the macOS shortcut.\n" +
            "We need it to manage the focus state (Do not disturb).\n\n" +
            "Re-run the command when the installation is finished to start the timer";

        dialog.info(installMessage, "Mindful Timer shortcut installation");
        console.info(installMessage);

        installFocusModeShortcut();
        process.exit(0);
    }

    enable(): void {
        this.ensurePackageIsInstalled();
        enableFocusMode();
    }

    disable(): void {
        this.ensurePackageIsInstalled();
        disableFocusMode();
    }
}
