// ==UserScript==
// @name         YouTube - Copy Timestamp Link Shortcut
// @version      1.0.0
// @namespace    https://github.com/WesternFreak/YouTube-Copy-Timestamp-Link-Shortcut
// @description  Copies to the clipboard a link to the current video's timecode using a keyboard shortcut (CTRL+ALT+T).
// @icon         https://raw.githubusercontent.com/WesternFreak/YouTube-Copy-Timestamp-Link-Shortcut/main/img/icon.png
// @author       WesternFreak
// @homepage     https://github.com/WesternFreak/YouTube-Copy-Timestamp-Link-Shortcut
// @updateURL    https://github.com/WesternFreak/YouTube-Copy-Timestamp-Link-Shortcut/raw/main/yt-ctls.user.js
// @downloadURL  https://github.com/WesternFreak/YouTube-Copy-Timestamp-Link-Shortcut/raw/main/yt-ctls.user.js
// @supportURL   https://github.com/WesternFreak/YouTube-Copy-Timestamp-Link-Shortcut/issues
// @match        https://www.youtube.com/*
// @grant        GM_setClipboard
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to get the video element
    const getVideoElement = () => document.querySelector('video');

    // Utility function to get the video ID from the URL
    const getVideoId = () => new URL(window.location.href).searchParams.get('v');

    // Generates a timestamp URL for the current video
    const generateTimestampUrl = (video) => {
        const currentTime = video.currentTime;
        const videoId = getVideoId();
        return `https://youtu.be/${videoId}?t=${Math.floor(currentTime)}`;
    };

    // Copies the provided text to the clipboard and shows a notification
    const copyToClipboard = (text) => {
        if (text) {
            GM_setClipboard(text);
            showPopup('Timestamp link copied!');
        } else {
            showPopup('No video found or unable to generate link.');
        }
    };

    // Creates and displays a custom popup in the middle of the video player
    const showPopup = (message) => {
        const video = getVideoElement();
        if (!video) return;

		const existingPopup = document.querySelector('.custom-playback-popup');
		if (existingPopup) {
			existingPopup.remove(); // Remove the existing popup if it exists
		}

		const rect = video.getBoundingClientRect(); // Get the position and size of the video element
		const popup = document.createElement('div');
		popup.textContent = message;
		popup.classList.add('custom-playback-popup'); // Add a class to identify the popup

        // Style the popup
        popup.style.position = 'absolute';
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top + rect.height / 7.5}px`;
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'; // Slightly transparent background
        popup.style.color = '#fff';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '9000';
        popup.style.fontFamily = 'Arial, sans-serif'; // Use a sans-serif font
        popup.style.fontSize = 'large';
        popup.style.opacity = '1';
        popup.style.transition = 'opacity 0.5s ease';

        // Append the popup to the body
        document.body.appendChild(popup);

        // Fade out the popup after 2 seconds
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 100);
        }, 500);
    };

    // Checks if the current URL is a YouTube video page
    const isYouTubeVideoPage = () => {
        return window.location.href.includes('/watch?');
    };

    // Handles keydown events to trigger the timestamp URL copy
    const handleKeydown = (event) => {
        // Check for CTRL + LEFT ALT + T and if on a YouTube video page
        if (event.ctrlKey && event.altKey && event.code === 'KeyT' && isYouTubeVideoPage()) {
            event.preventDefault(); // Prevent default behavior

            const video = getVideoElement();
            if (video) {
                const timestampLink = generateTimestampUrl(video);
                copyToClipboard(timestampLink);
            } else {
                showPopup('No video found on this page.');
            }
        }
    };

    // Add event listener for keydown events
    document.addEventListener('keydown', handleKeydown);
})();
