// ==UserScript==
// @name         OWA reminder notification
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Popup reminders from Outlook OWA.
// @match        https://outlook.office.com/owa/*
// @match        https://outlook.office365.com/owa/*
// @author       Eugene Sia <eugene@eugenesia.co.uk>
// @copyright    2017+, Eugene Sia
// @grant        GM_notification
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';


  var lastReminderCount = 0;

  // Check for updates every few seconds.
  setInterval(checkReminderChange, 15000);


  // Main function checking for new reminders.
  function checkReminderChange() {

    var reminderCount = countReminders();

    // Number of reminders increased, there is a new reminder!
    if (reminderCount > lastReminderCount) {
      var latestReminder = getLatestReminder();

      // E.g. 'Overdue by 17 Min (15:00 - 15:25)\nRoom number 5'.
      var popupText = (latestReminder.isOverdue ? 'Overdue by ' : 'Upcoming in ') +
        latestReminder.timeToStart +
        ' (' + latestReminder.timeDuration + ')\n' +
        latestReminder.venue;

      GM_notification(popupText, 'Reminder: ' + latestReminder.title);
    }

    // There was a change in the count, record the new count so
    // we can detect further changes.
    if (reminderCount !== lastReminderCount) {
      lastReminderCount = reminderCount;
    }
  }


  // Count the number of notification popups.
  function countReminders() {
    return document.querySelectorAll('.o365cs-notifications-notificationPopup .o365cs-notifications-reminders-flexpaneitem').length;
  }


  // Get the latest reminder and return data about the reminder.
  function getLatestReminder() {

    var reminders = document.querySelectorAll('.o365cs-notifications-notificationPopup .o365cs-notifications-reminders-flexpaneitem');
    var latestReminder = reminders[0];

    // Get fields for the reminder.
    var title = latestReminder.querySelector('.o365cs-notifications-reminders-title').innerText;

    // Countdown to event start e.g. '11 Min'.
    var timeToStartValue = latestReminder.querySelector('.o365cs-notifications-toastReminders-timeToStartValue').innerText;
    var timeToStartUnit = latestReminder.querySelector('.o365cs-notifications-reminders-timeToStartUnit').innerText;

    // Time duration e.g. '15:00 - 15:30'.
    var timeDuration = latestReminder.querySelector('.o365cs-notifications-reminders-timeDuration').innerText;

    var venue = latestReminder.querySelector('.o365cs-notifications-reminders-location').innerText;

    // If "Overdue" text is shown, then the event is overdue.
    var isOverdue = true;
    var overdueLabel = latestReminder.querySelector('.o365cs-notifications-toastReminders-overdue');
    if (overdueLabel.style.display !== undefined && overdueLabel.style.display === 'none') {
      isOverdue = false;
    }

    return {
      title: title,
      timeToStart: timeToStartValue + ' ' + timeToStartUnit,
      timeDuration: timeDuration,
      venue: venue,
      isOverdue: isOverdue,
    };
  }
})();
