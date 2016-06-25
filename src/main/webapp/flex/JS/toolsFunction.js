// JScript 文件
// 工具函数
// By SingleX 2012年1月22日11:15:19

//alert("toolStart");

//创建请求
function createRequest()
{
    try
    {
        request = new XMLHttpRequest();//For火狐，谷歌等浏览器
    }
    catch (tryMS)
    {
        try
        {
            request = new ActiveXObject("Msxm12.XMLHTTP");//For使用微软Msxm12.XMLHTTP库的浏览器
        }
        catch (otherMS)
        {
            try
            {
                request = new ActiveXObject("Microsoft.XMLHTTP");//For使用微软Microsoft.XMLHTTP库的浏览器
            }
            catch (failed)
            {
                request = null;
            }
        }
    }
    return request;
}
///判断输入是否为数组
function isArray(arg) 
{
    if (typeof arg == 'object') 
    {
        var crieria = arg.constructor.toString().match(/arrat/i);
        return (crieria != null)
    }
    else 
    {
        return false;
    }
}
///取Event对象，返回触发该事件的对象
function getActivatedObject(e) {
    var obj;
    if (!e) {
        obj = window.event.srcElement;//早期浏览器
    }
    else if (e.srcElement) {
        obj = e.srcElement; //IE7++
    }
    else {
        obj = e.target;//DOM Level2
    }
    return obj;
}
///DOM Level2添加事件用
function addEventHandler(obj, eventName, handler) 
{
    if (document.attachEvent) 
    {
        obj.attachEvent("on" + eventName, handler);
    }
    else if (document.addEventListener) 
    {
        obj.addEventListener(eventName, handler, false);   
    }
}