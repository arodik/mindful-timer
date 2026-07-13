import { Argv } from "yargs";

export interface Command {
    signature: string;
    description: string;
    configure: (yargs: Argv<any>) => any;
    run: (argv: any) => Promise<void> | void;
}

export interface TimerSessionData {
    id: string;
    name?: string;
    startTs: number;
    interruptTs: number | null;
    duration: number;
    finished: boolean;
    tags?: string[];
}

export interface SessionInitData {
    name?: string;
    tags?: string[];
    size: number;
}

export interface DndProvider {
    enable(): void;
    disable(): void;
}
