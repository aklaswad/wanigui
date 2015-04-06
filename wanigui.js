(function() {
  'use strict';
  var Wanigui;

  Wanigui = function(module, opts) {
    return this.init(module, opts);
  };

  Wanigui.modules = {};

  Wanigui.registerModule = function(profile) {
    var i, j, len, results, rule, rules, sheet;
    Wanigui.modules[profile.name] = profile;
    if (profile.stylesheet != null) {
      sheet = $('<style />').appendTo($('head').eq(0)).get(0).sheet;
      rules = profile.stylesheet.split(/}/).reverse();
      results = [];
      for (i = j = 0, len = rules.length; j < len; i = ++j) {
        rule = rules[i];
        rule = rule.replace(/^[\s\n]+/g, '');
        rule = rule.replace(/^[\s\n]+$/g, '');
        if (!rule) {
          continue;
        }
        if (!rule.match(/}$/)) {
          rule += '}';
        }
        results.push(sheet.insertRule(rule, 0));
      }
      return results;
    }
  };

  Wanigui.prototype.Defaults = {};

  Wanigui.prototype.init = function(module, opts) {
    var name, param, profile, ref, ref1;
    this.opts = $.extend({}, this.Defaults, opts);
    this.audioParams = {};
    this.params = {};
    this.module = module;
    this.instrument;
    this.profile = profile = module.profile;
    this.attachToModule(module, profile, opts);
    if (profile.type === 'synth') {
      this.attachToInstrument(module, profile, opts);
    }
    ref = profile.audioParams;
    for (name in ref) {
      param = ref[name];
      this.attachToAudioParam(module, name, param, this.opts);
    }
    ref1 = profile.params;
    for (name in ref1) {
      param = ref1[name];
      this.attachToParam(module, name, param, this.opts);
    }
    return this;
  };

  Wanigui.prototype.attachToModule = function(module, profile, opts) {
    var guiModule, j, len, look, looks;
    looks = this.module.looks || [];
    looks.push('module-basic');
    for (j = 0, len = looks.length; j < len; j++) {
      look = looks[j];
      if (look === 'none') {
        return;
      }
      guiModule = Wanigui.modules[look];
      if (guiModule) {
        this.moduleBuilder = new guiModule.create(module, this.opts);
        return;
      }
    }
  };

  Wanigui.prototype.attachToInstrument = function(module, profile, opts) {
    var guiModule, j, len, look, looks;
    looks = this.module.instrumentLooks || [];
    looks.push('keyboard');
    for (j = 0, len = looks.length; j < len; j++) {
      look = looks[j];
      if (look === 'none') {
        return;
      }
      guiModule = Wanigui.modules[look];
      if (guiModule) {
        this.instrument = new guiModule.create(module, this.opts);
        return;
      }
    }
  };

  Wanigui.prototype.attachToAudioParam = function(module, name, param, opts) {
    var guiModule, j, len, look, looks;
    looks = param.looks || [];
    looks.push('knob');
    for (j = 0, len = looks.length; j < len; j++) {
      look = looks[j];
      if (look === 'none') {
        return;
      }
      guiModule = Wanigui.modules[look];
      if (guiModule) {
        this.audioParams[name] = new guiModule.create(module, name, param, opts);
        return;
      }
    }
  };

  Wanigui.prototype.attachToParam = function(module, name, param, opts) {
    var guiModule, j, len, look, looks;
    looks = param.looks || [];
    looks.push('knob');
    for (j = 0, len = looks.length; j < len; j++) {
      look = looks[j];
      guiModule = Wanigui.modules[look];
      if (guiModule) {
        this.params[name] = new guiModule.create(module, name, param, opts);
        return;
      }
    }
  };

  Wanigui.prototype.applyPreset = function(name) {
    var preset, ref, ref1, results, value;
    preset = this.profile.presets[name];
    ref = preset.audioParams;
    for (name in ref) {
      value = ref[name];
      this.audioParams[name].value = value;
    }
    ref1 = preset.params;
    results = [];
    for (name in ref1) {
      value = ref1[name];
      results.push(this.params[name].value = value);
    }
    return results;
  };

  Wanigui.prototype.build = function() {
    return this.moduleBuilder.build(this);
  };

  window.Wanigui = Wanigui;

}).call(this);
