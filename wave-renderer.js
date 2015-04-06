(function() {
  var createWaveFormRenderer, renderArrayToCanvas;

  renderArrayToCanvas = function(data, canvas, opts) {
    var ctx, h, i, idx, j, maxv, minv, multiplier, offset, range, repeats, w, z;
    w = canvas.width;
    h = canvas.height;
    z = opts.zoomout ? Math.pow(2, parseInt(opts.zoomout)) : Math.pow(2, parseInt(Math.log2(data.length / w)));
    ctx = canvas.getContext('2d');
    i = void 0;
    j = void 0;
    idx = void 0;
    maxv = void 0;
    minv = void 0;
    repeats = void 0;
    range = opts.range || [-1, 1];
    multiplier = h / Math.abs(range[0] - range[1]);
    offset = -(Math.min(range[0], range[1]) * multiplier);
    ctx.fillStyle = opts.backgroundColor || '#888980';
    ctx.lineWidth = '1px';
    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(0, 0, w, h);
    if (opts.centerLine) {
      ctx.strokeStyle = opts.centerLine || '#888';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w - 1, h / 2);
      ctx.stroke();
    }
    ctx.strokeStyle = opts.lineColor || '#f84';
    ctx.moveTo(0, h / 2);
    ctx.beginPath();
    repeats = parseInt(Math.min(w, data.length / z));
    i = 0;
    while (i < repeats) {
      idx = i * z;
      maxv;
      minv;
      maxv = minv = data[idx];
      if (1 < z) {
        j = 1;
      }
      while (j < z) {
        if (maxv < data[idx + j]) {
          maxv = data[idx + j];
        }
        if (data[idx + j] < minv) {
          minv = data[idx + j];
        }
        j++;
      }
      ctx.lineTo(i, h - offset + minv * multiplier);
      if (maxv !== minv) {
        ctx.lineTo(i, h - offset + maxv * multiplier);
      }
      i++;
    }
    ctx.stroke();
  };

  createWaveFormRenderer = function(ctx, canvasId, opts) {
    var cvs, mute, proc;
    proc = ctx.createScriptProcessor(2048, 1, 1);
    cvs = document.getElementById(canvasId);
    proc.onaudioprocess = function(evt) {
      var channel;
      channel = evt.inputBuffer.getChannelData(0);
      renderArrayToCanvas(channel, cvs, opts);
    };
    mute = ctx.createGain();
    mute.gain.value = 0;
    proc.connect(mute);
    mute.connect(ctx.destination);
    return proc;
  };

  Wanigui.createWaveFormRenderer = createWaveFormRenderer;

  Wanigui.renderArrayToCanvas = renderArrayToCanvas;

}).call(this);
