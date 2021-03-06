// ==UserScript==
// @name            plug-translator
// @description     translation script for plug.dj chat messages
// @author          Burkes
// @include         https://plug.dj/*
// @exclude         https://plug.dj/dashboard
// @exclude         https://plug.dj/privacy
// @exclude         https://plug.dj/terms
// @exclude         https://plug.dj/legal
// @exclude         https://plug.dj/forgot-password
// @exclude         https://plug.dj/ba
// @exclude         https://plug.dj/plot
// @exclude         https://plug.dj/about
// @exclude         https://plug.dj/team
// @exclude         https://plug.dj/jobs
// @exclude         https://plug.dj/partners
// @exclude         https://plug.dj/press
// @exclude         https://plug.dj/purchase
// @exclude         https://plug.dj/subscribe
// @exclude         https://plug.dj/ios-*
// @exclude         https://plug.dj/android-*
// @exclude         https://plug.dj/@/*
// @exclude         https://plug.dj/_/*
// @version         1.1.1
// @downloadURL     https://rawgit.com/Burkes/plug-translator/master/dist/plug-translator.user.js
// @updateURL       https://rawgit.com/Burkes/plug-translator/master/dist/plug-translator.user.js
// ==/UserScript==

(function() {
	function check() {
		if (typeof API !== "undefined" && API.enabled)
			return run();
		else
			return setTimeout(check, 1e3);
	}

	function run () {
		var script = document.createElement("script");
			script.id = "plug-translator";
			script.src = "https://rawgit.com/Burkes/plug-translator/master/dist/plug-translator.min.js";

		script.onload = function() {
		    this.parentNode.removeChild(this);
		};

		(document.head || document.documentElement).appendChild(script);
	}

	check();
})();