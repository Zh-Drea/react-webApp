/**
 * @name IssueMatter.js
 * @auhor 曾粒宗
 * @date 2019.3.6
 * @desc 发布素材界面
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
import DelButton from '../components/DelButton';
import {Link} from 'react-router-dom';
import conf from '../config';

require('../css/global.css');

export default class IssueMatter extends BaseComponent{
	
	constructor(props){
		super(props);
		this.state ={
			isShow:false,
			height:window.document.body.clientHeight
		};
		this.token = this.get("token"); 
	}

	reloadHeight = () => {
    	this.setState({height: window.document.body.clientHeight})
	}

	upload(imgurl){
		let thiz = this;

	}

	componentDidMount() {
		let thiz = this;
    	window.addEventListener('resize', this.reloadHeight);
    	window.onGetImg = function(path){

    	};
    	window.onUploadImg = function(data){
    		let img = JSON.parse(data);
    		if(img.resourceFullAddress){
    			thiz.$("#add").before("<div id='uploadImg"+img.id+"' class='upload-img' data-item='"+data+"' style='width:80px;height:80px;float:left;margin-right:10px;margin-bottom:10px;position:relative;'><img style='width:80px;height:80px' src='"+img.resourceFullAddress+"'/><img onclick='$(this).parent().remove()' style='position:absolute;width:18px;height:18px;top:-7px;right:-7px;' src='"+require("../images/del.png")+"'/></div>");
    		}
    	};
	}

	componentWillUnmount() {
    	window.removeEventListener('resize', this.reloadHeight)
	}

	// 提交表单
	commit(){
		let thiz = this;
		let name = thiz.$("#goodsName").val();
		let content = thiz.$("#goodsContent").val();
		let imgs = thiz.$(".upload-img");

		if(!name){thiz.toast("请输入商品名称");return;}
		if(!content){thiz.toast("请输入要发布的内容");return;}

		// 判断有没有上传图片
		if(imgs.length==0){
			thiz.toast("请选择图片");
			return;
		}

		if(imgs.length<3){
			thiz.toast("最少添加三张图片");
			return;
		}

		let imgUrl = [];
		for(let i=0;i<imgs.length;i++){
			let item = thiz.$(imgs[i]).data("item");
			// alert("-------i--------",item);
			imgUrl.push(item.id);
		}
		// alert("-------imgUrl--------"+JSON.stringify(imgUrl));
		
		thiz.ajax("promotionMaterial/save",{
			data:JSON.stringify(
				{
				  "attachmentIds": imgUrl,
				  "content": content,
				  "goodsName": name
				}
			),
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){
					thiz.toast("发布成功");
					// 设置数据
					thiz.save("add_material_success","YES");
					// 清空发布的数据
					setTimeout(function(){
						thiz.goBack();
					},200);
				}

			},
			error:function(err){
				thiz.toast(JSON.stringify(err));
			}
		});
	}

	// 添加图片
	getImg(){
		let thiz = this;
		// 调用原生的图片选择
		window.postMessage(JSON.stringify({
			op:"getImg"
		}));
	}

	// 上传图片
	// upload(){
		// let thiz = this;
		// //图片格式验证
  //     	var x = thiz.$("#file")[0];
  //     	if (!x || !x.value) return;
  //     	var patn = /\.jpg$|\.jpeg$|\.png$/i;
  //     	if (!patn.test(x.value)) {
  //         	alert("您选择的似乎不是图像文件。");
	 //        x.value = "";
	 //        return;
	 //    }

	 //    alert("--------"+thiz.$("#file")[0]);
	 //    let formData = new FormData();
	 //    formData.append("file",x);
	 //    formData.append("attachmentOrigin","CLIENT");

  //       thiz.$.ajax({
	 //        url: conf.uploadURL,
	 //        type: 'POST',
	 //        headers:{
		// 		"JWT-USER-Authorization":thiz.token,
	 //        },
	 //        cache:false,
	 //        data:formData,
	 //        processData: false,
	 //        contentType: false,
	 //        dataType:"json",
	 //        success:function(ret) {
	 //        	alert("--------upload_ret--------"+JSON.stringify(ret));
	 //        },
	 //        error:function(err){
	 //        	alert("--------err--------"+JSON.stringify(err));
	 //        }
	 //    });

	// }

	render(){
		let thiz =this;
		return(
			<div className="mbc-all" style={{width:'100%',backgroundColor:'white'}}>
				<div className="mbc-header">
					<NavTop title="发布素材"
					leftIcon={require("../images/back.png")} 
					rightIcon={require("../images/help_black.png")}
					leftHandler={()=>{
						thiz.goBack();
					}}
					rightHandler={()=>{
						// alert("right");
					}}/>
				</div>

				<div style={{width:'100%',height:2,backgroundColor:'white'}}></div>

				<div className="mbc-container" style={{backgroundColor:'#FFFFFF',position:'relative',paddingLeft:20,paddingRight:20,
					width:"calc(100% - 45px)",overflow:"visible"}}>

					<div className="im-cross" style={{marginTop:56,marginBottom:5,}}>
						<div className=""><span style={{fontSize:15}}>商品名称</span></div>
						<div className=""><span style={{color:'#B6B6B6',fontSize:13}}>最多60个字符</span></div>
					</div>
					<div><input maxlength={60} id="goodsName" style={{width:'calc(100% - 20px)',backgroundColor:'#F1F1F1',padding:10,fontSize:14,}} placeholder="请输入商品名称"></input></div>	
					<div className="im-cross" style={{marginTop:30,marginBottom:5,}}>
						<div className=""><span style={{fontSize:15}}>发布内容</span></div>
						<div className=""><span style={{color:'#B6B6B6',fontSize:13}}>最多140个字符</span></div>
					</div>
					<div><textarea maxlength={140} id="goodsContent" style={{height:130,width:'calc(100% - 20px)',backgroundColor:'#F1F1F1',padding:10,
						outline:"none",border:"none",fontSize:14,}} placeholder="请输入需要发布的内容"></textarea></div>	
					<div className="im-cross" style={{marginTop:20}}>
						<div className=""><span style={{fontSize:15}}>添加图片</span></div>
						<div className=""><span style={{color:'#B6B6B6',fontSize:13,marginRight:13}}>最少添加三张</span></div>
					</div>

					<div style={{marginTop:20,}}>

						<div id="add" style={{backgroundColor:"#EEEEEE",textAlign:"center",width:80,height:80,float:"left",position:"relative"}} onClick={()=>{
							thiz.getImg();
						}}>
							<img style={{width:40,height:40,marginTop:20,}} src={require("../images/add.png")}/>
						</div>
						<div style={{clear:"both"}}></div>

					</div>

				</div>

				<button className="cr-delete-card" style={{color:'black',width:'100%',position:'fixed',backgroundColor:'#FFC859',zIndex:1,opacity:1,bottom:0,}}
					onClick={()=>{
						thiz.commit();
					}}>提交素材</button>

			</div>
		)
	}
}
