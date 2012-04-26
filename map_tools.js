// obtained from http://www.codelifter.com/main/javascript/capturemouseposition1.html
// modified by fuz

// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

// If NS -- that is, !IE -- then set up for mouse capture
// if (!IE) document.captureEvents(Event.MOUSEMOVE)

function getMouseXY(e) {
var tempX = 0
var tempY = 0
  if (IE) { // grab the x-y pos.s if browser is IE
    tempX = event.clientX + document.body.scrollLeft
    tempY = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    tempX = e.pageX
    tempY = e.pageY
  }
  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0}
  if (tempY < 0){tempY = 0}
  // show the position values in the form named Show
  // in the text fields named MouseX and MouseY
  return [tempX,tempY] ;
}



function ElementPosition(param){
	// from Glenn http://codingforums.com/showthread.php?t=75188
  var x=0, y=0;
  var obj = (typeof param == "string") ? document.getElementById(param) : param;
  if (obj) {
    x = obj.offsetLeft;
    y = obj.offsetTop;
    var body = document.getElementsByTagName('body')[0];
    while (obj.offsetParent && obj!=body){
      x += obj.offsetParent.offsetLeft;
      y += obj.offsetParent.offsetTop;
      obj = obj.offsetParent;
    }
  }
  this.x = x;
  this.y = y;
}

function zxcMseDown(event, obj) {
 document.onmousemove = zxcMove ;
 zxcWWHS();
 zxcObj= obj
 zxcMse(event);
 zxcDragX=zxcMseX-zxcPos(zxcObj)[0];
 zxcDragY=zxcMseY-zxcPos(zxcObj)[1];
}
function zxcMove(event) {
	Panel( zxcDrag(event ) ) ;
}

function zxcMseUp() {
 document.onmousemove=null; zxcDragX=-1;  zxcDragY=-1;
}

function zxcDrag(event) {
 zxcMse(event);
// zxcObj.style.left=(zxcMseX-zxcDragX)+'px';
// zxcObj.style.top=(zxcMseY-zxcDragY)+'px';
return [zxcMseX-zxcPos(zxcObj)[0], zxcMseY-zxcPos(zxcObj)[1]+zxcWWHS()] ;
}

function zxcMse(event){
 if(!event) var event=window.event;
 if (document.all){ zxcMseX=event.clientX; zxcMseY=event.clientY; }
 else {zxcMseX=event.pageX; zxcMseY=event.pageY; }
}

function zxcWWHS(){
 if (document.all){
  zxcCur='hand';
  zxcWH=document.documentElement.clientHeight;
  zxcWW=document.documentElement.clientWidth;
  zxcWS=document.documentElement.scrollTop; //ie trans & strict
  if (zxcWH==0){
   zxcWS=document.body.scrollTop; //ie trans & strict
   zxcWH=document.body.clientHeight;
   zxcWW=document.body.clientWidth;
  }
 }
 else if (document.getElementById){
  zxcCur='pointer';
  zxcWH=window.innerHeight-15;
  zxcWW=window.innerWidth-15;
  zxcWS=0;//window.pageYOffset;
 }
 zxcWC=Math.round(zxcWW/2);
 return zxcWS;
}

function zxcPos(zxc){
 zxcObjLeft = zxc.offsetLeft;
 zxcObjTop = zxc.offsetTop;
 while(zxc.offsetParent!=null){
  zxcObjParent=zxc.offsetParent;
  zxcObjLeft+=zxcObjParent.offsetLeft;
  zxcObjTop+=zxcObjParent.offsetTop;
  zxc=zxcObjParent;
 }
 return [zxcObjLeft,zxcObjTop];
}






// findPosX and findPosY written by and obtained from
// Peter-Paul Koch - http://www.quirksmode.org/js/findpos.html
// Alex Tingle - http://blog.firetree.net/2005/07/04/javascript-find-position
function findPosX(obj)
  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1)
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
  }

  function findPosY(obj)
  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
    return curtop;
  }





