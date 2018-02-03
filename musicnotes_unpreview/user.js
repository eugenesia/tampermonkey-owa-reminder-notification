// ==UserScript==
// @name         Musicnotes unpreview
// @namespace    http://eugenesia.net/
// @version      1.1.0
// @description  Remove preview overlay from sheet music.
// @author       Eugene Sia <eugene@eugenesia.co.uk>
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://www.musicnotes.com/sheetmusic/mtd.asp?ppn=*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
  /* jshint esnext: false */
  /* jshint esversion: 6 */

  // Library that draws the notes on the canvas.
  let heliconSrc = document.querySelector('script[src*=Helicon]').src;

  // Make eval() work in global context
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
  const geval = eval;

  fetch(heliconSrc)
    .then(resp => {
      return resp.text();
    })
    .then(heliconScr => {
      // Remove preview overlay text.
      heliconScr = heliconScr
        .replace('Preview Only', '')
        .replace('Legal Use Requires Purchase', '')
        .replace('PREVIEW', '');

      geval(heliconScr);
    })
    .then(() => {
      // Embedded() is run on document.ready() and kickstarts note drawing.
      // Run it again to redraw.
      let embeddedScript = [...document.scripts].filter((scr) => {
        return scr.innerHTML.indexOf('Embedded') > -1;
      });

      let scriptTxt = embeddedScript[0].innerHTML;
      // Remove document.ready() so we can get the bare function.
      scriptTxt = scriptTxt
        .replace('$(document).ready(function () {', '')
        .replace('});', '');

      // Redraw notes.
      geval(scriptTxt);
    });

  // Make song window larger for screen capture or print.
  function expandSong() {
    let songDiv = document.querySelector('[class*=col-lg-5]');
    songDiv.className = songDiv.className.replace('col-lg-5', 'col-lg-12');
  }

  let expandBtn = document.createElement('button');
  let btnText = document.createTextNode('Expand');
  expandBtn.appendChild(btnText);

  document.querySelector('.controls').appendChild(expandBtn);

  expandBtn.addEventListener('click', expandSong);

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */

