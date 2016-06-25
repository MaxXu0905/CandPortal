var video = document.getElementById("video");
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
if (navigator.getUserMedia) {
    if (navigator.webkitURL) {
        navigator.getUserMedia("video", function (stream) {
            video.src = window.webkitURL.createObjectURL(stream);
        }, function (error) { alert(error); });
    }
    else {
        navigator.getUserMedia("video", function (stream) {
            video.src = window.webkitURL.createObjectURL(stream);
        }, function (error) { alert(error); });
    }
}
else {
    alert("navigator.getUserMedia");
}
function scamera() {
    var videoElement = document.getElementById('video');
    var canvasObj = document.getElementById('canvas1');
    var context1 = canvasObj.getContext('2d');
    context1.fillStyle = "#ffffff";
    context1.fillRect(0, 0, 320, 240);
    context1.drawImage(videoElement, 0, 0, 320, 240);
    //alert("PaiZhaoSuccess");
}

function showImgCode() {
    var canvasObj = document.getElementById('canvas1');
    var imgData = canvasObj.toDataURL();
    var b64 = imgData.substr(22);
    alert(b64);
    document.getElementById("textB64").value = b64;
}


function uploadPhoto()//上传拍照的图片
{
    showImgCode();
    request = createRequest();
    if (request == null) {
        alert("Unable to create request");
    }
    else {
        alert("request.OK");
        var base64Data = document.getElementById('textB64').value.replace(/\+/g, "%2B"); //对参数中的+号编码，防止丢失
        var url = "AJAX/UploadPic.aspx";
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("&img=" + base64Data);
        request.onreadystatechange = responses;
    }
}
function responses() {
    if (request.readyState == 4)//服务器处理结束
    {
        if (request.status == 200)//一切正常
        {
            if (request.responseText == "OK") {
                alert("上传成功！");
            }
            else {
                alert("上传失败！");
                alert(request.responseText);
            }
        }
    }
}