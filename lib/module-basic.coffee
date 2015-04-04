ModuleBasic = (module) ->
  @module = module
  @

ModuleBasic::build = () ->
  $box = $('<div class="wanigui-module" />');
  $('<h2 />')
    .text @profile.name
    .appendTo $box
  $box.append @instrument.build() if @instrument
  for audioParam in @audioParams
    $box.append audioParam.build()
  for param in @params
    $box.append param.build()
  $box

Wanigui.registerModule
  name: 'module-basic'
  create: ModuleBasic
  stylesheet: '''
.wani-module {
  border: 1px solid #888;
  background-color: #808a90;
  color: #fff;
  position: relative;
  width: 256px;
  margin: 2px;
}

.wani-module.synth {
  background-color: #80908a;
}

.wani-module h1 {
  color: #fff;
  padding: 3px 3px 3px 20px;
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
