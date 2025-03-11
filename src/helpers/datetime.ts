function now(type?: string) {
    return type !== "unix" ? new Date() : Date.now;
  }
  
  function getDaysBetweenDates(date1: Date, date2: Date): number {
    const oneDay: number = 1000 * 60 * 60 * 24; // Milliseconds in one day
    const timeDiff: number = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / oneDay);
  }
  function getTimeString(date: Date): string {
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const seconds: number = date.getSeconds();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  function getShortDateString(date: Date): string {
    return date.toDateString();
  }
  function getISODateString(date: Date): string {
    return date.toISOString();
  }
  
  function subtractOneDay(dates: Date): string {
    let date = new Date(dates);
    date.setDate(date.getDate() - 1);
  
    // Get the date components
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let seconds = String(date.getSeconds()).padStart(2, "0");
  
    // Return the formatted date string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  export default {
    now,
    getDaysBetweenDates,
    getTimeString,
    getShortDateString,
    getISODateString,
    subtractOneDay,
  };
  