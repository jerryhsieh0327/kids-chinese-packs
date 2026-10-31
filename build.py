#!/usr/bin/env python3
"""Build kid + parent pages for every YYYY-MM-DD/quiz.json and the root index."""
import json, glob, html, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
E = html.escape
KID = """<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>{child} 语文小测 {date}</title><link rel="stylesheet" href="../assets/quiz.css?v=1"></head><body>
<script>window.QUIZ={data};</script><script src="../assets/quiz.js?v=1"></script></body></html>
"""
packs = []
for f in sorted(glob.glob('20??-??-??/quiz.json')):
    d = json.load(open(f, encoding='utf-8')); day = os.path.dirname(f)
    kid = {k: d[k] for k in ('date', 'child', 'topic', 'level')}
    kid['questions'] = d['questions']
    open(f'{day}/index.html', 'w', encoding='utf-8').write(KID.format(child=E(d['child']), date=d['date'],
        data=json.dumps(kid, ensure_ascii=False).replace('</', '<\\/')))
    qs = ''.join(f"""<div class="q"><h3>第{d['questions'].index(q)+1}题 · {E(q['title'])}{' ⭐ 挑战题' if q.get('challenge') else ''}</h3><p>{E(q['q'])}</p>
<ol type="A">{''.join(f"<li>{E(q['options'][k])}{' ✔' if k==q['answer'] else ''}</li>" for k in 'ABCD')}</ol>
<p class="a">答案: {q['answer']}</p><pre>{E(q['explanation'])}</pre>
<p>错项解析:<br>{'<br>'.join(f"{k}: {E(v)}" for k,v in q.get('wrong',{}).items())}</p></div>""" for q in d['questions'])
    tips = '<br>'.join(E(x) for x in d.get('tips', []))
    open(f'{day}/parent.html', 'w', encoding='utf-8').write(f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>家长版 · {E(d['child'])} 语文 {d['date']}</title><style>body{{font-family:-apple-system,"PingFang SC",sans-serif;max-width:900px;margin:auto;padding:16px;line-height:1.7;font-size:18px;color:#333}}
.tip{{background:#e8f5f5;border-left:4px solid #5f9ea0;padding:10px 14px}}.q{{border:1px solid #eee;border-radius:12px;padding:12px 18px;margin:16px 0;background:#fafafa}}.a{{color:#27ae60;font-weight:700}}pre{{background:#fff;border:1px solid #ddd;padding:8px;border-radius:8px;white-space:pre-wrap}}</style></head><body>
<h1>家长版 · {E(d['child'])} · {d['date']}</h1><p>{E(d.get('topic',''))} · 第 {d.get('level','')} 关 · 上海小学四年级</p><div class="tip">{tips}</div>{qs}
<p>孩子提交后点「复制成绩」贴微信。开头：【语文成绩回报 → 中国小学语文家教】</p></body></html>""")
    packs.append((d['date'], d.get('topic', ''), d.get('label', '')))
items = ''.join(f'<a href="{dt}/">{dt}{" ("+E(lb)+")" if lb else ""}<small>{E(t)}</small></a>' for dt, t, lb in sorted(packs, reverse=True))
open('index.html', 'w', encoding='utf-8').write(f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kids Chinese Packs</title>
<style>body{{font-family:-apple-system,"PingFang SC",sans-serif;max-width:800px;margin:auto;padding:20px;font-size:22px;background:#f0f7f7}}a{{display:block;background:#5f9ea0;color:#fff;padding:16px;border-radius:14px;text-decoration:none;margin:12px 0}}small{{display:block;font-size:16px}}</style></head><body>
<h1>Seren 语文每日小测 ✏️</h1>{items}</body></html>""")
print('built', [p[0] for p in packs])
