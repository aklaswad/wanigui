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
      console.log name,values
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

  for name, audioParam of wanigui.audioParams
    $inner.append audioParam.build()
  for name, param of wanigui.params
    $inner.append param.build()
  $section


Wanigui.registerModule
  name: 'module-basic'
  create: ModuleBasic
  stylesheet: '''

.wanigui-module-wrapper {
  width: 260px;
}

.wanigui-module {
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
