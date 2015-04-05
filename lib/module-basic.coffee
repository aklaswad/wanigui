ModuleBasic = (module,opts) ->
  @module = module
  @profile = module.profile
  @opts = opts
  @

ModuleBasic:: = Object.create Wanigui::

ModuleBasic::build = (wanigui) ->
  that = @
  profile = @module.profile
  $inner = $('<div class="wanigui-module" />');
  $section = $('<section class="wanigui-module-wrapper" />').append($inner)

  $('<h1 />')
    .addClass('.wanigui-module-name')
    .text @profile.name
    .appendTo $inner
  if profile.type == 'synth'
    $inner.addClass('wanigui-synth')
  if profile.presets
    $select = $ '<select class="presets"/>'
    for name,values of profile.presets
      do (name) ->
        $option = $ '<option />'
          .text name
          .appendTo $select
    $select.on 'change', ->
      wanigui.applyPreset $select.val()
    $select.appendTo $inner
  if wanigui.instrument
    $inst = wanigui.instrument.build()
    $inst.addClass 'wanigui-inst'
    $inner.append $inst

  # Grouping
  groups = {__other: []}
  for name, audioParam of wanigui.audioParams
    console.log name,audioParam
    group = profile.audioParams[name].group || '__other'
    groups[group] = [] unless groups[group]?
    groups[group].push {name: name,param: audioParam}
  for name, param of wanigui.params
    group = profile.params[name].group || 'ZZZZZ__other'
    groups[group] = [] unless groups[group]?
    groups[group].push {name: name,param: param}

  for group, params of groups
    group = 'other' if group == 'ZZZZZ__other'
    $group = $ '<div class="wani-param-group" />'
      .addClass 'group-' + group
    $group.append $('<h2 />').text(group) unless group == 'other'
    for param in params
      $group.append param.param.build()
    $group.appendTo $section
  $section

Wanigui.registerModule
  name: 'module-basic'
  create: ModuleBasic
  stylesheet: '''

.wanigui-module-wrapper {
  width: 290px;
  background-color: #f84;
  border: 1px solid #888;
  background-color: #808a90;
  color: #fff;
  position: relative;
  width: 100%;
  margin: 2px;
}

.wanigui-module-name {
  display: block;
  width: 100%;
  text-align: center;
}

.wanigui-module.wanigui-synth {
  background-color: #80908a;
}

.wanigui-module h1 {
  color: #fff;
  padding: 3px 3px 3px 20px;
  margin: 8px 2px;;
  font-size: 16px;
}

.wanigui-inst {
  margin: 5px 0;
}

.wani-param-group {
  position: relative;
  width: 100%;
  display: inline-block;
  border-bottom: 1px solid #678;
}

.wani-param-group h2 {
  font-size: 10px;
  text-align: center;
  margin: 2px;
}

.wani-module .js-remove-module {
  float: right;
  position: absolute;
  right: 5px;
  top: 5px;
  color: #def;
}

.wani-module .js-toggle-knobs {
  position: absolute;
  left: 5px;
  top: 5px;
  color: #def;
}

'''
