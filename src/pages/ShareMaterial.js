/**
 * @name ShareMaterial.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 分享素材
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

export default class ShareMaterial extends BaseComponent{

	constructor(props){
		super(props);
		this.state = {
			nbH:46,
			query:this.props.location.query?this.props.location.query:{},
			isShow:false,
			isSlide:true
		}
	}

	ajust(){
		let thiz = this;
		let w = thiz.$(".show-img").width();
		thiz.$(".show-img").height(w);
	}

	componentDidMount(){
		let thiz = this;
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.setState({
			nbH:nbH
		});

		if(thiz.state.query.attachments){
			thiz.ajust();
		}
	}

	downloadImg(){
		let thiz = this;

		// 判断输入内容
		let content = thiz.$("#content").val();
		if(!content){
			thiz.toast("请输入分享内容");
			return;
		}

		// 获取所有连接
		let urls = [];
		let imgs = thiz.$(".show-img");
		for(let i=0;i<imgs.length;i++){
			urls.push(thiz.$(imgs[i]).data("url"));
		}
		if(urls.length>0){
			if(window.postMessage){
				let data = {
					op:"downImg",
					url:urls,
				}
				window.postMessage(JSON.stringify(data));
			}
		}
	}

	share(type){// type可以是session或者timeline
		let thiz = this;

		// 获取图片和文字
		let urls = [];
		let imgs = thiz.$(".show-img");
		for(let i=0;i<imgs.length;i++){
			urls.push(thiz.$(imgs[i]).data("url"));
		}

		let content = thiz.$("#content").val();

		window.postMessage(JSON.stringify({
			op:"share",
			type:type,
			url:urls,
			content:content,
		}));
	}

	render(){
		let thiz = this;
		return (
			<div>

				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")}
				title="分享素材" 
				leftHandler={()=>{
					thiz.goBack();
				}}
				rightHandeler={()=>{

				}}/>

				<div id="contentShareMaterial" style={{paddingTop:thiz.state.nbH,position:thiz.state.isSlide ? 'absolute':'fixed',width:'100%'}}>

					<div id="contentCover" style={{marginTop:10,}}>
						<div style={{backgroundColor:"white",padding:15,}} onClick={()=>{
							if (thiz.state.show) {
								alert(1);
								thiz.setState({isShow:false})
							}
							else{

							}
						}}>
							<div style={{display:"inline-block",width:40,}}>
								<img style={{width:40,height:40,borderRadius:"50%"}} src={(function(){
									return thiz.state.query.user&&thiz.state.query.user.headImageAttachment&&thiz.state.query.user.headImageAttachment.resourceFullAddress?thiz.state.query.user.headImageAttachment.resourceFullAddress:require("../images/avatar.png");
								})()}/>
								<span style={{display:thiz.state.query.user&&thiz.state.query.user.userType.indexOf("VIP")>=0?"inline-block":"none",fontSize:11,color:"#FF9529",
								backgroundColor:"#1F1F1F",height:12,width:"calc(100% - 6px)",marginLeft:2,top:-15,borderRadius:6,
								textAlign:"center",position:"relative",}}><span style={{position:"relative",top:0,fontStyle:"italic"}}>{thiz.state.query.user&&thiz.state.query.user.userType.indexOf("VIP")>=0?thiz.state.query.user.userType:""}</span></span>
							</div>
							<div style={{display:"inline-block",marginLeft:10,width:"calc(100% - 50px)",verticalAlign:"top"}}>
								<div style={{marginTop:10,}}>
									<label>{thiz.state.query.user&&thiz.state.query.user.nickname?thiz.state.query.user.nickname:""}</label>
									
									<div style={{position:"relative",width:"100%"}}>
										
										<textarea maxlength={140} id="content" style={{marginTop:10,fontSize:18,width:"calc(100% - 20px)",padding:10,outline:"none",
										appearance:"none",height:100,border:"none",backgroundColor:"#eee"}} placeHolder="请输入分享内容">
											{thiz.state.query.content}
										</textarea>

										<div style={{width:"100%",textAlign:"right"}}>
											<div style={{fontSize:12,color:"#bbb"}}>最多140个字符</div>
										</div>
									</div>
									
									<div style={{paddingTop:15,paddingBottom:15,backgroundColor:"white",width:"calc(100% - 0px)",}}>
										{
											thiz.state.query.attachments&&thiz.state.query.attachments.length>0?thiz.state.query.attachments.map(function(o,i){
												let rt = null;
												return (
													<img class="show-img" data-url={o.resourceFullAddress} style={{width:"27%",marginRight:10,backgroundColor:"white",float:"left",marginBottom:10,}} src={o.resourceFullAddress}/>
												);
											}):null
										}
										<div style={{clear:"both"}}></div>
									</div>
								</div>
								<div>
									<button style={{height:30,paddingLeft:10,paddingRight:10,borderRadius:15,border:"1px solid black",
									fontSize:14,}}
										onClick={()=>{
											thiz.downloadImg();
										}}>仅下载图片</button>

									<button style={{height:30,paddingLeft:10,paddingRight:10,borderRadius:15,border:"1px solid black",
									fontSize:14,marginLeft:20,}}
										onClick={()=>{
											// thiz.downloadImg();
											if (thiz.$("#content").val()) {
												thiz.setState({isShow:true,isSlide:false});
											}
										}}>下载图片并分享</button>
								</div>
							</div>
						</div>
					</div>
					
					<div id="buttonHig" style={{display:thiz.state.isShow?"block": "none",position:'fixed',backgroundColor:'rgba(0,0,0,0.6)',zIndex:10001,top:0,width:"100%",height:window.document.body.clientHeight}}
						onClick={()=>{
							thiz.setState({isShow:false,isSlide:true});
						}}>
						
						<div style={{position:"relative",width:"100%",height:"100%",backgroundColor:"transparent"}}>

							<div style={{position:"absolute",bottom:0,width:"100%",zIndex:10002}}>

								<button className="cr-delete-card" style={{color:'#000000',backgroundColor:"white"}} onClick={(e)=>{
									e.stopPropagation();
									thiz.downloadImg();
									thiz.share("timeline");
									thiz.setState({isShow:false,isSlide:true});

								}}>微信朋友圈</button>

								<button className="cr-delete-card" style={{marginTop:10,color:'#000000',backgroundColor:"white"}} onClick={(e) =>{
									e.stopPropagation();
									thiz.downloadImg();
									thiz.share("session");
									thiz.setState({isShow:false,isSlide:true});

								}}>微信好友</button>

							</div>

						</div>

					</div>

				</div>

			</div>
		);
	}

}

