const os = require('os');
const semverParse = require('semver/functions/parse');
const LegacyDndProvider = require("./legacy-dnd");
const ShellBigSurDndProvider = require("./shell-bigsur-dnd");

function isBigSurOrNewer() {
    const { major } = semverParse(os.release())
    return major >= 20;
}

function getDndProvider() {
    if (isBigSurOrNewer()) {
        return new ShellBigSurDndProvider();
    }

    return new LegacyDndProvider();
}

module.exports = {
    getDndProvider,
}
