import {DateTime} from "luxon";
import {Timer} from "easytimer.js";

export function startCountdownTimer(
    timer: Timer,
    durationMinutes: number,
    onEvent: (eventName: "update" | "finish", eventData: any) => void
): void {
    const startDate = DateTime.local();

    timer.start({
        startValues: {minutes: durationMinutes},
        countdown: true,
    });

    timer.addEventListener("secondsUpdated", (e: any) => {
        onEvent("update", e.detail);
    });
    timer.addEventListener("targetAchieved", (e: any) => {
        const endDate = DateTime.local();

        onEvent("finish", {
            startedAt: startDate,
            endedAt: endDate,
            duration: durationMinutes,
            timerEvent: e,
        });
    });
}
