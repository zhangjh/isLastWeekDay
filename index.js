var nodemailer = require('nodemailer');
var config = require("./config");

function isWeekDay(t){
    var day = new Date(t).getDay();
    if(day !== 0 && day !== 6){
        return true;
    }
    return false;
}

function getMonth(t){
    return new Date(t).getMonth();
}

function isNextMonth(curMonth,nextMonth){
    console.log("curMonth: ",curMonth + 1);
    console.log("nextMonth: ",nextMonth + 1);
    if(curMonth !== nextMonth){
        return true;
    }
    return false;
}

function isLastWeekDay(t){
    /*
    * 两种情况当前是月末最后一个工作日：
    * 1. 第二天就是下个月
    * 2. 当前是本月最后一个工作日
    * */
    if(isWeekDay(t)){
        var today = new Date(t);
        var intervalDay = 24 * 3600 * 1000;
        var curMonth = today.getMonth();
        var tomorrow = today.getTime() + intervalDay;
        var nextMonth = getMonth(tomorrow);

        if(!isWeekDay(tomorrow)){
            var flag = false;
            while(!isWeekDay(tomorrow)){
                if(isNextMonth(curMonth,getMonth(tomorrow))){
                    flag = true;
                    break;
                }
                tomorrow += intervalDay;
            }
            if(flag){
                console.log("当前不是月末最后一天，但是最后一个工作日");
                return true;
            }else {
                console.log("当前不是月末最后一天，也不是最后一个工作日");
                return false;
            }

        }else {
            if(isNextMonth(curMonth,nextMonth)){
                console.log("当前是月末最后一天且为工作日");
                return true;
            }
            return false;
        }
    }else {
        console.log("当前不是工作日");
        return false;
    }
}

function sendMail(){
    console.log("今天是月末最后一个工作日，请记得定投哦！");
    var transporter = nodemailer.createTransport("smtps://" + config.xuser + ":" + config.xpasswd + "@" + config.mailServer);
    var mailOptions = {
        from: config.fromEmail,
        to: config.toEmail,
        subject: config.subject,
        text: config.text
    };
    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            return console.log(err);
        }
        console.log("Message send: ",info.response);
    }); 
}

var today = new Date().getTime();
console.log("Today: ",new Date(today).getMonth()+1,"/",new Date(today).getDate());

if(isLastWeekDay(today)){
    //发送邮件提醒
    sendMail();
}
