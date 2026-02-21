const examTimeFormatter = (sec: number) => {
    const totalMinutes = Math.floor(sec / 60);

    if (totalMinutes <= 60) {
        // Less than 1 hour → show only minutes
        return `${totalMinutes} Min`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Show H:M format
    return `${hours}H ${minutes.toString().padStart(2, "0")}M`;
};

export default examTimeFormatter;