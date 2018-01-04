// ==UserScript==
// @name         OWA new email notification
// @namespace    http://eugenesia.net/
// @version      0.1.8
// @description  Show a Google Chrome notification on new emails in Outlook Web Access.
// @match        https://outlook.office365.com/owa/*
// @match        https://outlook.office.com/owa/*
// @author       Eugene Sia <eugene@eugenesia.co.uk>
// @copyright    2016+, Eugene Sia
// @grant        GM_notification
// @run-at       document-idle
// ==/UserScript==

(function() {
  "use strict";

  var lastUnreadCount = 0;

  // Check for updates every few seconds.
  setInterval(checkUnreadChange, 15000);


  // Main function checking for new mails.
  function checkUnreadChange() {

    var unreadCount = getInboxUnreadCount();

    // Number of unreads increased, there is new mail!
    if (unreadCount > lastUnreadCount) {
      var latestMail = getInboxFirstUnreadMail();

      if (latestMail) {
        GM_notification(latestMail.subject, "New mail from " + latestMail.from, null);
      }
    }

    // There was a change in the unread count, record the new unread count so
    // we can detect further changes.
    if (unreadCount !== lastUnreadCount) {
      lastUnreadCount = unreadCount;
    }
  }


  // Get the count of unread emails in Inbox.
  function getInboxUnreadCount() {
    // Element containing a span and text e.g. "468 Unread"
    // The unread count span is sibling of the "Inbox" text.
    var unreadElem = document.querySelector("[title=Inbox] ~ [id$=ucount]");

    if (! unreadElem) {
      return 0;
    }

    // Get the latest unread count, and compare to what we had before.
    var unreadCount = parseInt(unreadElem.innerText);

    return unreadCount;
  }


  // Get the first mail in the inbox.
  function getInboxFirstUnreadMail() {

    var mailListHeader = document.querySelector(".folderHeaderLabel");

    // Only get the first mail if the mail list is for the Inbox folder.
    if (! (mailListHeader && mailListHeader.innerText === "Inbox")) {
      return null;
    }

    // Wrappers for conversations.
    var convos = document.querySelectorAll("[data-convid]");

    var fromText = '';
    var subjText = '';

    for (var convo of convos) {
      if (isConvoUnread(convo)) {
        var fromElem = convo.querySelector(".lvHighlightFromClass");
        var subjElem = convo.querySelector(".lvHighlightSubjectClass");

        return {
          from: fromElem.innerText,
          subject: subjElem.innerText,
        };
      }
    }

    // No unread convo found.
    return null;
  }


  // Check if conversation is unread (has any unread emails).
  // @param HtmlDom convoWrapper: Wrapper div for the convo with attrib
  // 'data-convid'.
  function isConvoUnread(convoWrapper) {
    // Read convos have a wrapper div with class '_lvv_y'.
    if (convoWrapper.querySelector('._lvv_y')) {
      return false;
    }
    else {
      // Unread email within the convo.
      return true;
    }
  }

})();
