Knob = (module, name, param, opts) ->
  @init module, name, param, opts

Knob::init = (module, name, param, opts) ->
  @module = module
  @name = name
  @param = param
  @opts = opts
  @isSelect = if param.values? then true else false
  @values = param.values
  @sense = opts.sense or 200
  if @isSelect
    @step = 1
    Object.defineProperty @, 'value',
      set: (v) ->
        idx = @values.indexOf(v)
        return if idx < 0
        @_value = idx
        @module[name] = v
        @rotate()
      get: () ->
        @values[@_value]
    @defaultValue = @values[0]
  else
    @min = param.range[0]
    @max = param.range[1]
    @step = @opts.step or @range / @sense
    Object.defineProperty @, 'value',
      set: (v) ->
        return unless @min <= v <= @max
        v = Math.round(v * 1/@step) * @step;
        @_value = v
        if @module[name].value? then @module[name].value = v else @module[name] = v
        @rotate()
      get: () ->
        @_value
    @defaultValue = if @module[name].value? then @module[name].value else @module[name]
  @

Knob.Defaults =
  min: 0
  max: 1

Knob::template = (t)->
  """
<div class="wani-knob-box wani-knob">
  <div class="wani-knob-inner">
    <h2 class="wani-knob-title">
      <span>#{t.title}</span>
    </h2>
    <canvas class="wani-knob-backsheet" width="160" height="160"></canvas>
    <div class="wani-knob-activevalue">#{t.value}</div>
    <div class="wani-knob-value">#{t.value}</div>
    <div class="wani-knob-knob">
      <div class="wani-knob-point"></div>
    </div>
  </div>
</div>
"""

Knob::build = () ->
  @opts = $.extend({}, Knob.Defaults, @param, @opts)
  @canvasMargin = 48
  @values = undefined
  @range = undefined

  @isSelect = @opts.values?
  if @isSelect
    @values = @opts.values
    @min = 0
    @max = @opts.values.length - 1
    @range = [
      0
      @opts.values.length - 1
    ]
    @multiplier = 0.05
    @_value = 0
    @step = 1

  else
    @values = @opts.range
    @min = @opts.range[0]
    @max = @opts.range[1]
    @range = Math.abs(@max - @min)
    @multiplier = @range / @sense
    @step = @opts.step or @range / 300

  @baseTheta = Math.PI * 240 / 360 * 2
  html = @template
    title: @name
    value: @value
  $box = $(html)
  @box = $box
  bs = ($box.find '.wani-knob-backsheet').get(0)
  bs.tipWidth = 52
  bs.tipHeight = 18
  bs.radius = (bs.width - bs.tipWidth) / 2
  ctx = bs.getContext '2d'
  ctx.fillStyle = '#889'
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  i = 0
  len = @values.length
  while i < len
    value = @values[i]
    #console.log value, bs, @baseTheta
    x = bs.width / 2 + bs.radius * Math.cos(@baseTheta - 2 * i / (len - 1) * Math.PI * 300 / 360)
    y = bs.height / 2 - bs.radius * Math.sin(@baseTheta - 2 * i / (len - 1) * Math.PI * 300 / 360)
    ctx.strokeStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo x, y
    ctx.lineTo bs.width / 2, bs.height / 2
    ctx.stroke()
    ctx.fillStyle = '#789'
    ctx.fillRect x - bs.tipWidth / 2, y - bs.tipHeight / 2, bs.tipWidth, bs.tipHeight
    ctx.strokeRect x - bs.tipWidth / 2, y - bs.tipHeight / 2, bs.tipWidth, bs.tipHeight
    ctx.fillStyle = '#fff'
    ctx.font = 'normal lighter 14px "Courier New", arial'
    ctx.fillText value, x, y, bs.tipWidth - 2
    i++
  $box.data 'wanigui-knob', @
  @value = @defaultValue
  $box

