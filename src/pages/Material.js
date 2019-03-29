/**
 * @name Material.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 推广素材
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

class Material extends BaseComponent{

	constructor(props){
		super(props);

		this.pageName = "Material";// 必须要定义
		this.reduxState = this.props.state[this.pageName];
		this.state = this.reduxState?this.reduxState:{
			nbH:46,
			records:[],
			hasMore:true,
			showMyself:false,
			curPage:0,

		};

		this.token = this.get("token");
		this.curPage = this.state.curPage;
		this.hasMore = this.state.hasMore;
		this.showMyself = this.state.showMyself;

		this.add_material_success = this.get("add_material_success");

		// alert("创建组件"+JSON.stringify(this.props.state[this.pageName]));
	}

	ajust(){
		let thiz = this;
		let w = thiz.$(".mimg").width();
		thiz.$(".mimg").height(w);
	}

	loadData(isForce){
		let thiz = this;
		thiz.curPage = 0;
		thiz.hasMore = false;

		thiz.ajax("promotionMaterial/getPage",{
			data:JSON.stringify({
				page:{
					pageSize:20,
					pageNumber:thiz.curPage+1,
				},
				showMyself:thiz.showMyself,
			}),
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){

					// 清除add_material_success
					thiz.remove("add_material_success");

					if(ret.data&&ret.data.records.length>0){
						thiz.changeState({
							records:ret.data.records,
							hasMore:ret.data.hasNext,
							curPage:ret.data.pageNumber,
						});
						thiz.hasMore = ret.data.hasNext;
						thiz.curPage = ret.data.pageNumber;

						thiz.ajust();

					}else{
						thiz.changeState({
							records:[],
							hasMore:ret.data.hasNext,
							curPage:ret.data.pageNumber,
						});
					}
				}
			},
			error:function(err){
				
			}
		},this.reduxState&&!isForce&&this.add_material_success!="YES"?"YES":"NO");
	}

	upToLoad(){

		let thiz = this;
		if(thiz.hasMore){
			thiz.ajax("promotionMaterial/getPage",{
				data:JSON.stringify({
					page:{
						pageSize:20,
						pageNumber:thiz.curPage+1,
					},
					showMyself:thiz.showMyself,
				}),
				headers:{
					"JWT-USER-Authorization":thiz.token,
				},
				success:function(ret){
					if(ret.respCode=="00"){
						if(ret.data&&ret.data.records.length>0){
							let rds = thiz.state.records;
							rds = rds.concat(ret.data.records);

							let data = JSON.stringify({
								records:rds,
								hasMore:ret.data.hasNext,
								curPage:ret.data.pageNumber,
							});
							// 解决设置state无效的问题
							thiz.emit(thiz.pageName+"upload",JSON.parse(data));

							thiz.hasMore = ret.data.hasNext;
							thiz.curPage = ret.data.pageNumber;

							thiz.ajust();
						}
					}
				},
				error:function(err){
					
				}
			},"NO");
		}
	}

	// 删除海报
	delete(id){
		let thiz = this;
		thiz.ajax("promotionMaterial/delete",{
			data:JSON.stringify({
				id:id,
			}),
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){
					thiz.toast("删除成功");
					// 刷新数据
					thiz.loadData(true);
				}
			},
			error:function(err){

			}
		});
	}

	componentDidMount(){
		let thiz = this;
		this.listen(thiz.pageName+"upload",function(msg,data){
			thiz.changeState(data);
		});
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.changeState({
			nbH:nbH
		});
		thiz.loadData();

		thiz.$(window).scroll(function () {
			if (thiz.$(window).scrollTop() == thiz.$(document).height() - thiz.$(window).height()) {
				thiz.upToLoad();
			}
		});
		thiz.ajust();
	}

	render(){
		let thiz = this;
		return (
			<div>

				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")}
				rightIcon={require("../images/more.png")}
				title="素材广场" 
				leftHandler={()=>{
					thiz.clearState();
					setTimeout(function(){
						thiz.goBack();
					},100);
				}}
				rightHandler={()=>{
					thiz.navigate({
						pathname:"/IssueMatter",
						query:{}
					});
				}}/>

				<div id="contentMaterial" style={{paddingTop:thiz.state.nbH,overflowX:"hidden"}}>

					<div style={{padding:15,}} 
						onClick={()=>{
							thiz.changeState({
								showMyself:!thiz.state.showMyself,
							});
							thiz.showMyself = !thiz.state.showMyself;
							thiz.loadData(true);
						}}>
						<div style={{display:"inline-block",padding:3,border:"1px solid #6E6E6E",borderRadius:"50%",
						verticalAlign:"middle"}}>
							<div style={{width:12,height:12,borderRadius:"50%",backgroundColor:"#F5BD51",opacity:thiz.state.showMyself?1:0}}></div>
						</div>
						<div style={{display:"inline-block",verticalAlign:"middle",marginLeft:5,color:""}}>只看自己的</div>
					</div>

					<div>
						{
							thiz.state.records&&thiz.state.records.length>0?thiz.state.records.map(function(item,index){
								return (
									<div key={index} style={{backgroundColor:"white",padding:15,borderBottom:"1px solid #eee"}}>
										<div style={{display:"inline-block",width:40,}}>
											<img style={{width:40,height:40,borderRadius:"50%"}} src={(function(){
												return item.user&&item.user.headImageAttachment&&item.user.headImageAttachment.resourceFullAddress?item.user.headImageAttachment.resourceFullAddress:require("../images/avatar.png");
											})()}/>

											<span style={{display:item.user&&item.user.userType.indexOf("VIP")>=0?"block":"none",fontSize:9,color:"#FF9529",
											backgroundColor:"#1F1F1F",height:12,marginLeft:0,marginTop:-10,borderRadius:6,
											textAlign:"center",position:"relative",zIndex:2,minWith:"calc(100%)"}}><span style={{position:"relative",top:0,fontStyle:"italic",}}>{item.user&&item.user.userType.indexOf("VIP")>=0?item.user.userType:""}</span></span>

										</div>
										<div style={{display:"inline-block",marginLeft:10,width:"calc(100% - 50px)",verticalAlign:"top"}}>
											<div style={{marginTop:10,}}>
												<label>
													{item.user?item.user.nickname:""}
												</label>
												<p style={{marginTop:10,fontSize:18,}}>{item.content}</p>
												<div style={{paddingTop:15,paddingBottom:15,backgroundColor:"white",width:"calc(100% - 0px)",}}>
													{
														item.attachments&&item.attachments.length>0?item.attachments.map(function(o,i){
															let rt = null;
															return (
																<img className="mimg" key={i} style={{width:"27%",marginRight:10,backgroundColor:"white",float:"left",marginBottom:10,}} src={o.resourceFullAddress}/>
															);
														}):null
													}
													<div style={{clear:"both"}}></div>
												</div>
											</div>
											<div>
												<label
													onClick={()=>{
														if(item.self){
															thiz.delete(item.id);
														}else{
															thiz.toast("只能删除自己发布的");
														}

													}} style={{color:"#B7B7B7",fontSize:12,}}>{item.createDatetime?item.createDatetime:""}<span style={{marginLeft:20,color:"rgb(83,97,139)",display:item.canDelete?"inline":"none"}}>删除</span></label>
												<div style={{float:"right"}}
													onClick={()=>{
														thiz.navigate({
															pathname:"/ShareMaterial",
															query:item
														})
													}}>
													<img style={{width:20,height:20,marginRight:5,verticalAlign:"middle",borderRadius:"50%"}} src={require("../images/my_share.png")}/>
													<label style={{fontSize:12,color:"#424242"}}>去分享</label>
												</div>
											</div>
									</div>
								</div>
								);
							}):null
						}
					</div>

					<thiz.Nomore show={!thiz.state.hasMore}></thiz.Nomore>
				</div>

			</div>
		);
	}

}

Material = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(Material);
export default Material;

