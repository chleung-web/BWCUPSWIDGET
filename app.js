const WEEKDAY_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_ZH = ["", "第一日", "第二日", "第三日", "第四日", "第五日", "第六日", "第七日"];

const params = new URLSearchParams(location.search);
const dateOverride = params.get("date"); // YYYY-MM-DD

let cycleByDate = new Map();

const SPECIAL_DAYS = {
  "2026-09-01": "開學日／學生開學禮 · Opening day",
  "2026-09-02": "半天上課 · Half-day school",
  "2026-09-03": "半天上課 · Half-day school",
  "2026-09-04": "半天上課／家長開學禮 · Half-day school",
  "2026-09-18": "九月例會（學生仍上課） · Staff meeting",
  "2026-09-25": "中秋活動（半天上課） · Mid-Autumn activity",
  "2026-10-02": "教師專業發展日 · Teacher PD (no lessons)",
  "2026-11-12": "第一次校內評估 · Assessment",
  "2026-11-13": "第一次校內評估 · Assessment",
  "2026-11-16": "第一次校內評估 · Assessment",
  "2026-11-17": "第一次校內評估 · Assessment",
  "2026-11-27": "學校旅行日 · School picnic",
  "2026-12-02": "教師專業發展日 · Teacher PD (no lessons)",
  "2026-12-06": "親子旅行日 · Family picnic",
  "2026-12-17": "音樂日及新年聯歡 · Music day",
  "2026-12-18": "第一次家長日 · Parents’ day",
  "2027-02-04": "中華文化日 · Chinese Culture Day",
  "2027-03-04": "第二次校內評估 · Assessment",
  "2027-03-05": "第二次校內評估 · Assessment",
  "2027-03-08": "第二次校內評估 · Assessment",
  "2027-03-09": "第二次校內評估 · Assessment",
  "2027-03-22": "校運會 · Sports day",
  "2027-03-24": "全方位學習周 · OLE week",
  "2027-03-25": "全方位學習周 · OLE week",
  "2027-03-30": "全方位學習周 · OLE week",
  "2027-03-31": "全方位學習周 · OLE week",
  "2027-04-01": "全方位學習周 · OLE week",
  "2027-04-09": "教師專業發展日 · Teacher PD (no lessons)",
  "2027-04-23": "第二次家長日 · Parents’ day",
  "2027-06-03": "第三次校內評估 · Assessment",
  "2027-06-04": "第三次校內評估 · Assessment",
  "2027-06-07": "第三次校內評估 · Assessment",
  "2027-06-08": "第三次校內評估 · Assessment",
  "2027-06-14": "TSA 紙筆評估 · TSA",
  "2027-06-15": "TSA 紙筆評估 · TSA",
  "2027-06-24": "試後活動（半天上課） · Post-exam activity",
  "2027-06-25": "試後活動（半天上課） · Post-exam activity",
  "2027-06-28": "試後活動（半天上課） · Post-exam activity",
  "2027-06-29": "試後活動（半天上課） · Post-exam activity",
  "2027-06-30": "試後活動（半天上課） · Post-exam activity",
  "2027-07-02": "試後活動（半天上課） · Post-exam activity",
  "2027-07-03": "試後活動（半天上課） · Post-exam activity",
  "2027-07-05": "試後活動（半天上課） · Post-exam activity",
  "2027-07-06": "試後活動（半天上課） · Post-exam activity",
  "2027-07-07": "試後活動（半天上課） · Post-exam activity",
  "2027-07-08": "試後活動（半天上課） · Post-exam activity",
  "2027-07-09": "結業禮 · Closing ceremony",
  "2027-07-12": "最後上課日 · Last school day"
};

const NAMED_HOLIDAYS = {
  "2026-09-26": "中秋節翌日 · Day after Mid-Autumn",
  "2026-10-01": "國慶日 · National Day",
  "2026-10-19": "重陽節翌日 · Day after Chung Yeung",
  "2026-12-07": "旅行翌日假期 · Day after picnic",
  "2026-12-21": "聖誕新年假期 · Christmas / New Year",
  "2026-12-22": "聖誕新年假期 · Christmas / New Year",
  "2026-12-23": "聖誕新年假期 · Christmas / New Year",
  "2026-12-24": "聖誕新年假期 · Christmas / New Year",
  "2026-12-25": "聖誕節 · Christmas",
  "2026-12-26": "聖誕節 · Christmas",
  "2026-12-28": "聖誕新年假期 · Christmas / New Year",
  "2026-12-29": "聖誕新年假期 · Christmas / New Year",
  "2026-12-30": "聖誕新年假期 · Christmas / New Year",
  "2026-12-31": "聖誕新年假期 · Christmas / New Year",
  "2027-01-01": "元旦 · New Year’s Day",
  "2027-01-02": "新年假期 · New Year holiday",
  "2027-02-05": "農曆新年假期 · Lunar New Year",
  "2027-02-06": "農曆年初一 · Lunar New Year",
  "2027-02-07": "農曆年初二 · Lunar New Year",
  "2027-02-08": "農曆年初三 · Lunar New Year",
  "2027-02-09": "農曆新年假期 · Lunar New Year",
  "2027-02-10": "農曆新年假期 · Lunar New Year",
  "2027-02-11": "農曆新年假期 · Lunar New Year",
  "2027-02-12": "農曆新年假期 · Lunar New Year",
  "2027-02-13": "農曆新年假期 · Lunar New Year",
  "2027-03-23": "校運會翌日 · Day after sports day",
  "2027-03-26": "復活節假期 · Easter",
  "2027-03-27": "復活節假期 · Easter",
  "2027-03-28": "復活節假期 · Easter",
  "2027-03-29": "復活節假期 · Easter",
  "2027-04-02": "清明節假期 · Ching Ming",
  "2027-04-03": "清明節假期 · Ching Ming",
  "2027-04-04": "清明節假期 · Ching Ming",
  "2027-04-05": "清明節 · Ching Ming",
  "2027-04-06": "清明節假期 · Ching Ming",
  "2027-04-07": "清明節假期 · Ching Ming",
  "2027-04-08": "清明節假期 · Ching Ming",
  "2027-05-01": "勞動節 · Labour Day",
  "2027-05-13": "佛誕 · Buddha’s Birthday",
  "2027-05-14": "佛誕假期 · Buddha’s Birthday",
  "2027-06-09": "端午節 · Tuen Ng",
  "2027-07-01": "香港特別行政區成立紀念日 · HKSAR Establishment Day"
};

