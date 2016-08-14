import React, { Component } from 'react'
import './App.css'
import { range } from 'lodash'
import pullhelper from '../../src/index.js'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			pulled:0
		}
	}
	componentDidMount() {
		let that= this
		pullhelper
		.on('stepback',function(step,next) {
			let nextStep = Math.floor(step - Math.min(step/3,20))
			next(nextStep)
		})
		.on('step',function(pulled) {
			console.log('pulled:',pulled)
			that.setState({
				pulled:pulled
			})
		})
		.on('pull',function(pulled,next) {
			console.log('pull')
			next()
		})
		.load()
	}
	render() {
		let { disabled,pulled } = this.state
		return (
			<div className='App'>
				<div style={{
					background:'red',
					height:pulled
				}} className='pull'/>
				<div className='rows'>
					{range(100).map(i => {
						return (
							<div key={i} className='row'>{i}</div>
						)
					})}
				</div>
				<button onClick={_=>{
					if(pullhelper.isPaused()) {
						pullhelper.resume()
					} else {
						pullhelper.pause()
					}
					this.setState({
						disabled:pullhelper.isPaused()
					})
				}}>Toggle:{disabled ? 'disabled' : 'enabled'}</button>
			</div>
		)
	}
}

export default App
