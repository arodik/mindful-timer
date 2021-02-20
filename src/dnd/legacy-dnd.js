const doNotDisturb = require("@sindresorhus/do-not-disturb");

class LegacyDndProvider {
    enable() {
        return doNotDisturb.enable();
    }

    disable() {
        return doNotDisturb.disable();
    }
}

module.exports = LegacyDndProvider;
