
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

export default class PageOne extends BaseComponent{

	constructor(props){
		super(props);
	}

	componentDidMount(){
		let thiz = this;
		this.listen("goBack",function(ret){
			thiz.log("--------goBack--------",ret);
		});
	}

	render(){
		let thiz = this;
		let param = {name:"PageOne"};
		let query = {
			pathname:"/PageTwo",
			query:{name:"PageOne"}
		};
		let state = {
			pathname:"/PageTwo",
			state:{name:"PageOne"}
		};
		return (
			<div>
				<div id="pageone" style={{fontSize:30}}>当前页面是：PageOne</div>
				<Link to={query}>跳转到PageTwo（query传参）>></Link>
				<Link to={state}>跳转到PageTwo（state传参）>></Link>

				<div onClick={()=>{
					thiz.navigate(state);
				}}>点击navigate</div>

			</div>
		);
	}

}

