(() => {
  const events = {
    haldi: { filename: "siddhesh-priyanka-haldi.ics", title: "Siddhesh & Priyanka - Haldi", start: "20261218T100000", end: "20261218T130000" },
    wedding: { filename: "siddhesh-priyanka-wedding.ics", title: "Siddhesh & Priyanka - Wedding & Reception", start: "20261219T100000", end: "20261219T220000" }
  };
  document.querySelectorAll("[data-calendar]").forEach((button) => button.addEventListener("click", () => { const event = events[button.dataset.calendar]; const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Siddhesh and Priyanka//Wedding Invitation//EN", "BEGIN:VEVENT", `UID:${event.filename}@priyankasiddhesh.vercel.app`, `DTSTAMP:${event.start}Z`, `DTSTART;TZID=Asia/Kolkata:${event.start}`, `DTEND;TZID=Asia/Kolkata:${event.end}`, `SUMMARY:${event.title}`, "LOCATION:Kriyan Banquets, Thane West", "END:VEVENT", "END:VCALENDAR"].join("\\r\\n"); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" })); link.download = event.filename; link.click(); URL.revokeObjectURL(link.href); }));
})();
