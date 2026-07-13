import { describe, it, expect, vi } from "vitest";
import { startCountdownTimer } from "./timer.js";
import { Timer } from "easytimer.js";

describe("startCountdownTimer", () => {
    it("should initialize the timer with correct parameters and listen for events", () => {
        const timer = new Timer();
        const startSpy = vi.spyOn(timer, "start");
        const addListenerSpy = vi.spyOn(timer, "addEventListener");
        const onEvent = vi.fn();

        startCountdownTimer(timer, 25, onEvent);

        // Assert timer started with 25 minutes and countdown: true
        expect(startSpy).toHaveBeenCalledWith({
            startValues: { minutes: 25 },
            countdown: true
        });

        // Assert event listeners were registered
        expect(addListenerSpy).toHaveBeenCalledWith("secondsUpdated", expect.any(Function));
        expect(addListenerSpy).toHaveBeenCalledWith("targetAchieved", expect.any(Function));

        // Clean up spy
        startSpy.mockRestore();
        addListenerSpy.mockRestore();
        timer.stop();
    });
});
