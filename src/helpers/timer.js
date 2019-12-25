function startCountdownTimer(timer, durationMinutes, onEvent) {
    timer.start({
        startValues: {minutes: durationMinutes},
        countdown: true,
    });

    timer.addEventListener("secondsUpdated", async (e) => await onEvent("update", e.detail));
    timer.addEventListener("targetAchieved", async (e) => await onEvent("finish", e.detail));
}

module.exports = {
   startCountdownTimer,
};
