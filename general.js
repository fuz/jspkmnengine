var NOISE = new RegExp(" |-","g") ;
// space bar and hyphen

function wordify(arrayName, di) {
for (var nw=0;nw<window[arrayName].length;nw++) {
	window[arrayName] [ window[arrayName][nw][di].toLowerCase() ] = nw ;
	}
		}

function wordify2(arrayName, di) {
for (var nw=0;nw<window[arrayName].length;nw++) {
	window[arrayName] [ window[arrayName][nw][di].toLowerCase().replace(NOISE,"") ] = nw ;
	}
		}
		
/************************************************************************
General Functions BELOW [ NOT ALL OF THESE ARE BY fuz] */

function getParams() {
	// Author: Beetle, codingforums.com - http://www.codingforums.com/showthread.php?t=4555
	var query, qs = top.location.search.substring(1);
	var queries = qs.split(/\&/);
	for (var i=0; i<queries.length; i++) {
		query = queries[i].split(/\=/);
		this[query[0]] = (typeof query[1] == 'undefined') ? null : unescape(query[1]).replace(/\+/g," ");
		}
	}
params = new getParams();

/*
   name - name of the cookie
   value - value of the cookie
   [expires] - expiration date of the cookie
     (defaults to end of current session)
   [path] - path for which the cookie is valid
     (defaults to path of calling document)
   [domain] - domain for which the cookie is valid
     (defaults to domain of calling document)
   [secure] - Boolean value indicating if the cookie transmission requires
     a secure transmission
   * an argument defaults when it is assigned null as a placeholder
   * a null placeholder is not required for trailing omitted arguments
*/

function setCookie(name, value, expires, path, domain, secure) {
name = sCookieName + name ; // fuz's Modification
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : undefined) +
      ((path) ? "; path=" + path : undefined) +
      ((domain) ? "; domain=" + domain : undefined) +
      ((secure) ? "; secure" : undefined);
  document.cookie = curCookie;
}


/*
  name - name of the desired cookie
  return string containing value of specified cookie or null
  if cookie does not exist
*/

function getCookie(name) {
  name = sCookieName + name ; // fuz's Modification
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}


/*
   name - name of the cookie
   [path] - path of the cookie (must be same as path used to create cookie)
   [domain] - domain of the cookie (must be same as domain used to
     create cookie)
   path and domain default if assigned null or omitted if no explicit
     argument proceeds
*/

function deleteCookie(name, path, domain) {
name = sCookieName + name // fuz's Modification
  if (getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : jsNothing) +
    ((domain) ? "; domain=" + domain : jsNothing) +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

// date - any instance of the Date object
// * hand all instances of the Date object to this function for "repairs"

function fixDate(date) {
  var base = new Date(0);
  var skew = base.getTime();
  if (skew > 0)
    date.setTime(date.getTime() - skew);
}


function isUndefined(a) {
    return typeof a == 'undefined';
}

/************************************************************************
* Copyright 2001 by Terry Yuen.
* Email: kaiser40@yahoo.com
* Last update: July 15, 2001.
* To implement this script onto your page, copy and paste the Javascript
* on this page and place it in the page that you want the encryption
* routine available on. Then use the function "encrypt()" to encrypt
* data. This function takes two parameters. The first parameter is the
* plain text string and the second parameter is the key. The returned
* string is the encrypted string. To decrypt the string, use the
* function "decrypt()" with the encrypted string as the first parameter
* and key as the second parameter. It returns the decrypted string.
*
* Examples:
* var secret = encrypt("My surprise will consist of ....", "password");
* document.writeln(secret);
*
* document.form[0].elements[1].value = decrypt(document.form[0].elements[0].value, "password");
*
*************************************************************************/

function encrypt(str, pwd) {
  if(pwd == null || pwd.length <= 0) {
    alert("Please enter a password with which to encrypt the message.");
    return null;
  }
  var prand = "";
  for(var i=0; i<pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString();
  }
  var sPos = Math.floor(prand.length / 5);
  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
  var incr = Math.ceil(pwd.length / 2);
  var modu = Math.pow(2, 31) - 1;
  if(mult < 2) {
    alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
    return null;
  }
  var salt = Math.round(Math.random() * 1000000000) % 100000000;
  prand += salt;
  while(prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
  }
  prand = (mult * prand + incr) % modu;
  var enc_chr = "";
  var enc_str = "";
  for(var i=0; i<str.length; i++) {
    enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
    if(enc_chr < 16) {
      enc_str += "0" + enc_chr.toString(16);
    } else enc_str += enc_chr.toString(16);
    prand = (mult * prand + incr) % modu;
  }
  salt = salt.toString(16);
  while(salt.length < 8)salt = "0" + salt;
  enc_str += salt;
  return enc_str;
}

function decrypt(str, pwd) {
  if(str == null || str.length < 8) {
    alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
    return;
  }
  if(pwd == null || pwd.length <= 0) {
    alert("Please enter a password with which to decrypt the message.");
    return;
  }
  var prand = "";
  for(var i=0; i<pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString();
  }
  var sPos = Math.floor(prand.length / 5);
  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
  var incr = Math.round(pwd.length / 2);
  var modu = Math.pow(2, 31) - 1;
  var salt = parseInt(str.substring(str.length - 8, str.length), 16);
  str = str.substring(0, str.length - 8);
  prand += salt;
  while(prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
  }
  prand = (mult * prand + incr) % modu;
  var enc_chr = "";
  var enc_str = "";
  for(var i=0; i<str.length; i+=2) {
    enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
    enc_str += String.fromCharCode(enc_chr);
    prand = (mult * prand + incr) % modu;
  }
  return enc_str;
}


