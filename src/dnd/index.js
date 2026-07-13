import os from "os";
import {DummyDnDProvider} from "./DummyDnD.js";
import {ShortcutsMontereyFocusMode} from "./ShortcutsMontereyFocusMode.js";

function isMontereyOrNewer() {
    const major = parseInt(os.release().split(".")[0], 10);
    return major >= 21;
}

export function getDndProvider() {
    if (isMontereyOrNewer()) {
        return new ShortcutsMontereyFocusMode();
    }

    console.log("Please upgrade MacOS to Monterey to use the Do Not Disturb mode");
    return new DummyDnDProvider();
}
