const {DateTime} = require("luxon");

function startCountdownTimer(timer, durationMinutes, onEvent) {
    const startDate = DateTime.local();

    timer.start({
        startValues: {minutes: durationMinutes},
        countdown: true,
    });

    timer.addEventListener("secondsUpdated", e => {
        onEvent("update", e.detail)
    });
    timer.addEventListener("targetAchieved", e => {
        const endDate = DateTime.local();

        onEvent("finish", {
            startedAt: startDate,
            endedAt: endDate,
            duration: durationMinutes,
            timerEvent: e,
        });
    });
}

module.exports = {
   startCountdownTimer,
};
