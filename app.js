const WEEKDAY_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_ZH = ["", "第一日", "第二日", "第三日", "第四日", "第五日", "第六日", "第七日"];

const params = new URLSearchParams(location.search);
const dateOverride = params.get("date"); // YYYY-MM-DD

let cycleByDate = new Map();

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
  const line = document.getElementById("cycleLine");
  const sub = document.getElementById("cycleSub");

  if (hit) {
    line.innerHTML = `循環日：<span class="badge d${hit.day}">${DAY_ZH[hit.day]} (Day ${hit.day})</span>`;
    sub.textContent = `第 ${hit.cycle} 循環 · Cycle ${hit.cycle}`;
  } else {
    line.innerHTML = `循環日：<span class="badge holiday">Holiday</span>`;
    sub.textContent = "假期／非循環日 · No cycle lesson today";
  }
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