function inSummerHoliday(iso) {
  return (iso >= "2026-08-01" && iso <= "2026-08-31") ||
    (iso >= "2027-07-13" && iso <= "2027-08-31");
}

function hkNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function isoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function setHands(d) {
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const hourDeg = ((h % 12) + m / 60) * 30;
  const minDeg = (m + s / 60) * 6;
  const secDeg = s * 6;
  document.getElementById("hourHand").style.transform = `rotate(${hourDeg}deg)`;
  document.getElementById("minuteHand").style.transform = `rotate(${minDeg}deg)`;
  document.getElementById("secondHand").style.transform = `rotate(${secDeg}deg)`;
  document.getElementById("digital").textContent = `${pad(h)}:${pad(m)}`;
}

function renderDate(d) {
  const y = d.getFullYear();
  const mon = d.getMonth();
  const day = d.getDate();
  document.getElementById("dateLine").textContent =
    `${y}年${mon + 1}月${day}日 (${MONTH_EN[mon]} ${day})`;
  document.getElementById("weekdayLine").textContent =
    `${WEEKDAY_ZH[d.getDay()]} (${WEEKDAY_EN[d.getDay()]})`;
}

function renderCycle(d) {
  const key = isoDate(d);
  const hit = cycleByDate.get(key);
  const special = SPECIAL_DAYS[key];
  const holiday = NAMED_HOLIDAYS[key];
  const line = document.getElementById("cycleLine");
  const sub = document.getElementById("cycleSub");

  if (hit) {
    line.innerHTML = `循環日：<span class="badge d${hit.day}">${DAY_ZH[hit.day]} (Day ${hit.day})</span>`;
    sub.textContent = `第 ${hit.cycle} 循環 · Cycle ${hit.cycle}`;
    return;
  }

  if (special) {
    line.innerHTML = `循環日：<span class="badge special">Special Day</span>`;
    sub.textContent = special;
    return;
  }

  if (holiday) {
    line.innerHTML = `循環日：<span class="badge holiday">Holiday</span>`;
    sub.textContent = holiday;
    return;
  }

  if (inSummerHoliday(key) || d.getDay() === 0 || d.getDay() === 6) {
    line.innerHTML = `循環日：<span class="badge holiday">Holiday</span>`;
    sub.textContent = inSummerHoliday(key)
      ? "暑假 · Summer holiday"
      : "週末 · Weekend";
    return;
  }

  line.innerHTML = `循環日：<span class="badge holiday">Holiday</span>`;
  sub.textContent = "假期／非循環日 · No cycle lesson today";
}

function tick() {
  const live = hkNow();
  setHands(live);
  const board = dateOverride ? new Date(`${dateOverride}T12:00:00`) : live;
  renderDate(board);
  renderCycle(board);
}

async function loadCycles() {
  let rows;
  try {
    const res = await fetch("cycle-days.json");
    if (!res.ok) throw new Error("no json");
    rows = await res.json();
  } catch {
    rows = JSON.parse(document.getElementById("cycle-data").textContent);
  }
  cycleByDate = new Map(rows.map((r) => [r.date, r]));
}

async function loadWeather() {
  const el = document.getElementById("weather");
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=22.3193&longitude=114.1694&current=temperature_2m,weather_code&timezone=Asia%2FHong_Kong";
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    const t = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    el.hidden = false;
    el.textContent = `${weatherLabel(code)}　${t}°C`;
  } catch {
    /* keep hidden if offline */
  }
}

function weatherLabel(code) {
  if (code === 0) return "晴朗";
  if (code === 1 || code === 2) return "大致晴朗";
  if (code === 3) return "多雲";
  if (code === 45 || code === 48) return "有霧";
  if (code >= 51 && code <= 67) return "有雨";
  if (code >= 71 && code <= 77) return "有雪";
  if (code >= 80 && code <= 82) return "驟雨";
  if (code >= 95) return "雷暴";
  return "天氣";
}

loadCycles()
  .then(() => {
    tick();
    setInterval(tick, 1000);
  })
  .catch(() => {
    document.getElementById("cycleLine").textContent = "未能載入校曆資料";
    tick();
    setInterval(tick, 1000);
  });

loadWeather();
