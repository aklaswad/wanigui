ModuleBasic = (module) ->
  @module = module
  @

ModuleBasic::build = () ->
  profile = @module.profile
  $inner = $('<div class="wanigui-module" />');
  $section = $('<section class="wanigui-module-wrapper" />').append($inner)

  $('<h1 />')
    .addClass('.wanigui-module-name')
    .text @profile.name
    .appendTo $inner
  if profile.type == 'synth'
    $inner.addClass('wanigui-synth')
  if @instrument
    $inst = @instrument.build()
    $inst.addClass 'wanigui-inst'
    $inner.append $inst
  for audioParam in @audioParams
    $inner.append audioParam.build()
  for param in @params
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
