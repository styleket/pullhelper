var EventEmitter = require('event-emitter')
var allOff = require('event-emitter/all-off')
var emitter = new EventEmitter()
require('scrollingelement')

var exports = {
	y:0,
	cnt:0,
	step:0,
	touch:false,
	lock:false,
	paused:false
}

var loop = (function() {
	var that = this
	if(!that.touch && that.step > 0) {
		emitter.emit('stepback',that.step,function(nextStep) {
			that.step = nextStep
			emitter.emit('step',that.step)
			window.requestAnimationFrame(loop)
		})
	}
}).bind(exports)

var start = (function(evt) {
	if(this.paused) return
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
	if(this.paused) return
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
	if(this.paused) return
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

var defaultHandler = {}
defaultHandler['pull'] = (function(next) {
	next()
}).bind(exports)
defaultHandler['stepback'] = (function(step,next) {
	var nextStep = Math.floor(step - Math.min(10,step/2))
	next(nextStep)
}).bind(exports)

emitter.on('pull',defaultHandler['pull'])
emitter.on('stepback',defaultHandler['stepback'])

exports.on = function(type,listener) {
	if(defaultHandler[type]) {
		emitter.off(type,defaultHandler[type])
	}
	emitter.on(type,listener)
	return exports
}

exports.isPaused = (function() {
	return this.paused
}).bind(exports)

exports.pause = (function() {
	this.paused = true
	return this
}).bind(exports)

exports.resume = (function() {
	this.paused = false
	return this
}).bind(exports)

exports.load = function() {
	document.body.addEventListener('touchstart',start)
	document.body.addEventListener('touchmove',move)
	document.body.addEventListener('touchend',end)
	document.body.addEventListener('mousedown',start)
	document.body.addEventListener('mousemove',move)
	document.body.addEventListener('mouseleave',end)
	document.body.addEventListener('mouseup',end)
	return exports
}
exports.unload = function() {
	allOff(emitter)
	document.body.removeEventListener('touchstart',start)
	document.body.removeEventListener('touchmove',move)
	document.body.removeEventListener('touchend',end)
	document.body.removeEventListener('mousedown',start)
	document.body.removeEventListener('mousemove',move)
	document.body.removeEventListener('mouseleave',end)
	document.body.removeEventListener('mouseup',end)
	return exports
}

module.exports = exports
