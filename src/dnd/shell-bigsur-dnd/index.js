const util = require('util');
const path = require('path');
const execFile = util.promisify(require('child_process').execFile);

const execShellScript = filename => execFile(path.resolve(__dirname, filename));

class ShellBigsurDndProvider {
    async enable() {
        if (await this._isDnDEnabled()) {
            return;
        }
        return execShellScript('./enable.sh');
    }

    async disable() {
        if (!await this._isDnDEnabled()) {
            return;
        }
        return execShellScript('./disable.sh');
    }

    async _isDnDEnabled() {
        const { stdout } = await execShellScript('./check.sh');
        return stdout === 'true';
    }
}

module.exports = ShellBigsurDndProvider;
