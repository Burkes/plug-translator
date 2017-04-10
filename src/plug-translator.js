if (typeof window.pt != "undefined") window.pt.kill();
(function($) {
	window.pt = {
		events: {
			doubleClickHandler: function (event) {
				if (!/message|mention|emote/i.test(event.currentTarget.className)) return;
				let element = $(event.currentTarget);

				if (element.attr("translated")) return window.pt.utils.restoreOriginalMessage(element);

				let raw_html = element.find(".text").html();
				let stripped_string = window.pt.utils.stripNonText(raw_html.replace(/<br\s*\/*>/gi, "\n"));

				element.attr("translated", true);
				element.data({raw_html: raw_html});

				return window.pt.utils.translate(encodeURIComponent(stripped_string))
					.then(response => {
						response = response.filter(e => e && e.length);

						let translated_text = response[0].map(e => e[0]).join("");

						let html = translated_text.replace(/\n/g, "<br>");

						element.find(".text").html(translated_text);
					}).catch(err => window.pt.utils.failedTranslation(this));
			}
		},
		utils: {
			restoreOriginalMessage: function (element) {
				let raw_html = element.data("raw_html");

				element.find(".text").html(raw_html);
				element.attr("translated", null);
				element.data("raw_html", null);
			},
			stripNonText: function (html) {
				let html_tags = html.match(/<[^>]*>/gi) || [];
				
				for (let i = 0; i < html_tags.length; i++) {
					let index = html.indexOf(html_tags[i]);
					html = html.split("");
					html.splice(index, html_tags[i].length);
					html = html.join("");
				}

				let users = window.API.getUsers().map(u => `@${u.username}`);

				for (let i = 0; i < users.length; i++) {
					let index = html.indexOf(users[i]);
					if (index === -1) continue;

					html = html.split("");
					html.splice(index, users[i].length);
					html = html.join("");
				}

				let string = html;

				return string;
			},
			translate: function (string) {
				return new Promise ((resolve, reject) => {
					$.get(`https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=en&q=${string}`)
						.done(response => {
							return resolve(response);
						}).fail(reject);
				});
			},
			failedTranslation: function (element) {
				clearTimeout(window.pt.tooltipHide);
				window.pt.tooltipHide = setTimeout(() => window.pt.EventsModule.trigger("tooltip:hide"), 3e3);

				window.pt.EventsModule.trigger("tooltip:show", "Translation failed.", $(element));
			}
		},
		init: function () {
			if (typeof window.jQuery === "undefined") return setTimeout(window.pt.init, 200);

			$("#chat-messages").on("dblclick", ".cm", this.events.doubleClickHandler);
			$("head").append(`<style id="plug-translator-css">.cm[translated="true"] .from .un:after{background-color: #313131;content: "TRANSLATED";border-radius: 3px;margin-left: 5px;font-size: 9px;padding: 0 4px;color: #ccc;position: relative;bottom: 1px;cursor: default}</style>`);

			this.require = window.require.s.contexts._.defined;
			for (let i in this.require) {
				let module = this.require[i];
				if (!module) continue;

				if (module._events && module._events["chat:receive"])
					this.EventsModule = module;
			}

			let startup_text = "Double click a chat message to translate. Double click it again to revert.";

			API.chatLog(startup_text);

			this.startupTextTimeout = setTimeout(() => $(`.cm.log:contains(${startup_text})`).remove(), 1e4);
		},
		kill: function () {
			this.EventsModule.trigger("tooltip:hide");
			$("#chat-messages").off("dblclick", ".cm", this.events.doubleClickHandler);
			$("#plug-translator-css").remove();
			delete window.pt;
		}
	};

	window.pt.init();
})(window.jQuery);