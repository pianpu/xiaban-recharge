(function(root){
  'use strict';
  const defaults={start:'09:00',end:'18:00',lunchEnabled:true,lunchStart:'12:00',lunchEnd:'13:30',monthly:10000,days:21.75};
  const timeMinutes=t=>{if(typeof t!=='string'||!/^\d{2}:\d{2}$/.test(t))throw Error('请填写有效时间。');const [h,m]=t.split(':').map(Number);if(h>23||m>59)throw Error('时间格式有误。');return h*60+m;};
  function validate(config){
    const c={...defaults,...config};const start=timeMinutes(c.start),end=timeMinutes(c.end);if(start===end)throw Error('上下班时间不能相同。');
    if(!Number.isFinite(+c.monthly)||+c.monthly<0||+c.monthly>100000000)throw Error('请填写有效月薪（0～1亿元）。');
    if(!Number.isFinite(+c.days)||+c.days<1||+c.days>31)throw Error('计薪天数应在1～31天之间。');
    c.monthly=+c.monthly;c.days=+c.days;c.lunchEnabled=!!c.lunchEnabled;
    const duration=(end-start+1440)%1440;
    if(c.lunchEnabled){let ls=(timeMinutes(c.lunchStart)-start+1440)%1440;let le=(timeMinutes(c.lunchEnd)-start+1440)%1440;if(ls>=le||le>duration||le-ls>=duration)throw Error('午休需在班次内，且结束时间晚于开始时间。');}
    return c;
  }
  function restoreConfig(saved={}){
    const c=validate(saved.config||{});
    // Upgrade the previous default without discarding other saved preferences.
    if((saved.defaultsVersion||1)<2&&c.lunchStart==='12:00'&&c.lunchEnd==='13:00'){
      try{return validate({...c,lunchEnd:'13:30'});}catch{return c;}
    }
    return c;
  }
  function calculate(config,date=new Date()){
    const c=validate(config),startMin=timeMinutes(c.start),endMin=timeMinutes(c.end),overnight=endMin<startMin;
    const now=date.getTime();const anchor=new Date(date);anchor.setHours(0,0,0,0);
    if(overnight&&date.getHours()*60+date.getMinutes()<startMin)anchor.setDate(anchor.getDate()-1);
    const start=new Date(anchor);start.setMinutes(startMin);const end=new Date(anchor);if(overnight)end.setDate(end.getDate()+1);end.setMinutes(endMin);
    let lunchStart=0,lunchEnd=0;
    if(c.lunchEnabled){lunchStart=start.getTime()+((timeMinutes(c.lunchStart)-startMin+1440)%1440)*60000;lunchEnd=start.getTime()+((timeMinutes(c.lunchEnd)-startMin+1440)%1440)*60000;}
    const total=end-start-(lunchEnd-lunchStart);const capped=Math.min(Math.max(now,start.getTime()),end.getTime());
    const elapsed=Math.max(0,capped-start-Math.max(0,Math.min(capped,lunchEnd)-lunchStart));
    const progress=Math.min(1,elapsed/total),daily=c.monthly/c.days;
    const status=now<start?'before':now>=end?'done':c.lunchEnabled&&now>=lunchStart&&now<lunchEnd?'lunch':'working';
    return {status,start,end,remaining:Math.max(0,Math.ceil((end-now)/1000)),progress,daily,earned:daily*progress,total,elapsed};
  }
  const api={defaults,validate,calculate,restoreConfig};if(typeof module!=='undefined')module.exports=api;else root.RechargeTime=api;
})(typeof globalThis!=='undefined'?globalThis:this);
