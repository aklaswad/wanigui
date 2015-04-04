'use strict'

### SYNOPSIS

builder = Wanigui(module, opts);
$yourModuleWrapperJQueryObject.append( builder.build() );

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
  @profile = profile = module.profile
  @attachToModule module, profile, opts
  @attachToInstrument module, profile, opts if profile.type is 'synth'
  for name, param of profile.audioParams
    @attachToAudioParam module, name, param, @opts
  for name, param of profile.params
    @attachToParam module, name, param, @opts
  @

Wanigui::attachToModule = (module, profile, opts) ->
  looks = @module.looks or []
  looks.push 'module-basic' #fallback ...ya, this was required
  for look in looks
    guiModule = Wanigui.modules[look]
    if guiModule
      @moduleBuilder = new guiModule.create module, @opts
      return

Wanigui::attachToInstrument = (module, profile, opts) ->
  looks = @module.instrumentLooks or []
  looks.push 'keyboard' #fallback ...is required? should ignore?
  for look in looks
    guiModule = Wanigui.modules[look]
    if guiModule
      @instrument = new guiModule.create module, @opts
      return

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

Wanigui::build = () ->
  @moduleBuilder.build.apply @

window.Wanigui = Wanigui
