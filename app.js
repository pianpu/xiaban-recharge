(()=>{'use strict';
const $=id=>document.getElementById(id),key='recharge-station-v1';let config={...RechargeTime.defaults},hidden=false,storageAvailable=true;
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){config=RechargeTime.restoreConfig(saved);hidden=!!saved.hidden;}}catch{try{localStorage.removeItem(key);}catch{storageAvailable=false;}}
const money=n=>n.toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});
let toastTimer;function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
function save(){try{localStorage.setItem(key,JSON.stringify({config,hidden,defaultsVersion:3}));storageAvailable=true;return true;}catch{storageAvailable=false;return false;}}
function render(){const now=new Date(),s=RechargeTime.calculate(config,now),sec=s.remaining;
$('hours').textContent=String(Math.floor(sec/3600)).padStart(2,'0');$('minutes').textContent=String(Math.floor(sec%3600/60)).padStart(2,'0');$('seconds').textContent=String(sec%60).padStart(2,'0');
$('countdown-title').textContent=s.status==='done'?'今日已到站，去享受生活吧':'距离今日下班还有';
const states={before:'还没发车，先好好照顾自己',working:'正在驶向自由时间',lunch:'午休补给中，工资进度暂停',done:'自由时间已到站'};$('work-state').textContent=states[s.status];
$('end-label').textContent='终点站 '+config.end;$('start-label').textContent=config.start+' 出发';
$('journey-caption').textContent=s.status==='done'?'今天的你，已经很棒了':s.status==='before'?'新的一天，慢慢出发':'已走过 '+(s.progress*100).toFixed(1)+'% 的努力';
const percentage=(s.progress*100).toFixed(2)+'%';$('journey-fill').style.width=percentage;$('train-marker').style.left=percentage;$('salary-fill').style.width=percentage;
$('earned').textContent=hidden?'••••••':money(s.earned);$('daily-pay').textContent=hidden?'¥••••':'¥'+money(s.daily);$('salary-percent').textContent=(s.progress*100).toFixed(1)+'%';document.querySelector('.salary-progress').setAttribute('aria-valuenow',(s.progress*100).toFixed(1));
$('salary-note').textContent=s.status==='lunch'?'午休暂停计薪，安心吃一顿好饭。':s.status==='done'?'今天的努力已收好，接下来属于你。':s.status==='before'?'开工后开始累积，先享受眼前的时间。':'每一秒，都是生活的小底气。';
$('today-date').textContent=new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'long'}).format(now).replace('日','日 · ');const hour=now.getHours();$('greeting').textContent=hour<12?'把今天，过成喜欢的样子。':hour<18?'慢慢来，也来得及。':'把时间，还给喜欢的生活。';
$('privacy-btn').setAttribute('aria-pressed',String(hidden));$('privacy-btn').setAttribute('aria-label',hidden?'显示工资金额':'隐藏工资金额');}
render();setInterval(render,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
const dialog=$('settings-dialog'),form=$('settings-form');
function openSettings(){for(const [name,value]of Object.entries(config)){const el=form.elements.namedItem(name);if(!el)continue;if(el.type==='checkbox')el.checked=value;else el.value=value;}$('form-error').textContent='';updateLunch();dialog.showModal();}
function updateLunch(){const enabled=form.elements.lunchEnabled.checked;$('lunch-fields').style.opacity=enabled?'1':'.45';for(const name of ['lunchStart','lunchEnd'])form.elements[name].disabled=!enabled;}
document.querySelectorAll('[data-settings]').forEach(b=>b.addEventListener('click',openSettings));$('close-settings').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});form.elements.lunchEnabled.onchange=updateLunch;
form.onsubmit=e=>{e.preventDefault();const candidate={...config};for(const name of Object.keys(config)){const el=form.elements.namedItem(name);candidate[name]=el.type==='checkbox'?el.checked:el.value;}try{config=RechargeTime.validate(candidate);const persisted=save();render();dialog.close();toast(persisted?'已记住你的作息，一起慢慢到站。':'作息已更新；浏览器无法保存，刷新后需重新设置。');}catch(err){$('form-error').textContent=err.message;}};
$('privacy-btn').onclick=()=>{hidden=!hidden;const persisted=save();render();toast(!persisted?'金额显示已切换，浏览器无法保存此偏好。':hidden?'金额已隐藏，安心展示你的小站。':'金额已显示。');};
let petTimer,petCount=0;const messages={pat:['收到摸摸！今天的你值得一个拥抱。','阿团：不用每一秒都很厉害。','贴贴～好心情正在加载。'],feed:['啊呜一口橘子！给你留了最甜的一瓣。','零食收到！你也记得好好吃饭呀。','肚子饱饱，烦恼少少。'],play:['跳一下！把烦恼甩到站台外。','阿团蹦了蹦：下班后一起散步吧！','今日快乐 +1，阿团的喜欢 +100。']};
function petAction(action){petCount++;clearTimeout(petTimer);const scene=document.querySelector('.forest-scene');scene.classList.remove('pat','feed','play');void scene.getBoundingClientRect();scene.classList.add(action);$('pet-bubble').textContent=messages[action][Math.floor(Math.random()*messages[action].length)];$('pet-status').textContent=['幸福冒泡，回血成功','今天也被你好好照顾了','能量 +1，好心情 +1'][petCount%3];petTimer=setTimeout(()=>scene.classList.remove(action),1900);}
$('pet-touch').onclick=()=>petAction('pat');document.querySelectorAll('[data-pet]').forEach(b=>b.onclick=()=>petAction(b.dataset.pet));
const quotes=['你不需要时刻满电，慢慢来就好。','工资会到账，快乐也要记得签收。','今天完成得不完美，也值得好好吃饭。','你的生活，不只在待办清单里。','能好好休息，也是一种很棒的能力。','让小事带来快乐，让今天轻一点。','下班以后，记得把自己还给自己。'];let quoteIndex=0;$('quote-btn').onclick=()=>{quoteIndex=(quoteIndex+1)%quotes.length;$('quote').textContent=quotes[quoteIndex];};
const sound=new RechargeSound({music:$('bg-music'),forest:$('forest-audio'),onChange:state=>{
  const playing=state.status==='playing',mode=state.mode==='forest'?'林间溪流':'轻音乐',button=$('sound-btn');
  $('sound-label').textContent=state.status==='blocked'?'点击开启声音':state.status==='error'?'声音重试':state.status==='muted'?'声音已关闭':state.status==='loading'?'声音准备中':mode;
  button.setAttribute('aria-pressed',String(playing));button.dataset.audioState=state.status;
  button.setAttribute('aria-label',playing?'关闭'+mode:'开启'+mode);
  button.title=state.status==='blocked'?'浏览器需要一次点击才能播放，点页面任意位置即可开启。':state.status==='error'?'音频暂时无法播放，点击重试。':playing?(state.charging?'充电结束后会从暂停处恢复轻音乐。':'轻音乐正在播放，点击可静音。'):'开启声音';
  $('charge-sound-label').textContent=state.charging?(playing?'正在播放 · 林间溪流与鸟鸣':state.status==='muted'?'静音充电 · 可用顶部开关开启声音':state.status==='error'?'自然声暂不可用 · 点击顶部重试':state.status==='blocked'?'点击顶部，开启林间自然声':'正在准备林间自然声…'):'充电时 · 林间溪流与鸟鸣';
}});
let breathTimer=null,breathStart=0;function stopBreath(done){clearInterval(breathTimer);breathTimer=null;void sound.setCharging(false);$('breath-visual').classList.remove('running');$('breath-phase').textContent=done?'满 电 啦':'呼 — 吸';$('breath-description').textContent=done?'这一分钟，你把自己照顾得很好。':'跟着光圈呼吸，把疲惫轻轻放下。';$('breath-btn').innerHTML=(done?'再充一次':'开始充电')+' <svg><use href="#i-arrow"/></svg>';$('breath-footnote').textContent=done?'带着这份松弛，慢慢回到今天。':'不用赶进度，这一分钟只属于你';}
function breathTick(){const elapsed=(Date.now()-breathStart)/1000;if(elapsed>=60){stopBreath(true);toast('充电完成，送你一朵小小的好心情。');return;}const phase=elapsed%10;$('breath-phase').textContent=phase<4?'慢 慢 吸 气':phase<6?'轻 轻 停 留':'缓 缓 呼 气';$('breath-description').textContent=phase<4?'想象吸进一片森林的清新。':phase<6?'轻轻停一停，肩膀放松。':'让今天的疲惫，跟着呼吸离开。';$('breath-footnote').textContent='还剩 '+Math.ceil(60-elapsed)+' 秒 · 按舒服的节奏就好';}
$('breath-btn').onclick=()=>{if(breathTimer){stopBreath(false);return;}void sound.setCharging(true);breathStart=Date.now();$('breath-visual').classList.add('running');$('breath-btn').textContent='暂停，歇一会儿';breathTick();breathTimer=setInterval(breathTick,200);};
$('sound-btn').onclick=()=>{void sound.toggle();};
// Attempt automatic playback by default; recover on the first real interaction.
void sound.sync();
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#sound-btn, #breath-btn'))void sound.unlock();});
document.addEventListener('keydown',e=>{if(e.key!=='Tab'&&!e.target.closest('#sound-btn, #breath-btn'))void sound.unlock();});
})();
