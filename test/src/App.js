import React, { Component } from 'react'
import './App.css'
import { range } from 'lodash'
import pull from '../../src/index.js'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	componentDidMount() {
		let that= this
		pull
		.on('step',function(pulled) {
			console.log('pulled:',pulled)
			that.setState({
				pulled:pulled
			})
		})
		.on('pull',function(next) {
			console.log('pull')
			setTimeout(_=>{
				next()
			},2000)
		})
		.init()
	}
	render() {
		let { pulled } = this.state
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
			</div>
		)
	}
}

export default App
