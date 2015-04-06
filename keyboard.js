(function() {
  var Keyboard, __style;

  Keyboard = function(module, profile, opts) {
    this.init(module, profile, opts);
    return this;
  };

  Keyboard.prototype.init = function(module, profile, opts) {
    this.destination = module;
    this.width = 256;
    return this.height = 80;
  };

  Keyboard.prototype.Defaults = {
    keyWidth: 17,
    width: 256,
    height: 32
  };

  Keyboard.prototype.build = function() {
    var $box;
    $box = $('<div />').addClass('wani-kb').css({
      height: this.height,
      width: this.width
    });
    this.$keyboard = $box;
    this.buildKeyboard($box, 48);
    return $box;
  };

  Keyboard.prototype.buildKeyboard = function($elem, from) {
    var blackNotes, blacks, fn, height, i, isBlack, j, k, kb, keyWidth, keys, nn, noteNumber, pos, ref, ref1, results, whites, wi, width;
    kb = this;
    width = this.width;
    height = this.height;
    keys = 25;
    from = 48;
    blackNotes = {
      1: 1,
      3: 1,
      6: 1,
      8: 1,
      10: 1
    };
    isBlack = function(n) {
      return blackNotes[n % 12];
    };
    whites = {};
    blacks = {};
    wi = 0;
    i = 0;
    nn = from;
    while (nn < keys + from) {
      if (isBlack(nn)) {
        blacks[wi] = nn;
      } else {
        whites[wi++] = nn;
      }
      i++;
      nn++;
    }
    keyWidth = width / wi;
    fn = function(noteNumber, pos) {
      return $('<div />').addClass('wani-kb-bk wani-kb-key wani-kb-key-' + noteNumber).css({
        width: keyWidth * 0.7,
        height: height * 0.6,
        left: pos * keyWidth - keyWidth * 0.35
      }).on('mousedown', function() {
        kb.onmousedown(noteNumber);
        return false;
      }).appendTo($elem);
    };
    for (pos = j = 0, ref = wi - 1; 0 <= ref ? j <= ref : j >= ref; pos = 0 <= ref ? ++j : --j) {
      noteNumber = blacks[pos];
      if (!noteNumber) {
        continue;
      }
      fn(noteNumber, pos);
    }
    results = [];
    for (pos = k = 0, ref1 = wi - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; pos = 0 <= ref1 ? ++k : --k) {
      noteNumber = whites[pos];
      results.push((function(noteNumber, pos) {
        return $('<div />').addClass('wani-kb-wk wani-kb-key wani-kb-key-' + noteNumber).css({
          width: keyWidth,
          height: height - 2,
          left: pos * keyWidth
        }).on('mousedown', function() {
          kb.onmousedown(noteNumber);
          return false;
        }).appendTo($elem);
      })(noteNumber, pos));
    }
    return results;
  };

  Keyboard.prototype.onmousedown = function(noteNumber) {
    this.noteOn(noteNumber, 0.8);
    if (this.playing == null) {
      $(document).addClass('wani-no-select');
      this.setNoteOffListeners();
    }
    return this.playing = noteNumber;
  };

  Keyboard.prototype.noteOn = function(noteNumber, velocity) {
    this.$keyboard.find('.wani-kb-key-' + noteNumber).addClass('wani-kb-key-playing');
    return this.destination.noteOn(noteNumber, velocity);
  };

  Keyboard.prototype.noteOff = function(noteNumber) {
    if (noteNumber == null) {
      noteNumber = this.playing;
    }
    this.$keyboard.find('.wani-kb-key-' + noteNumber).removeClass('wani-kb-key-playing');
    return this.destination.noteOff(noteNumber);
  };

  Keyboard.prototype.setNoteOffListeners = function() {
    var kb;
    kb = this;
    this.mouseup = function() {
      kb.noteOff(kb.playing);
      kb.playing = null;
      $(document).removeClass('wani-no-select');
      kb.clearNoteOffListeners();
      return false;
    };
    $(document).on('mouseup', this.mouseup);
    this.$keyboard.on('mouseleave', function() {
      kb.noteOff(kb.playing);
      return false;
    });
    this.$keyboard.find('.wani-kb-key').on('mouseenter', function() {
      kb.noteOff(kb.playing);
      $(this).trigger('mousedown');
      return false;
    });
  };

  Keyboard.prototype.clearNoteOffListeners = function() {
    $(document).off('mouseup', this.mouseup);
    this.$keyboard.off('mouseleave');
    return this.$keyboard.find('.wani-kb-key').off('mouseenter');
  };

  __style = '.wani-no-select {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n}\n\n.wani-grabbing {\n  cursor: move !important;\n}\n\n.wani-kb {\n  height: 70px;\n  width: 256px;\n  position: relative;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n  cursor: pointer;\n  background-color: #abc;\n}\n\n.wani-kb-wk {\n  position: absolute;\n  top: 0px;\n  border-right: 1px solid #abc;\n  border-bottom: 2px solid #424033;\n  background-color: #ddd;\n  border-radius: 0 0 2px 2px;\n  z-index: 2;\n}\n\n.wani-kb-bk {\n  height: 60%;\n  position: absolute;\n  top: 0px;\n  border-right: 1px solid #abc;\n  background-color: #444;\n  border-radius: 0 0 2px 2px;\n  z-index: 4;\n}\n\n.wani-kb-bk:hover {\n  background-color: #777;\n}\n\n.wani-kb-wk:hover {\n  background-color: #aaa;\n}\n\n.wani-kb-key-playing {\n  background-color: #abc !important;\n}\n\n.wani-kb-key-playing.wani-kb-wk {\n  z-index: 3;\n  border-left: 1px solid #fff;\n  border-right: 1px solid #fff;\n  border-bottom: 1px solid #fff;\n  box-shadow: 0 0 5px #def;\n}\n\n.wani-kb-key-playing.wani-kb-bk {\n  border-left: 1px solid #fff;\n  border-right: 1px solid #fff;\n  border-bottom: 1px solid #fff;\n  box-shadow: 0 0 5px #def;\n}\n';

  Wanigui.registerModule({
    name: 'keyboard',
    create: Keyboard,
    stylesheet: __style
  });

}).call(this);
