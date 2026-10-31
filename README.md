# kids-chinese-packs
Seren 上海小学四年级语文每日小测（iPad Safari）https://jerryhsieh0327.github.io/kids-chinese-packs/

## Layout
- `assets/quiz.js`, `assets/quiz.css` – 选择题页（点选 A–D、提交、解析、复制成绩）
- `YYYY-MM-DD/quiz.json` – 题源（简体）。字段：date, child, topic, level, tips[], questions[]
- 每题：title, q, options{A..D}, answer, explanation, wrong{}, 可选 challenge / isReview
- `YYYY-MM-DD/index.html`（孩子）与 `parent.html`（家长）由 `python3 build.py` 生成

## New date
1. `mkdir YYYY-MM-DD` 写 `quiz.json`（约 5 题＋可选 1 挑战）
2. `python3 build.py`
3. 用 Composio `GITHUB_COMMIT_MULTIPLE_FILES` 推到 `jerryhsieh0327/kids-chinese-packs` main
4. 打开 https://jerryhsieh0327.github.io/kids-chinese-packs/DATE/ 确认 200

成绩开头固定：【语文成绩回报 → 中国小学语文家教】（页面 JS 用简体「語文」变体见 quiz.js HEAD）
