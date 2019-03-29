/**
 * @name NavTop.js
 * @auhor 曾粒宗
 * @date 2019.3.4
 * @desc 顶部公用的导航组件
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
require('../css/global.css');

export default class NavTop extends BaseComponent{

	/**
	 * 组件属性包括:
	 * leftIcon、leftHandler、title、rightIcon、rightHandler、rightText
	 */
	
	constructor(props){
		super(props);
		
		this.styles = {
			wrapper:{
				paddingTop:10+24,
				paddingBottom:10,
				width:"calc(100% - 20px)",
				backgroundColor:"white",
				position:"fixed",
				paddingLeft:10,
				paddingRight:10,
				zIndex:1000,
			},
			backIcon:{
				width:20,
				height:20,
				backgroundColor:"white",
				display:"inline-block",
				verticalAlign:"middle",
				opacity:this.props.leftIcon?1:0
			},
			title:{
				display:"inline-block",
				width:"calc(100%)",
				height:24,
				textAlign:"center",
				verticalAlign:"middle",
				fontSize:18,
				color:"#0A0A0A",
			},
			rightIcon:{
				width:26,
				height:26,
				backgroundColor:"white",
				display:(this.props.rightText||!this.props.rightIcon)?"none":"inline-block",
				verticalAlign:"middle",
			},
			rightText:{
				height:26,
				backgroundColor:"white",
				display:(this.props.rightIcon||!this.props.rightText)?"none":"inline-block",
				verticalAlign:"middle",
			}
		}
	}

	render(){
		let thiz = this;
		return(
			<div id="navBar" style={thiz.styles.wrapper}>
				<div style={{width:"100%",position:"relative"}}>
					{/*左图标*/}	
					<div style={{position:"absolute",width:"20%",left:0,backgroundColor:"white"
						,display:"inline-block",top:3,}}>
						<img style={thiz.styles.backIcon}
						src={thiz.props.leftIcon?thiz.props.leftIcon:""}
						onClick={thiz.props.leftHandler?thiz.props.leftHandler:()=>{}}/>
					</div>

					{/*title*/}
					<label style={thiz.styles.title}>
						{thiz.props.title?thiz.props.title:" "}
					</label>

					{/*右图标*/}
					<div style={{position:"absolute",width:"20%",right:0,backgroundColor:"white",textAlign:"right",top:2,}}>

						{
							thiz.props.rightIcon?(
								<img style={thiz.styles.rightIcon}
									src={thiz.props.rightIcon?thiz.props.rightIcon:""}
									onClick={thiz.props.rightHandler?thiz.props.rightHandler:()=>{}}/>
							):null
						}

						{/*右边文字*/}
						<label style={{fontSize:14,}}>{thiz.props.rightText?thiz.props.rightText:" "}</label>
					</div>
				</div>
			</div>

		)
	}
}
