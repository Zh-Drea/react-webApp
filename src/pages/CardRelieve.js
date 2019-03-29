/**
 * @name CardRelieve.js
 * @auhor 曾粒宗
 * @date 2019.3.5
 * @desc 银行卡(默认)解除绑定
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
import DelButton from '../components/DelButton';
import {Link} from 'react-router-dom';
require('../css/global.css');

export default class CardRelieve extends BaseComponent{
	
	constructor(props){
		super(props);
		this.state = {
			isShow:false,
			isSlide:true
		}
	}
 
	render(){
		let thiz =this;
		let state = {
		pathname:"/CardAdd",
		stateAdd:{name:"组件"}
		};
		return(
			<div style={{marginTop:200}}>
				<p>我是网页</p>
			</div>
		)
	}
}
