(function(root){
  'use strict';
  // Keep one audible source at a time; mode changes never reset music position.
  class RechargeSound {
    constructor({music,forest,onChange=()=>{},fadeMs=850}){
      this.music=music;this.forest=forest;this.onChange=onChange;this.fadeMs=fadeMs;
      this.enabled=true;this.charging=false;this.version=0;this.fadeTimer=null;this.status='idle';
      for(const audio of [music,forest]){audio.loop=true;audio.volume=0;}
    }
    get mode(){return this.charging?'forest':'music';}
    emit(){this.onChange({enabled:this.enabled,charging:this.charging,mode:this.mode,status:this.status});}
    async sync(){
      const version=++this.version;clearInterval(this.fadeTimer);this.fadeTimer=null;
      this.music.pause();this.forest.pause();
      if(!this.enabled){this.status='muted';this.emit();return false;}
      const audio=this.mode==='forest'?this.forest:this.music,target=this.mode==='forest'?.48:.32;
      audio.volume=0;this.status='loading';this.emit();
      try{
        // play() runs before awaiting, preserving the click's playback permission.
        await audio.play();
        if(version!==this.version)return false;
        this.status='playing';this.emit();
        if(this.fadeMs<=0){audio.volume=target;return true;}
        const start=Date.now();this.fadeTimer=setInterval(()=>{
          if(version!==this.version){clearInterval(this.fadeTimer);return;}
          const fraction=Math.min(1,(Date.now()-start)/this.fadeMs);audio.volume=target*fraction;
          if(fraction===1){clearInterval(this.fadeTimer);this.fadeTimer=null;}
        },35);
        return true;
      }catch(error){
        if(version!==this.version)return false;
        audio.pause();this.status=error.name==='NotAllowedError'?'blocked':'error';this.emit();return false;
      }
    }
    toggle(){
      if(this.enabled&&(this.status==='blocked'||this.status==='error'))return this.sync();
      this.enabled=!this.enabled;return this.sync();
    }
    setCharging(active){this.charging=active;return this.sync();}
    unlock(){if(this.enabled&&(this.status==='blocked'||this.status==='idle'))return this.sync();return Promise.resolve(false);}
  }
  if(typeof module!=='undefined')module.exports=RechargeSound;else root.RechargeSound=RechargeSound;
})(typeof globalThis!=='undefined'?globalThis:this);
