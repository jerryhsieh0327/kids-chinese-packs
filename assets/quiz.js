// Shared MC kid page for Chinese packs. Expects window.QUIZ.
(function(){
var Q=window.QUIZ,DATE=Q.date,KEY='kcp-mc-'+DATE,HEAD='【語文成績回報 → 中國小學語文家教】',L=['A','B','C','D'];
var $=function(id){return document.getElementById(id)};
var st={ans:{},submitted:false};try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.ans)st=s}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
window.onerror=function(m){var e=$('msg');if(e){e.className='err';e.textContent='出错了：'+m+'（请截图给爸爸妈妈）'}};
document.title=Q.child+' 语文小测 '+DATE;
var h='<header>'+esc(Q.child)+' 语文小测 '+DATE+'<small>'+esc(Q.topic)+' · 第 '+Q.level+' 关 · 每题点一个答案，全部做完按「提交」。</small></header><main><div id="score"></div>';
Q.questions.forEach(function(q,i){h+='<section class="q" id="q'+i+'"><h2>第 '+(i+1)+' 题 · '+esc(q.title)+(q.challenge?'<span class="tag">挑战题</span>':'')+(q.isReview?'<span class="tag" style="background:#6c5ce7">复习</span>':'')+'</h2><p>'+esc(q.q)+'</p>';
  L.forEach(function(k){h+='<button class="opt" data-i="'+i+'" data-k="'+k+'"><b>'+k+'.</b>'+esc(q.options[k])+'</button>'});h+='<div class="fb" id="fb'+i+'" style="display:none"></div></section>'});
h+='<div id="msg"></div><div class="bar"><button class="big" id="sub">提交</button><button class="big alt" id="redo" style="display:none">重新作答</button><button class="big cp" id="cp" style="display:none">复制成绩</button></div><textarea id="cpbox" readonly></textarea></main>';
document.body.innerHTML=h;
function score(){var n=0;Q.questions.forEach(function(q,i){if(st.ans[i]===q.answer)n++});return n}
function render(){
  Q.questions.forEach(function(q,i){
    [].forEach.call(document.querySelectorAll('#q'+i+' .opt'),function(b){var k=b.getAttribute('data-k');b.className='opt'+(st.ans[i]===k?' sel':'');
      if(st.submitted){if(k===q.answer)b.className='opt right';else if(st.ans[i]===k)b.className='opt wrong'}});
    var fb=$('fb'+i);
    if(st.submitted){var a=st.ans[i],ok=a===q.answer;fb.style.display='block';
      fb.innerHTML=(ok?'<span class="ok">✔ 答对了！</span>':'<span class="no">✘ 你选了 '+a+'。正确答案：'+q.answer+'</span>')+'<br>'+esc(q.explanation)+(!ok&&q.wrong&&q.wrong[a]?'<br><b>为什么 '+a+' 不对：</b> '+esc(q.wrong[a]):'');
    }else fb.style.display='none'});
  $('sub').style.display=st.submitted?'none':'';$('redo').style.display=$('cp').style.display=st.submitted?'':'none';
  $('score').textContent=st.submitted?'得分：'+score()+' / '+Q.questions.length:'';
}
document.body.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.opt');if(!b||st.submitted)return;
  st.ans[+b.getAttribute('data-i')]=b.getAttribute('data-k');save();render()});
$('sub').onclick=function(){var miss=[];Q.questions.forEach(function(q,i){if(!st.ans[i])miss.push(i+1)});
  if(miss.length){$('msg').className='err';$('msg').textContent='还有题没选：第 '+miss.join('、')+' 题';$('q'+(miss[0]-1)).scrollIntoView({behavior:'smooth'});return}
  st.submitted=true;save();$('msg').textContent='';render();window.scrollTo(0,0)};
$('redo').onclick=function(){st={ans:{},submitted:false};save();$('msg').textContent='';$('cpbox').style.display='none';render();window.scrollTo(0,0)};
function report(){var t=[HEAD,'孩子：'+Q.child,'日期：'+DATE,'主题：'+Q.topic,'难度：第 '+Q.level+' 关','得分：'+score()+'/'+Q.questions.length];
  Q.questions.forEach(function(q,i){var a=st.ans[i]||'-';t.push('题'+(i+1)+' 作答 '+a+' '+(a===q.answer?'✔':'✘')+' 正确 '+q.answer)});t.push('（请贴到微信给家庭大管家转 中国小学语文家教）');return t.join('\n')}
window.__report=report;
$('cp').onclick=function(){var t=report(),m=$('msg');m.className='';
  function fallback(){var ta=$('cpbox');ta.value=t;ta.style.display='block';ta.focus();ta.select();try{ta.setSelectionRange(0,t.length)}catch(e){}
    var ok=false;try{ok=document.execCommand('copy')}catch(e){}
    m.textContent=ok?'已复制！请贴到微信':'请长按下面文字 → 全选 → 复制'}
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){m.textContent='已复制！请贴到微信'},fallback)}else fallback()}catch(e){fallback()}};
render();
})();
