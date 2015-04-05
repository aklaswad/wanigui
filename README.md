# wanigui

GUI Builder for [wani](http://aklaswad.github.io/wani)

[DEMO](http://aklaswad.github.io/wanigui)

# SYNOPSIS

You can provide gui parts as same as wani

```
function MyInstrumentGUI(module,profile,options) {
  // prepare something for wani module instance
}

MyInstrumentGUI.prototype.build = function () {
  var $keyboard = $('<div />');
  // do dom stuff, and returns it
  return $keyboard;
}

Wanigui.registerModule({
  name: "MyInstrumentGUI",
  create: MyInstrumentGUI,
  stylesheet: rawStyleSheetAsString
});
```

and use it in webpage

```
<script src="some-instrument.js"></script>
<script src="my-instrument-gui.js"></script>
<script>
  var inst = Wani.createModule('SomeInstrument');
  var gui  = new Wanigui(inst);
  var dom  = gui.build();
  $('#placeholder').append( dom );
</script>
```

# Disclaimer

This software is still alpha quality. We may change APIs without notice.

# Author

aklaswad

# License

MIT
