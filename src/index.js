var EventEmitter = require('event-emitter')
var emitter = new EventEmitter()
require('scrollingelement')

var exports = {
	y:0,
	cnt:0,
	step:0,
	touch:false,
	lock:false
}

var loop = (function() {
	if(!this.touch && this.step > 0) {
		this.step = Math.floor(this.step - Math.min(10,this.step/2))
		emitter.emit('step',this.step)
		window.requestAnimationFrame(loop)
	}
}).bind(exports)

var start = (function(evt) {
	if(this.lock) {
		evt.preventDefault()
		return
	}
	this.y = evt.touches ? evt.touches[0].clientY : evt.clientY
	this.cnt = 0
	this.step = -document.scrollingElement.scrollTop
	this.touch = true
}).bind(exports)

var end = (function(evt) {
	if(this.lock) {
		evt.preventDefault()
		return
	}
	var that = this
	that.lock = true
	emitter.emit('pull',that.step,function() {
		that.lock = false
		that.touch = false
		loop()
	})
}).bind(exports)

var move = (function(evt) {
	if(this.lock) {
		evt.preventDefault()
		return
	}
	var y = evt.touches ? evt.touches[0].clientY : evt.clientY
	var step = this.touch ? this.step + y - this.y : 0
	if(step > 0) evt.preventDefault()
	if(this.touch && step !== this.step) {
		this.cnt++
		this.step = step
		this.y = y
		if(this.cnt === 1) {
			emitter.emit('start')
		}
		emitter.emit('step',Math.max(0,this.step))
	}
}).bind(exports)

exports.on = function(type,listener) {
	emitter.on(type,listener)
	return exports
}
exports.load = function() {
	document.body.addEventListener('touchstart',start)
	document.body.addEventListener('touchmove',move)
	document.body.addEventListener('touchend',end)
	document.body.addEventListener('mousedown',start)
	document.body.addEventListener('mousemove',move)
	document.body.addEventListener('mouseup',end)
	return exports
}
exports.unload = function() {
	emitter.allOff()
	document.body.removeEventListener('touchstart',start)
	document.body.removeEventListener('touchmove',move)
	document.body.removeEventListener('touchend',end)
	document.body.removeEventListener('mousedown',start)
	document.body.removeEventListener('mousemove',move)
	document.body.removeEventListener('mouseup',end)
	return exports
}

module.exports = exports
