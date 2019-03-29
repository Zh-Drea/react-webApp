/**
 * @name ShareMatter.js
 * @auhor 曾粒宗
 * @date 2019.3.6
 * @desc 分享素材页面
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
require('../css/global.css');

export default class ShareMatter extends BaseComponent{
	
	constructor(props){
		super(props);

		this.state = {
			isShow : true
		}
	}

	render(){
		let thiz = this;
		return(
			<div>分享素材界面</div>
		)
	}
}
