import os from "os";
import semverParse from "semver/functions/parse.js";
import {DummyDnDProvider} from "./DummyDnD.js";
import {ShortcutsMontereyFocusMode} from "./ShortcutsMontereyFocusMode.js";

function isMontereyOrNewer() {
    const { major } = semverParse(os.release())
    return major >= 21;
}

export function getDndProvider() {
    if (isMontereyOrNewer()) {
        return new ShortcutsMontereyFocusMode();
    }

    console.log("Please upgrade MacOS to Monterey to use the Do Not Disturb mode");
    return new DummyDnDProvider();
}
