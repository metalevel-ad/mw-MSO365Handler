/**
 * Redirect MultiMedia Viewer straight to the pages of the handled files. This file is part of wp-MSO365Handler.
 *
 * @author Spas Z. Spasov <spas.z.spasov@gmail.com> (c) 2023
 *
 * Предистория: В LocalSettings.php са добавени няколо нови mime types, например: xlsx, 7z и др.
 * Също в $IP/resources/assets/file-type-icons/ са добавени и нови икони: fileicon-xlsx.png, fileicon-7z.png и т.н.
 *
 * Проблемът е, че в режим на галерия (виж: https://wiki.metalevel.tech/wiki/Category:Фигури_и_Файлове_за_Шаблони)
 * Extension:­MultimediaViewer се опитва да отвори иконите като изображения и
 * генерира грешка понеже ги няма.
 *
 * Идеята на този скрипт е да добави class=noviewer за тези икони,
 * така че когато се кликне на тях да се отваря страницата на файла.
 * Това не сработи, явно Extension:­MultimediaViewer индексира картинките при зареждането на страницата...
 * За това са добавени две условия първото пренасочва към страницата на файла,
 * а второто пренасочва при връщане на зад, след използва не на бутона Back от браузъра.
**/
(function ( $, mw ) {
    $("img").each(function() {
		const fileURL = $( this ).parents("a").attr("href");
		const imgSRC = this.src;

		if (imgSRC.indexOf("resources") >= 0) {
			$( this ).addClass( "noviewer" ).click(function(){
			  window.location.href = fileURL;
			});
		}

		if ( mw.config.get( "wgNamespaceNumber" ) !== -1 ) {
			if ( mw.config.get( "wgNamespaceNumber" ) !== 6 ) {
				if (window.location.href.indexOf("Fileicon-") >= 0) {
			    	window.location.href = window.location.href.split("#")[0];
			    }
			}
		}
	});
}( jQuery, mediaWiki ) );
