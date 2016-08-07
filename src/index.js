var EventEmitter = require('event-emitter')
var emitter = new EventEmitter()

var exports = {
	cnt:0,
	touch:false,
	lock:false
}

var loop = (function() {
	if(!this.touch && this.cnt > 0) {
		this.cnt = Math.floor(this.cnt/2)
		emitter.emit('step',this.cnt)
		window.requestAnimationFrame(loop)
	}
}).bind(exports)

var start = (function(evt) {
	if(this.lock) return
	if(document.scrollingElement.scrollTop !== 0) return
	this.touch = true
	this.y = evt.touches[0].clientY
}).bind(exports)

var end = (function(evt) {
	var that = this
	if(that.lock) return
	if(that.cnt >= 100) {
		that.lock = true
		emitter.emit('pull',function() {
			that.lock = false
			that.touch = false
			loop()
		})
	} else {
		that.touch = false
		loop()
	}
}).bind(exports)

var move = (function(evt) {
	//if(!this.touch) return
	if(this.lock) return
	var y = evt.touches[0].clientY
	var cnt = Math.min(Math.max(0,this.cnt + y - this.y),100)
	if(cnt > 0) evt.preventDefault()
	if(cnt !== this.cnt) {
		this.cnt = cnt
		this.y = y
		emitter.emit('step',this.cnt)
	}
}).bind(exports)

exports.on = function(type,listener) {
	emitter.on(type,listener)
	return exports
}
exports.init = function() {
	document.body.addEventListener('touchstart',start)
	document.body.addEventListener('touchmove',move)
	document.body.addEventListener('touchend',end)
	return exports
}

module.exports = exports
