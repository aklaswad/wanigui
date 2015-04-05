(function() {
  var ModuleBasic;

  ModuleBasic = function(module, opts) {
    this.module = module;
    this.profile = module.profile;
    this.opts = opts;
    return this;
  };

  ModuleBasic.prototype = Object.create(Wanigui.prototype);

  ModuleBasic.prototype.build = function(wanigui) {
    var $inner, $inst, $section, $select, audioParam, fn, name, param, profile, ref, ref1, ref2, that, values;
    that = this;
    profile = this.module.profile;
    $inner = $('<div class="wanigui-module" />');
    $section = $('<section class="wanigui-module-wrapper" />').append($inner);
    $('<h1 />').addClass('.wanigui-module-name').text(this.profile.name).appendTo($inner);
    if (profile.type === 'synth') {
      $inner.addClass('wanigui-synth');
    }
    if (profile.presets) {
      $select = $('<select class="presets"/>');
      ref = profile.presets;
      fn = function(name) {
        var $option;
        return $option = $('<option />').text(name).appendTo($select);
      };
      for (name in ref) {
        values = ref[name];
        fn(name);
      }
      $select.on('change', function() {
        return wanigui.applyPreset($select.val());
      });
      $select.appendTo($inner);
    }
    if (wanigui.instrument) {
      $inst = wanigui.instrument.build();
      $inst.addClass('wanigui-inst');
      $inner.append($inst);
    }
    ref1 = wanigui.audioParams;
    for (name in ref1) {
      audioParam = ref1[name];
      $inner.append(audioParam.build());
    }
    ref2 = wanigui.params;
    for (name in ref2) {
      param = ref2[name];
      $inner.append(param.build());
    }
    return $section;
  };

  Wanigui.registerModule({
    name: 'module-basic',
    create: ModuleBasic,
    stylesheet: '\n.wanigui-module-wrapper {\n  width: 260px;\n}\n\n.wanigui-module {\n  border: 1px solid #888;\n  background-color: #808a90;\n  color: #fff;\n  position: relative;\n  width: 100%;\n  margin: 2px;\n}\n\n.wanigui-module-name {\n  display: block;\n  width: 100%;\n  text-align: center;\n}\n\n.wanigui-module.wanigui-synth {\n  background-color: #80908a;\n}\n\n.wanigui-module h1 {\n  color: #fff;\n  padding: 3px 3px 3px 20px;\n  margin: 8px 2px;;\n  font-size: 16px;\n}\n\n.wanigui-inst {\n  margin: 5px 0;\n}\n\n.wani-module .js-remove-module {\n  float: right;\n  position: absolute;\n  right: 5px;\n  top: 5px;\n  color: #def;\n}\n\n.wani-module .js-toggle-knobs {\n  position: absolute;\n  left: 5px;\n  top: 5px;\n  color: #def;\n}\n'
  });

}).call(this);
