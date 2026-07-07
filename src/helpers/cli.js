export function clearLineAndWrite(text) {
    if (process.stdout.clearLine) {
        process.stdout.clearLine();
    } else {
        process.stdout.write("\r");
    }
    if (process.stdout.cursorTo) {
        process.stdout.cursorTo(0);
    }
    process.stdout.write(text);
}
