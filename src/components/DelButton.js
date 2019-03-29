/**
 * @name DelButton.js
 * @auhor 曾粒宗
 * @date 2019.3.6
 * @desc 解除绑定按钮公有组件
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
require('../css/global.css');

export default class DelButton extends BaseComponent{
	
	constructor(props){
		super(props);
	}

	render(){
		let thiz = this;
		return(
			<div>
				<button className="cr-delete-card" onClick={thiz.props.delHandler?thiz.props.delHandler:()=>{}}>{thiz.props.title?thiz.props.title:""}</button>
			</div>
		)
	}
}
