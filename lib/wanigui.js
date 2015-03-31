$(function() {
  'use strict';

  // signal window length is always porwer of 2, AFAIK,
  // so simply get peek value from (power of 2) samples which
  // specified by opts.zoomout.
  function renderArrayToCanvas(data,canvas,opts) {
    var w = canvas.width;
    var h = canvas.height;
    var z = opts.zoomout ? Math.pow(2,parseInt(opts.zoomout))
          : Math.pow(2, parseInt(Math.log2(data.length/w)));
    var ctx = canvas.getContext('2d');
    var i,j,idx,maxv,minv,repeats;
    var range = opts.range || [-1,1];
    var multiplier = h / Math.abs(range[0]-range[1]);
    var offset = - (Math.min(range[0],range[1]) * multiplier);
    ctx.fillStyle = opts.backgroundColor || '#888980';
    ctx.lineWidth = '1px';
    ctx.clearRect(0,0,w,h);
    ctx.fillRect(0,0,w,h);

    if (opts.centerLine) {
      ctx.strokeStyle = opts.centerLine || '#888';
      ctx.beginPath();
      ctx.moveTo(0,h/2);
      ctx.lineTo(w-1,h/2);
      ctx.stroke();
    }

    ctx.strokeStyle = opts.lineColor || '#f84';
    ctx.moveTo(0,h/2);
    ctx.beginPath();
    repeats = parseInt(Math.min(w,data.length/z));
    for(i=0;i<repeats;i++){  // i = x-position in canvas
      idx = i * z; // idx = index of samples array
      // get peek
      maxv,minv;
      maxv = minv = data[idx];
      if ( 1 < z ) {
        for ( j=1;j<z;j++) {
          if ( maxv < data[idx+j] ) maxv=data[idx+j];
          if ( data[idx+j] < minv ) minv=data[idx+j];
        }
      }
      ctx.lineTo(i,h - (offset + minv * multiplier));
      if ( maxv !== minv ) ctx.lineTo(i, h - (offset + maxv * multiplier));
    }
    ctx.stroke();
  }

  function createWaveFormRenderer(ctx, canvasId, opts) {
    var proc = ctx.createScriptProcessor(2048,1,1);
    // TODO: allow to pass any type (Dom, Dom id, jquery object...)
    var cvs = document.getElementById(canvasId);
    proc.onaudioprocess = function(evt) {
      var channel = evt.inputBuffer.getChannelData(0);
      renderArrayToCanvas(channel,cvs,opts);
    };
    Wani.mute(ctx,proc);
    return proc;
  }

  window.Wanigui = {
    createWaveFormRenderer: createWaveFormRenderer,
    renderArrayToCanvas: renderArrayToCanvas
  };

});
