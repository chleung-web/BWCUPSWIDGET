# 佛教黃焯菴小學 · 循環日時鐘

A **180 × 180 px** static widget for GitHub Pages (iframe size `180` × `180`): Hong Kong time as a **24-hour digital clock** (`HH:MM:SS`), date, and today’s **7-day cycle**. No full-screen background—only the card.

Cycle days use the coloured Day 1–7 sequence on the calendar.

| Badge | Example |
|---|---|
| Day 1–7 | Coloured cycle teaching day (7/9 is Day 1) |
| **Special Day** | Opening, half-days, assessment, picnic, parents’ day, sports day, OLE week, PD, post-exam. **1/9/2026** is Special Day (開學日), not Holiday |
| **Holiday** | Public/school holidays, weekends, summer. **26/08/2026** is Holiday |
| **上課日** | Teaching day with no cycle colour (e.g. 18/9). Staff-only 內部事務 such as 例會 are not shown |

## Open locally

Open `index.html` in a browser, or from this folder:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080/?date=2026-08-26` (Holiday) or `?date=2026-09-01` (Special Day) or `?date=2026-09-07` (Day 1). Embed with `<iframe src="..." width="180" height="180">`.

## GitHub Pages

1. Create a repository and upload these files to the root (or `/docs`).
2. Settings → Pages → Deploy from branch (`main` / `root` or `/docs`).
3. After a minute the site is live.

`cycle-days.json` must sit next to `index.html` (the page fetches it).

## What the badge means

| Badge | Meaning |
|---|---|
| 第一日–第七日 (Day 1–7) | Coloured cycle teaching day |
| Holiday | No cycle lesson: public holiday, school holiday, assessment day, PD day, weekend, or summer/winter break |

The clock is **student-facing**. Calendar column **內部事務** (每月例會, 行政會議, SSPA paperwork, 聯校教師專業培訓) is not displayed. **教師專業發展日** is kept, because students have no lessons that day.

The clock always uses **Asia/Hong_Kong** time. Optional weather is from Open-Meteo (no key); it stays hidden if the request fails.

## Data

Built from the school calendar colours:

- Day 1 `#F173AC` … Day 7 `#9474B4`
- First cycle: 7–15 Sep 2026 (Day 1 = 7/9, Day 7 = 15/9)
- Last cycle: 22–23 Jun 2027 (Day 1–2 only)
- Holidays do not use up a Day slot