Knob::rotate = () ->
  return unless @box
  value = Math.round(@_value * 1/@step) * @step;
  range = Math.abs(@max - @min)
  rate = Math.abs(value - @min) / range
  rotate = 300 * ( rate - 0.5 )
  @box.find('.wani-knob-knob').css({ transform: 'rotate(' + rotate + 'deg)' })
  valueStr = if @isSelect then @value else @value.toFixed(6).substr(0,7)
  @box.find('.wani-knob-activevalue').text(valueStr);
  @box.find('.wani-knob-value').text(valueStr);


addGlobalEventHandler = (document)->
  $(document).on 'mousedown', '.wani-knob-knob', (evt) ->
    $('body').addClass 'wani-no-select wani-grabbing'
    $knob = $(this)
    $knob.addClass 'wani-knob-active'
    $box = $knob.parents '.wani-knob-box'
    knob = $box.data 'wanigui-knob'
    lastPos =
      x: evt.pageX
      y: evt.pageY
    lastValue = if knob.isSelect then knob._value else knob.value
    lastRoundedValue = lastValue
    $activeValue = $knob.siblings('.wani-knob-activevalue').show()
    $backsheet = $knob.siblings('.wani-knob-backsheet').show()
    $currentValue = $knob.siblings('.wani-knob-value').hide()
    listener = (evt) ->
      pos =
        x: evt.pageX
        y: evt.pageY
      d =
        x: pos.x - lastPos.x
        y: pos.y - lastPos.y
      # Hmm... what is the good knob?
      # var dist = Math.sqrt( Math.pow(d.x, 2) + Math.pow(d.y,2));
      # var radi = Math.atan(d.y / d.x);
      # for now, just use deltaY :p
      # TODO: some calc about step here
      value = lastValue - d.y * knob.multiplier
      value = knob.max if knob.max <= value
      value = knob.min if value <= knob.min
      lastPos = pos

      if knob.isSelect
        roundedValue = Math.round(value)
        if lastRoundedValue != roundedValue
          knob.value = knob.values[roundedValue]
          lastRoundedValue = roundedValue
      else
        knob.value = value if lastValue != value
      lastValue = value
      false

    $(document).on 'mousemove', listener
    $(document).on 'mouseup', ->
      $('body').removeClass 'wani-no-select wani-grabbing'
      $knob.removeClass 'wani-knob-active'
      $activeValue.hide()
      $backsheet.hide()
      $currentValue.show()
      $(document).off 'mousemove', listener
      true
    false
  return

__style = '''
.wani-knob-box {
  width: 64px;
  height: 64px;
  text-align: center;
  display: inline-block;
  margin-bottom: 16px;
}

.wani-knob-inner {
  position: relative;
  margin-left: -2px;
  width: 100%;
  height: 100%;
}

.wani-knob-backsheet {
  position: absolute;
  left: -48px;
  top: -48px;
  z-index: 300;
  display: none;
}

.wani-knob-knob {
  border: 1px solid #abc;
  z-index: 200;
}

.wani-knob-knob.wani-knob-active {
  box-shadow: 0 0 5px #def;
  border: 1px solid #fff;
  background-color: #abc;
  z-index: 400;
}

.wani-knob-knob.wani-knob-active .wani-knob-point {
  box-shadow: 0 0 5px #def;
  border: 1px solid #fff;
  background-color: #abc;
  z-index: 400;
}

.wani-knob-knob {
  position: absolute;
  left: 16px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #8f8073;
  cursor: pointer;
}

.wani-knob-point {
  position: absolute;
  left: 13px;
  top: 0px;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #f84;
  z-index: 9;
}

.wani-knob-title {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.wani-knob-title span {
  font-size: 11px;
  color: #fff;
  margin: 0;
  padding: 0;
  vertical-align: top;
  display: inline-block;
}

.wani-knob-value {
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: block;
  vertical-align: top;
  font-size: 0.8em;
  overflow: hidden;
}

.wani-knob-activevalue {
  position: absolute;
  bottom: -50px;
  width: 100%;
  z-index: 1000000;
  overflow: hidden;
  display: none;
  background-color: #789;
  color: #fff;
  border: 1px solid #def;
  text-align: center;
  height: 24px;
}




'''

addGlobalEventHandler(document)
Wanigui.registerModule(
  name: 'knob'
  create: Knob
  stylesheet: __style
)


