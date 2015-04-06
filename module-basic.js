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
    var $group, $inner, $inst, $parameters, $section, $select, $title, $toggle, audioParam, fn, group, groups, i, len, name, param, params, profile, ref, ref1, ref2, that, values;
    that = this;
    profile = this.module.profile;
    $inner = $('<div class="wanigui-module" />');
    $section = $('<section class="wanigui-module-wrapper" />').append($inner);
    $toggle = $('<span />').text('-').addClass('wanigui-toggle-params').on('click', function() {
      $parameters.toggle();
      return $(this).text($(this).text() === '+' ? '-' : '+');
    });
    $title = $('<h1 />').addClass('wanigui-module-title').append($toggle).append($('<span />').addClass('wanigui-module-name').text(this.profile.name)).appendTo($inner);
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
      $select.appendTo($title);
    }
    if (wanigui.instrument) {
      $inst = wanigui.instrument.build();
      $inst.addClass('wanigui-inst');
      $inner.append($inst);
    }
    $parameters = $('<div />').addClass('wanigui-parameters');
    groups = {
      ZZZZZ__other: []
    };
    ref1 = wanigui.audioParams;
    for (name in ref1) {
      audioParam = ref1[name];
      console.log(name, audioParam);
      group = profile.audioParams[name].group || 'ZZZZZ__other';
      if (groups[group] == null) {
        groups[group] = [];
      }
      groups[group].push({
        name: name,
        param: audioParam
      });
    }
    ref2 = wanigui.params;
    for (name in ref2) {
      param = ref2[name];
      group = profile.params[name].group || 'ZZZZZ__other';
      if (groups[group] == null) {
        groups[group] = [];
      }
      groups[group].push({
        name: name,
        param: param
      });
    }
    for (group in groups) {
      params = groups[group];
      if (group === 'ZZZZZ__other') {
        group = 'other';
      }
      $group = $('<div class="wani-param-group" />').addClass('group-' + group);
      if (group !== 'other') {
        $group.append($('<h2 />').text(group));
      }
      for (i = 0, len = params.length; i < len; i++) {
        param = params[i];
        $group.append(param.param.build());
      }
      $group.appendTo($parameters);
    }
    return $section.append($parameters);
  };

  Wanigui.registerModule({
    name: 'module-basic',
    create: ModuleBasic,
    stylesheet: '\n.wanigui-module-wrapper {\n  width: 590px;\n  background-color: #f84;\n  border: 1px solid #888;\n  background-color: #808a90;\n  color: #fff;\n  position: relative;\n  width: 100%;\n  margin: 2px;\n  text-align: center;\n}\n\n.wanigui-module-title {\n  height: 30px;\n}\n\n.wanigui-module-name {\n  position: absolute;\n  left: 24px;\n}\n\n.wanigui-module h1 {\n  color: #fff;\n  padding: 3px 3px 3px 20px;\n  margin: 8px 2px;;\n  font-size: 16px;\n  text-align: left;\n}\n\nselect.presets {\n  border: 1px solid #fff;\n  color: #def;\n  width: 120px;\n  background-color: #678;\n  font-size: 10px;\n  font-weight: bold;\n  padding: 2px 10px;\n  position: absolute;\n  right: 8px;\n}\n\n.wanigui-toggle-params {\n  margin: 0 6px;\n  cursor: pointer;\n  position: absolute;\n  left: 3px;\n}\n\n.wanigui-inst {\n  display: inline-block;\n  margin: 5px 0;\n}\n\n.wanigui-parameters {\n  text-align: left;\n  padding: 8px;\n}\n\n.wani-param-group {\n  position: relative;\n  display: inline-block;\n  margin-bottom: 10px;\n}\n\n.wani-param-group h2 {\n  font-size: 10px;\n  text-align: center;\n  margin: 2px;\n  color: #abc;\n  border-bottom: 1px solid #abc;\n}\n\n.wani-module .js-remove-module {\n  float: right;\n  position: absolute;\n  right: 5px;\n  top: 5px;\n  color: #def;\n}\n\n.wani-module .js-toggle-knobs {\n  position: absolute;\n  left: 5px;\n  top: 5px;\n  color: #def;\n}\n'
  });

}).call(this);
