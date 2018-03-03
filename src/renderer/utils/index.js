const formatTime = (time) => {
  // 时间为 2017-02-13 样式
  if (!time) return 0;
  if (time.toString().indexOf('-') > -1) {
    time = Date.parse(time);
  } else if (Number(time) !== Number(time)) {
    // 时间无法转化成数字
    return time;
  }
  // 将时间单位转化为 s
  const parseTime = parseInt(time, 10) < Date.now() / 1000
    ? parseInt(time, 10)
    : Math.floor(parseInt(time, 10) / 1000);

  if (parseTime !== parseTime) {
    return time;
  }

  const now = Date.now();
  // 计算过去的时间
  const past = Math.floor((now / 1000) - parseTime);

  switch (true) {
    case past < 3600: {
      const t = Math.floor(past / 60, 10);
      return `${t !== 0 ? t : t + 1} 分钟前`;
    }
    case past < 86400: {
      const t = Math.floor(past / 3600, 10);
      return `${t !== 0 ? t : t + 1} 小时前`;
    }
    default: {
      const t = Math.floor(past / 86400, 10);
      return `${t !== 0 ? t : t + 1} 天前`;
    }
  }
};

export default {
  formatTime
};

