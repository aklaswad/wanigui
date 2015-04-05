Keyboard = (module,profile,opts) ->
  @init module,profile,opts
  @

Keyboard::init = (module, profile, opts) ->
  @destination = module
  @width = 256
  @height = 80

Keyboard::Defaults =
  keyWidth: 17
  width: 256
  height: 32

Keyboard::build = () ->
  $box = $('<div />')
    .addClass 'wani-kb'
    .css
      height: @height
      width: @width
  @$keyboard = $box
  @buildKeyboard $box, 48
  $box

Keyboard::buildKeyboard = ($elem,from) ->
  kb = @
  width = @width
  height = @height
  keys = 25
  from = 48
  blackNotes =
    1: 1
    3: 1
    6: 1
    8: 1
    10: 1

  isBlack = (n) ->
    blackNotes[n % 12]
  whites = {}
  blacks = {}
  wi = 0 #white key based index
  i = 0
  nn = from
  # before creating elements, make map for black keys and white keys
  while nn < keys + from
    if isBlack(nn)
      blacks[wi] = nn
    else
      whites[wi++] = nn
    i++
    nn++
  keyWidth = width / wi

  # then, we can run loop with place based index
  for pos in [0..wi-1]
    noteNumber = blacks[pos]
    continue unless noteNumber
    do (noteNumber,pos) ->
      $('<div />')
        .addClass('wani-kb-bk wani-kb-key wani-kb-key-' + noteNumber)
        .css(
          width: keyWidth * 0.7
          height: height * 0.6
          left: pos * keyWidth - keyWidth * 0.35)
        .on 'mousedown', ()->
          kb.onmousedown noteNumber
          return false
        .appendTo $elem

  for pos in [0..wi-1]
    noteNumber = whites[pos]
    do (noteNumber,pos) ->
      $('<div />')
        .addClass('wani-kb-wk wani-kb-key wani-kb-key-' + noteNumber)
        .css(
          width: keyWidth
          height: height - 2
          left: pos * keyWidth)
        .on 'mousedown', ()->
          kb.onmousedown noteNumber
          return false
        .appendTo $elem

Keyboard::onmousedown = (noteNumber) ->
  @noteOn noteNumber, 0.8
  unless @playing?
    $(document).addClass 'wani-no-select'
    @setNoteOffListeners()
  @playing = noteNumber

Keyboard::noteOn = (noteNumber,velocity) ->
  @$keyboard.find('.wani-kb-key-' + noteNumber).addClass('wani-kb-key-playing')
  @destination.noteOn(noteNumber,velocity);

Keyboard::noteOff = (noteNumber) ->
  noteNumber ?= @playing
  @$keyboard.find('.wani-kb-key-' + noteNumber).removeClass('wani-kb-key-playing')
  @destination.noteOff(noteNumber)

Keyboard::setNoteOffListeners = () ->
  kb = this
  @mouseup = ->
    kb.noteOff(kb.playing)
    kb.playing = null
    $(document).removeClass 'wani-no-select'
    kb.clearNoteOffListeners()
    false
  $(document).on 'mouseup', @mouseup
  @$keyboard.on 'mouseleave', ->
    kb.noteOff(kb.playing)
    false
  @$keyboard.find('.wani-kb-key').on 'mouseenter', ->
    kb.noteOff(kb.playing)
    $(this).trigger 'mousedown'
    false
  return

Keyboard::clearNoteOffListeners = () ->
  $(document).off 'mouseup', @mouseup
  @$keyboard.off 'mouseleave'
  @$keyboard.find('.wani-kb-key').off 'mouseenter'

__style = '''
.wani-no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.wani-grabbing {
  cursor: move !important;
}

.wani-kb {
  height: 70px;
  width: 256px;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  cursor: pointer;
  background-color: #abc;
}

.wani-kb-wk {
  position: absolute;
  top: 0px;
  border-right: 1px solid #abc;
  border-bottom: 2px solid #424033;
  background-color: #ddd;
  border-radius: 0 0 2px 2px;
  z-index: 2;
}

.wani-kb-bk {
  height: 60%;
  position: absolute;
  top: 0px;
  border-right: 1px solid #abc;
  background-color: #444;
  border-radius: 0 0 2px 2px;
  z-index: 4;
}

.wani-kb-bk:hover {
  background-color: #777;
}

.wani-kb-wk:hover {
  background-color: #aaa;
}

.wani-kb-key-playing {
  background-color: #abc !important;
}

.wani-kb-key-playing.wani-kb-wk {
  z-index: 3;
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
  box-shadow: 0 0 5px #def;
}

.wani-kb-key-playing.wani-kb-bk {
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
  box-shadow: 0 0 5px #def;
}

'''

Wanigui.registerModule
  name: 'keyboard'
  create: Keyboard
  stylesheet: __style

