export function clearLineAndWrite(text: string): void {
    if (process.stdout.clearLine) {
        process.stdout.clearLine(0); // clearLine in @types/node requires direction (0 for entire line, etc.)
    } else {
        process.stdout.write("\r");
    }
    if (process.stdout.cursorTo) {
        process.stdout.cursorTo(0);
    }
    process.stdout.write(text);
}
