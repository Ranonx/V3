const fp = flatpickr("#appointment_date", {
  enableTime: true,
  minTime: "09:00",
  maxTime: "17:00",
  time_24hr: true,
  dateFormat: "Y-m-d H:i",
  defaultDate: "today",
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ["日", "一", "二", "三", "四", "五", "六"],
      longhand: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
    },
    months: {
      shorthand: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
      longhand: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
    },
  },
});