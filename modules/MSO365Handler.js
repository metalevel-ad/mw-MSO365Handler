/**
 * Embed and dispaly the file within a iframe. This file is part of wp-MSO365Handler.
 *
 * @author Spas Z. Spasov <spas.z.spasov@gmail.com> (c) 2023
 *
 * Добавяне на функция която вмъква iframe с превю на страниците на файловете, които се поддържат от
 *      https://view.officeapps.live.com
 * Виж:
 *      https://bg.trivictoria.org/wiki/Файл:Темплейт_Технологична_среда_и_Длъжности.xlsx
 *      https://cwestblog.com/2020/05/22/embed-office-documents-on-your-site/
**/
(function ($, mw) {
	"use strict";
	//window.alert(mw.config.get( "wgNamespaceNumber" ) + " : " + mw.config.get( "wgCanonicalNamespace" ));

	// Get the configuration array exported by PrivateWikiAccessControlHooks::onResourceLoaderGetConfigVars
	var wgMSO365 = mw.config.get("wgMSO365Handler");

	var officeappsNamespaceNumber = mw.config.get("wgNamespaceNumber");
	// var officeappsNamespaceName = mw.config.get( "wgCanonicalNamespace" );

	if (officeappsNamespaceNumber === 6) {
		var officeappsFileURL = window.location.href;
		var officeAppsFileExtension = officeappsFileURL.substr((officeappsFileURL.lastIndexOf(".") + 1));
		var officeAppsAllowedTypes = ["xlsx", "docx", "pptx", "xlsm", "pptm", "docm", "ppsx"];
		var textFilesAllowedTypes = ["txt", "sh", "js", "css", "json", "html"];

		function insertAfter(el, referenceNode) { referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling); }
		// function insertBefore(el, referenceNode) { referenceNode.parentNode.insertBefore(el, referenceNode); }

		if (officeAppsAllowedTypes.indexOf(officeAppsFileExtension) >= 0 || textFilesAllowedTypes.indexOf(officeAppsFileExtension) >= 0) {
			$("div.fullMedia a.internal").each(function () {
				var officeAppsFileHREF = this.href;
				var fileExtHREF = officeAppsFileHREF.substr((officeAppsFileHREF.lastIndexOf(".") + 1));

				$("head").append("<style>"
					+ "div#mso365-handler-container { position: relative; overflow: hidden; width: " + wgMSO365.width + "; height: " + wgMSO365.height + "; " + wgMSO365.style + " }"
					+ "div#mso365-handler-container > iframe { position: absolute; left: -.2%; top: -.2%; }"
					+ "</style>"
					+ "<meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\">");

				if (document.getElementById("mso365-handler-container") === null) {
					if (officeAppsAllowedTypes.indexOf(fileExtHREF) >= 0) {
						// Office files embed
						let officeAppsItem = document.createElement("div");
						officeAppsItem.id = "mso365-handler-container";
						officeAppsItem.className = "mso365-handler-div";
						officeAppsItem.innerHTML =
							"<iframe frameborder=\"0\" height=\"100.4%\" width=\"100.4%\""
							+ "src=\"https://view.officeapps.live.com/op/" + wgMSO365.action + ".aspx?src="
							+ officeAppsFileHREF + "\">"
							+ "</iframe>"
							+ "<div class=\"mw-filepage-resolutioninfo\"></div>";

						insertAfter(officeAppsItem, document.getElementById("filetoc"));
					}
					else if (textFilesAllowedTypes.indexOf(fileExtHREF) >= 0) {
						// Text files embed
						let textAppsItem = document.createElement("div");
						textAppsItem.id = "mso365-handler-container";
						textAppsItem.className = "mso365-handler-div";
						textAppsItem.innerHTML = "<object width=\"100%\" height=\"100%\" type=\"text/plain\" data=\"" + officeAppsFileHREF + "\" border=\"0\"></object>";

						insertAfter(textAppsItem, document.getElementById("filetoc"));
					}
				}
			});
		}
	}
}(jQuery, mediaWiki));
