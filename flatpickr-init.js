flatpickr("#appointment_date", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
  minTime: "09:00",
  maxTime: "17:00",
  time_24hr: true,
  defaultDate: "today",
  minuteIncrement: 60,
  locale: {
    firstDayOfWeek: 1, // Monday
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
    ordinal: function (nth) {
      if (nth > 3 && nth < 21) return "th";
      switch (nth % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
    rangeSeparator: " 至 ",
    weekAbbreviation: "周",
    scrollTitle: "滚动切换",
    toggleTitle: "点击切换 12/24 小时时制",
  },
});
