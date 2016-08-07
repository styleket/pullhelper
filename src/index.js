var EventEmitter = require('event-emitter')
var emitter = new EventEmitter()
import 'scrollingelement'

var exports = {
	y:0,
	step:0,
	touch:false,
	lock:false
}

var loop = (function() {
	if(!this.touch && this.step > 0) {
		this.step = Math.floor(this.step/2)
		emitter.emit('step',this.step)
		window.requestAnimationFrame(loop)
	}
}).bind(exports)

var start = (function(evt) {
	if(this.lock) return
	this.y = evt.touches ? evt.touches[0].clientY : evt.clientY
	this.step = -document.scrollingElement.scrollTop
	this.touch = true
}).bind(exports)

var end = (function(evt) {
	var that = this
	if(that.lock) return
	that.lock = true
	emitter.emit('pull',that.step,function() {
		that.lock = false
		that.touch = false
		loop()
	})
}).bind(exports)

var move = (function(evt) {
	if(this.lock) return
	var y = evt.touches ? evt.touches[0].clientY : evt.clientY
	var step = this.touch ? this.step + y - this.y : 0
	if(step > 0) evt.preventDefault()
	if(this.touch && step !== this.step) {
		this.step = step
		this.y = y
		emitter.emit('step',Math.max(0,this.step))
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
	document.body.addEventListener('mousedown',start)
	document.body.addEventListener('mousemove',move)
	document.body.addEventListener('mouseup',end)
	return exports
}

module.exports = exports
