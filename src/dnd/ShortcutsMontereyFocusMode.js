import {
    disableFocusMode,
    enableFocusMode,
    installFocusModeShortcut,
    isFocusModeShortcutInstalled
} from "macos-focus-mode";
import dialog from "dialog";

export class ShortcutsMontereyFocusMode {
    ensurePackageIsInstalled() {
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

    enable() {
        this.ensurePackageIsInstalled();
        enableFocusMode();
    }

    disable() {
        this.ensurePackageIsInstalled();
        disableFocusMode();
    }
}
