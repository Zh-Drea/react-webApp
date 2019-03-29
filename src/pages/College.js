/**
 * @name College.js
 * @auhor 曾粒宗
 * @date 2019.3.7
 * @desc 商学院页面
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
require('../css/global.css');

export default class College extends BaseComponent{
	
	constructor(props){
		super(props);

		this.state = {
			isShow : false,
			isChange: false,
			cardNum: '1',
			cardPer: '2',
			cardIdent: '3'
		}
	}

	componentDidMount(){
		if (this.state.cardNum && this.state.cardPer && this.state.cardIdent) {

			this.setState({
				isChange: true
			})
		}
	}

	render(){
		let thiz = this;
		let queryIe = {
			pathname:"/CardIphone",
			queryDel:{name:"组件"}
		};
		return(
			<div className="mbc-all">
				<div className="mbc-header">
					<NavTop title="商学院"
					leftIcon={require("../images/back.png")} 
					leftHandler={()=>{
						thiz.goBack();
					}} 
					/>
				</div>
				<div className="mbc-container ca-container" style={{textAlign:'center'}}>
					<img src={require("../images/college.png")} style={{border:'1px dashed black',height:145,margin:'0 auto',marginTop:70}}></img>
					<p style={{fontSize:15,margin:'0 auto',marginTop:20}}>正在建设中，敬请期待。</p>
				</div>
			</div>
		)
	}
}
