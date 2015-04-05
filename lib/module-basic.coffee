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
  $toggle = $('<span />')
    .text '-'
    .addClass 'wanigui-toggle-params'
    .on 'click', ()->
      $parameters.toggle()
      $(this).text( if $(this).text() == '+' then '-' else '+' )
  $title = $('<h1 />')
    .addClass('wanigui-module-title')
    .append $toggle
    .append $('<span />').addClass('wanigui-module-name').text(@profile.name)
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
    $select.appendTo $title
  if wanigui.instrument
    $inst = wanigui.instrument.build()
    $inst.addClass 'wanigui-inst'
    $inner.append $inst

  # Grouping
  $parameters = $('<div />').addClass('wanigui-parameters')
  groups = {ZZZZZ__other: []}
  for name, audioParam of wanigui.audioParams
    console.log name,audioParam
    group = profile.audioParams[name].group || 'ZZZZZ__other'
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
    $group.appendTo $parameters
  $section.append $parameters

Wanigui.registerModule
  name: 'module-basic'
  create: ModuleBasic
  stylesheet: '''

.wanigui-module-wrapper {
  width: 590px;
  background-color: #f84;
  border: 1px solid #888;
  background-color: #808a90;
  color: #fff;
  position: relative;
  width: 100%;
  margin: 2px;
  text-align: center;
}

.wanigui-module-title {
  height: 30px;
}

.wanigui-module-name {
  position: absolute;
  left: 24px;
}

.wanigui-module h1 {
  color: #fff;
  padding: 3px 3px 3px 20px;
  margin: 8px 2px;;
  font-size: 16px;
  text-align: left;
}

select.presets {
  border: 1px solid #fff;
  color: #def;
  width: 120px;
  background-color: #678;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 10px;
  position: absolute;
  right: 8px;
}

.wanigui-toggle-params {
  margin: 0 6px;
  cursor: pointer;
  position: absolute;
  left: 3px;
}

.wanigui-inst {
  display: inline-block;
  margin: 5px 0;
}

.wanigui-parameters {
  text-align: left;
  padding: 8px;
}

.wani-param-group {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
}

.wani-param-group h2 {
  font-size: 10px;
  text-align: center;
  margin: 2px;
  color: #abc;
  border-bottom: 1px solid #abc;
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
