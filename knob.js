(function() {
  var Knob, __style, addGlobalEventHandler;

  Knob = function(module, name, param, opts) {
    return this.init(module, name, param, opts);
  };

  Knob.prototype.init = function(module, name, param, opts) {
    this.module = module;
    this.name = name;
    this.param = param;
    this.opts = opts;
    this.isSelect = param.values != null ? true : false;
    this.values = param.values;
    this.sense = opts.sense || 200;
    if (this.isSelect) {
      this.step = 1;
      Object.defineProperty(this, 'value', {
        set: function(v) {
          var idx;
          idx = this.values.indexOf(v);
          if (idx < 0) {
            return;
          }
          this._value = idx;
          this.module[name] = v;
          return this.rotate();
        },
        get: function() {
          return this.values[this._value];
        }
      });
      this.defaultValue = this.values[0];
    } else {
      this.min = param.range[0];
      this.max = param.range[1];
      this.step = this.opts.step || this.range / this.sense;
      Object.defineProperty(this, 'value', {
        set: function(v) {
          if (!((this.min <= v && v <= this.max))) {
            return;
          }
          v = Math.round(v * 1 / this.step) * this.step;
          this._value = v;
          if (this.module[name].value != null) {
            this.module[name].value = v;
          } else {
            this.module[name] = v;
          }
          return this.rotate();
        },
        get: function() {
          return this._value;
        }
      });
      this.defaultValue = this.module[name].value != null ? this.module[name].value : this.module[name];
    }
    return this;
  };

  Knob.Defaults = {
    min: 0,
    max: 1
  };

  Knob.prototype.template = function(t) {
    return "<div class=\"wani-knob-box wani-knob\">\n  <div class=\"wani-knob-inner\">\n    <h3 class=\"wani-knob-title\">\n      <span>" + t.title + "</span>\n    </h3>\n    <canvas class=\"wani-knob-backsheet\" width=\"160\" height=\"160\"></canvas>\n    <div class=\"wani-knob-activevalue\">" + t.value + "</div>\n    <div class=\"wani-knob-value\">" + t.value + "</div>\n    <div class=\"wani-knob-knob\">\n      <div class=\"wani-knob-point\"></div>\n    </div>\n  </div>\n</div>";
  };

  Knob.prototype.build = function() {
    var $box, bs, ctx, html, i, len, value, x, y;
    this.opts = $.extend({}, Knob.Defaults, this.param, this.opts);
    this.canvasMargin = 48;
    this.values = void 0;
    this.range = void 0;
    this.isSelect = this.opts.values != null;
    if (this.isSelect) {
      this.values = this.opts.values;
      this.min = 0;
      this.max = this.opts.values.length - 1;
      this.range = [0, this.opts.values.length - 1];
      this.multiplier = 0.05;
      this._value = 0;
      this.step = 1;
    } else {
      this.values = this.opts.range;
      this.min = this.opts.range[0];
      this.max = this.opts.range[1];
      this.range = Math.abs(this.max - this.min);
      this.multiplier = this.range / this.sense;
      this.step = this.opts.step || this.range / 300;
    }
    this.baseTheta = Math.PI * 240 / 360 * 2;
    html = this.template({
      title: this.name,
      value: this.value
    });
    $box = $(html);
    this.box = $box;
    bs = ($box.find('.wani-knob-backsheet')).get(0);
    bs.tipWidth = 52;
    bs.tipHeight = 18;
    bs.radius = (bs.width - bs.tipWidth) / 2;
    ctx = bs.getContext('2d');
    ctx.fillStyle = '#889';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    i = 0;
    len = this.values.length;
    while (i < len) {
      value = this.values[i];
      x = bs.width / 2 + bs.radius * Math.cos(this.baseTheta - 2 * i / (len - 1) * Math.PI * 300 / 360);
      y = bs.height / 2 - bs.radius * Math.sin(this.baseTheta - 2 * i / (len - 1) * Math.PI * 300 / 360);
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(bs.width / 2, bs.height / 2);
      ctx.stroke();
      ctx.fillStyle = '#789';
      ctx.fillRect(x - bs.tipWidth / 2, y - bs.tipHeight / 2, bs.tipWidth, bs.tipHeight);
      ctx.strokeRect(x - bs.tipWidth / 2, y - bs.tipHeight / 2, bs.tipWidth, bs.tipHeight);
      ctx.fillStyle = '#fff';
      ctx.font = 'normal lighter 14px "Courier New", arial';
      ctx.fillText(value, x, y, bs.tipWidth - 2);
      i++;
    }
    $box.data('wanigui-knob', this);
    this.value = this.defaultValue;
    return $box;
  };

  Knob.prototype.rotate = function() {
    var range, rate, rotate, value, valueStr;
    if (!this.box) {
      return;
    }
    value = Math.round(this._value * 1 / this.step) * this.step;
    range = Math.abs(this.max - this.min);
    rate = Math.abs(value - this.min) / range;
    rotate = 300 * (rate - 0.5);
    this.box.find('.wani-knob-knob').css({
      transform: 'rotate(' + rotate + 'deg)'
    });
    valueStr = this.isSelect ? this.value : this.value.toFixed(6).substr(0, 7);
    this.box.find('.wani-knob-activevalue').text(valueStr);
    return this.box.find('.wani-knob-value').text(valueStr);
  };

  addGlobalEventHandler = function(document) {
    $(document).on('mousedown', '.wani-knob-knob', function(evt) {
      var $activeValue, $backsheet, $box, $currentValue, $knob, knob, lastPos, lastRoundedValue, lastValue, listener;
      $('body').addClass('wani-no-select wani-grabbing');
      $knob = $(this);
      $knob.addClass('wani-knob-active');
      $box = $knob.parents('.wani-knob-box');
      knob = $box.data('wanigui-knob');
      lastPos = {
        x: evt.pageX,
        y: evt.pageY
      };
      lastValue = knob.isSelect ? knob._value : knob.value;
      lastRoundedValue = lastValue;
      $activeValue = $knob.siblings('.wani-knob-activevalue').show();
      $backsheet = $knob.siblings('.wani-knob-backsheet').show();
      $currentValue = $knob.siblings('.wani-knob-value').hide();
      listener = function(evt) {
        var d, pos, roundedValue, value;
        pos = {
          x: evt.pageX,
          y: evt.pageY
        };
        d = {
          x: pos.x - lastPos.x,
          y: pos.y - lastPos.y
        };
        value = lastValue - d.y * knob.multiplier;
        if (knob.max <= value) {
          value = knob.max;
        }
        if (value <= knob.min) {
          value = knob.min;
        }
        lastPos = pos;
        if (knob.isSelect) {
          roundedValue = Math.round(value);
          if (lastRoundedValue !== roundedValue) {
            knob.value = knob.values[roundedValue];
            lastRoundedValue = roundedValue;
          }
        } else {
          if (lastValue !== value) {
            knob.value = value;
          }
        }
        lastValue = value;
        return false;
      };
      $(document).on('mousemove', listener);
      $(document).on('mouseup', function() {
        $('body').removeClass('wani-no-select wani-grabbing');
        $knob.removeClass('wani-knob-active');
        $activeValue.hide();
        $backsheet.hide();
        $currentValue.show();
        $(document).off('mousemove', listener);
        return true;
      });
      return false;
    });
  };

  __style = '.wani-knob-box {\n  width: 64px;\n  height: 64px;\n  text-align: center;\n  display: inline-block;\n  margin-bottom: 16px;\n}\n\n.wani-knob-inner {\n  position: relative;\n  margin-left: -2px;\n  width: 100%;\n  height: 100%;\n}\n\n.wani-knob-backsheet {\n  position: absolute;\n  left: -48px;\n  top: -48px;\n  z-index: 300;\n  display: none;\n}\n\n.wani-knob-knob {\n  border: 1px solid #abc;\n  z-index: 200;\n}\n\n.wani-knob-knob.wani-knob-active {\n  box-shadow: 0 0 5px #def;\n  border: 1px solid #fff;\n  background-color: #abc;\n  z-index: 400;\n}\n\n.wani-knob-knob.wani-knob-active .wani-knob-point {\n  box-shadow: 0 0 5px #def;\n  border: 1px solid #fff;\n  background-color: #abc;\n  z-index: 400;\n}\n\n.wani-knob-knob {\n  position: absolute;\n  left: 16px;\n  width: 32px;\n  height: 32px;\n  border-radius: 16px;\n  background-color: #8f8073;\n  cursor: pointer;\n}\n\n.wani-knob-point {\n  position: absolute;\n  left: 13px;\n  top: 0px;\n  width: 6px;\n  height: 6px;\n  border-radius: 3px;\n  background-color: #f84;\n  z-index: 9;\n}\n\n.wani-knob-title {\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n\n.wani-knob-title span {\n  font-size: 11px;\n  color: #fff;\n  margin: 0;\n  padding: 0;\n  vertical-align: top;\n  display: inline-block;\n}\n\n.wani-knob-value {\n  text-align: center;\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  display: block;\n  vertical-align: top;\n  font-size: 0.8em;\n  overflow: hidden;\n}\n\n.wani-knob-activevalue {\n  position: absolute;\n  bottom: -50px;\n  width: 100%;\n  z-index: 1000000;\n  overflow: hidden;\n  display: none;\n  background-color: #789;\n  color: #fff;\n  border: 1px solid #def;\n  text-align: center;\n  height: 24px;\n}';

  addGlobalEventHandler(document);

  Wanigui.registerModule({
    name: 'knob',
    create: Knob,
    stylesheet: __style
  });

}).call(this);
