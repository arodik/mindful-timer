declare module "macos-focus-mode" {
    export function enableFocusMode(): void;
    export function disableFocusMode(): void;
    export function installFocusModeShortcut(): void;
    export function isFocusModeShortcutInstalled(): boolean;
}

declare module "dialog" {
    const dialog: {
        info(message: string, title?: string, callback?: (err: any) => void): void;
        warn(message: string, title?: string, callback?: (err: any) => void): void;
        err(message: string, title?: string, callback?: (err: any) => void): void;
    };
    export default dialog;
}
