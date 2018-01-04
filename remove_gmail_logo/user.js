// ==UserScript==
// @name         Remove Gmail logo
// @namespace    http://eugenesia.net/
// @version      0.1.1
// @description  Remove Gmail logo from the browser.
// @match        https://mail.google.com/*
// @author       Eugene Sia <eugene@eugenesia.co.uk>
// @copyright    2018+, Eugene Sia
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';
  // Wait a few seconds for the logo to load, as it loads asynchronously.
  setTimeout(function(){
    // Logo <img> ends with 'logo.gif'.
    var logoImg = document.querySelector('img[src*="logo.gif"]');
    if (logoImg !== null) {
      logoImg.src = '';
      console.log('Logo set to empty string.');
    }
    else {
      console.log('Logo img element not found.');
    }
  }, 5000);
})();

