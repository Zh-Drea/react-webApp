var config = {
  // BaseURL:"http://192.168.101.218:51002",// 开发
  BaseURL:"https://app.young-global.com"// 生产
};

var PAGE_URL={
  GET_ENABLE_LOGIN_REGISTER:config.BaseURL+'/coreApi/country/getEnableLoginRegister',
  GEN_VERIFYCODE:config.BaseURL+'/coreApi/kaptcha/genVerifyCode',
  SMS_SENDSINGLEMSG:config.BaseURL+'/coreApi/webApp/sms/sendSingleMsg',
  USER_REGISTER:config.BaseURL+'/coreApi/user/register',
  GET_APP_DOWNLOAD:config.BaseURL+'/coreApi/systemConfig/getWebappConfig'
};
//实例方法
var msg = new Message();

var myReg=/^[1][3,4,5,7,8][0-9]{9}$/;

var registerReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

//判断开关
var isErro;

var initPageDom = function(){

  $('.country-list').hide();
  //首次加载所有国家信息
  var countryData = $.sendRequest(PAGE_URL.GET_ENABLE_LOGIN_REGISTER);

  if (!checkRespCodeSuccess(countryData)) {
      msg.show(countryData.errDesc);
      return;
  }
  //默认第一个数据
  $('#countryId').attr('ref',countryData.data[0].id);

  $('#country-code-img').attr('src',countryData.data[0].imageAttachment.resourceFullAddress);

  $('.country-code').text(countryData.data[0].phoneNoCode);

  //点击国家tel,出现countryList

  $('body').click(function(){
      $('.country-list').hide();
  }); 

  $('#countryId').click(function(e){

      e.stopPropagation();

      if (countryData.data&&countryData.data.length > 0) {

          $('.country-list').show();

          $.each(countryData.data,function(index,value){

            var item = $('#template').clone().attr('ref',value.id).appendTo($('.country-list'));

            $(item).find('#cImg').attr('src',value.imageAttachment.resourceFullAddress);

            $(item).find('#cCode').text(value.phoneNoCode);

            $(item).click(function(){

              $('#countryId').attr('ref',$(item).attr('ref'));

              $('#country-code-img').attr('src',$(item).find('#cImg').attr('src'));

              $('.country-code').text($(item).find('#cCode').text());

              $('.country-list').hide();
            })
          });

          $('#template').hide();

      }
  });
  //加载邀请码http://192.168.0.131/register/templates/register.html?invitationCode=EWPLD0

  var res = getWebParam("invitationCode");

  $('#inviteCode').text(res);
};

var getWebParam = function(name){
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
};

//获取图形验证码
var getCode = function(){

  var res = $.sendRequest(PAGE_URL.GEN_VERIFYCODE);

  if(!checkRespCodeSuccess(res)){
    msg.show(res.errDesc);
    return;
  }

  $('#img-code').attr('src',res.data.bufferedImage).data('ref',res.data.uniqueId);
};
var index = 1;

//手机验证码
var initgetMsg = function (){

    $('#send-verCode').click(function(){

        if(!checkData("msg")){
          return;
        }

        if (index !== 1) {
           return;
        }

        var p = {
          phoneNoData:{
            countryId:$('#countryId').attr('ref'),
            phoneNo:$('#phone-number').val()
          },
          smsType:'REGISTER',
          verifyCodeParams:{
            uniqueId:$('#img-code').data('ref'),
            verifyCode:$('#graphic-verification-code').val()
          }
        };

        var res = $.sendRequest(PAGE_URL.SMS_SENDSINGLEMSG,JSON.stringify(p));

        if (!checkRespCodeSuccess(res)) {
          index = 1;
          $('#send-verCode').text("发送验证码");
          msg.show(res.errDesc);
          return;
        }

        index = 2;

        var a = 60;

        var timeOut = setInterval(()=>{ 
          $('#send-verCode').text("倒计时"+a+"s");
          a--;
          if (a === 0) {
            clearInterval(timeOut);
            index = 1;
            $('#send-verCode').text("发送验证码");
            }
        }, 1000);
     });
};

var req = 1;
//注册
var registerSaveDate = function(){
  
  $('#register-btn').click(function(){

    if(!checkData("register")){
      return;
    }

    var p = {
      invitationCode: $('#inviteCode').text(),
      password: $('#password').val(),
      phoneNoData:{
        countryId:$('#countryId').attr('ref'),
        phoneNo:$('#phone-number').val()
      },
      smsVerifyCode:$('#verification-code').val()
    };

    var res = $.sendRequest(PAGE_URL.USER_REGISTER,JSON.stringify(p));

    if (!checkRespCodeSuccess(res)) {
      msg.show(res.errDesc);
      return;
    }

    var plt = $.sendRequest(PAGE_URL.GET_APP_DOWNLOAD);

    if (!checkRespCodeSuccess(plt)) {
      msg.show(plt.errDesc);
      return;
    }
   
    if(plt.data.appDownloadImageAttachment.resourceFullAddress){

      $('<IMG>').addClass('return-img').attr('src',plt.data.appDownloadImageAttachment.resourceFullAddress).appendTo($('.placeholder-one'));
      
      $(".register-success-show").show();
      
      $('body').css({overflowY:"hidden"});
    }  
  })
};  

function ajust(){
  var image=new Image();//获取图片的宽高;
   image.src="../static/images/xiaoyangjiang-bg.png";
   var height=image.height;
   var width=image.width;
   var ratio=width/height;
   
   var Rwidth=document.body.clientWidth;
   var Rheight=Rwidth/ratio;
   $(".content").height(Rheight);
}

var checkData = function(req){
   
   var isErro = false;

  if (req === "register") {
    if (!$('#phone-number').val()) {
      msg.show("请输入手机号!");
      return isErro;
    }

    if (!$('#graphic-verification-code').val()){
      msg.show("请输入图形验证码!");
      return isErro;
    }

    if (!myReg.test($('#phone-number').val())) {
      msg.show('电话号码格式错误!');
      return isErro;
    }

    if(!$('#verification-code').val()){
      msg.show('请输入验证码!');
      return isErro;
    }

    if (!$('#password').val()) {
      msg.show('请输入密码!');
      return isErro;
    }

    if (!registerReg.test($('#password').val())) {
      msg.show('密码格式错误!');
      return isErro;
    }
  }
  else if( req === "msg"){
     if (!$('#phone-number').val()) {
          msg.show("请输入手机号!");
        return isErro;
      }

      if (!$('#graphic-verification-code').val()){
        msg.show("请输入图形验证码!");
        return isErro;
      }

      if (!myReg.test($('#phone-number').val())) {
        msg.show('电话号码格式错误!');
        return isErro;
      }
  }
  else{
    if (!$('#phone-number').val()) {
      return isErro;
    }

    if (!$('#graphic-verification-code').val()){
      return isErro;
    }

    if (!myReg.test($('#phone-number').val())) {
      return isErro;
    }

    if(!$('#verification-code').val()){
      return isErro;
    }

    if (!$('#password').val()) {
      return isErro;
    }

    if (!registerReg.test($('#password').val())) {
      return isErro;
    }
  }

  return true;
};

$(function(){

  ajust();

  initPageDom();

  getCode();

  $('#img-code').click(function(){

      getCode();
  });

  initgetMsg();

  registerSaveDate();

  $('input').on("input",function(){
      
      if (checkData("button")) {

        $('#register-btn').css({'backgroundColor':'#FED584'});
      }
      else{
        $('#register-btn').css({'backgroundColor':'#CCCCCC'});
      }
  })

});











































