'use strict'

### SYNOPSIS

$moduleGUI = Wanigui(module, opts);
$yourModuleWrapper.append( $moduleGui );
$module.

###


Wanigui = (module, opts) ->
  @init module, opts

Wanigui.modules = {}
Wanigui.registerModule = (profile) ->
  Wanigui.modules[profile.name] = profile
  if profile.stylesheet?
    sheet = $('<style />')    #hack to create new instance of CSSStyleSheet
      .appendTo($('head').eq(0)).get(0).sheet
    rules = profile.stylesheet.split(/}/).reverse()
    for rule,i in rules
      rule = rule.replace /^[\s\n]+/g, ''
      rule = rule.replace /^[\s\n]$/g, ''
      continue unless rule
      rule += '}' unless i == rules.length - 1
      sheet.insertRule rule,0

Wanigui::Defaults = {}

Wanigui::init = (module, opts) ->
  @opts = $.extend {}, @Defaults, opts
  @audioParams = []
  @params = []
  @module = module
  @instrument
  profile = module.profile
  @buildInstrumentInterface(module, opts) if profile.type is 'synth'
  for name, param of profile.audioParams
    @attachToAudioParam module, name, param, @opts
  for name, param of profile.params
    @attachToParam module, name, param, @opts
  @

Wanigui::attachToAudioParam = (module, name, param, opts) ->
  looks = param.looks or []
  looks.push 'knob' #fallback ...is required? should ignore?
  for look in looks
    guiModule = Wanigui.modules[look]
    if guiModule
      @audioParams.push( new guiModule.create(module,name,param,opts) )
      return

Wanigui::attachToParam = (module, name, param, opts) ->
  looks = param.looks or []
  looks.push 'knob' #fallback ...is required? should ignore?
  for look in looks
    guiModule = Wanigui.modules[look]
    if guiModule
      @params.push( new guiModule.create(module,name,param,opts) )
      return

Wanigui::buildInstrumentInterface = () ->
  looks = @module.looks or []
  looks.push 'keyboard' #fallback ...is required? should ignore?
  for look in looks
    guiModule = Wanigui.modules[look]
    if guiModule
      @instrument = new guiModule.create(@opts)
      return

Wanigui::build = () ->
  $box = $('<div />');
  $box.append @instrument.build() if @instrument
  for audioParam in @audioParams
    $box.append audioParam.build()
  for param in @params
    $box.append param.build()
  $box

WaniguiParam = (ctx, module, opts) ->
  @ctx = ctx
  @opts = $.extend {}, @Defaults, opts
  @init module, opts

WaniguiParam::attach = ->
  module[param].onchange = (value) ->
    $elem.change value
  $elem.onchange = (value) ->
    module[param].value = value

WaniguiParam::build = ->
  throw 'virtual method'

window.Wanigui = Wanigui
