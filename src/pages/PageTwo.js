
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

export default class PageOne extends BaseComponent{

	constructor(props){
		super(props);

		// 打印参数
		this.log("--------PageOne_query--------",this.props.location.query);
		this.log("--------PageOne_state--------",this.props.location.state);

		this.state = {

		}

	}

	render(){
		let thiz = this;
		return (
	      	<div style={{width:"100%",backgroundColor:"red"}}>
				<div id="pagetwo" style={{fontSize:30}}>当前页面是：PageTwo</div>
				<a onClick={()=>{
					// thiz.goBack();
					// alert(thiz.$("#pagetwo").text());
					// thiz.ajax();
					thiz.emit("goBack","caocaocao");

					// 保存字符串
					// thiz.save("data","pagetwo");

					// thiz.remove("data");

					// thiz.log("--------data--------",thiz.get("data"));

					// if(!thiz.get("data")){
					// 	alert("数据无效");
					// }

				}}>返回PageOne</a>
			</div>
		);
	}

}

