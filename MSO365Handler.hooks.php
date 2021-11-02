<?php
/**
 * @author    Spas Z. Spasov <spas.z.spasov@gmail.com>
 * @copyright 2020 Spas Z. Spasov
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3 (or later)
 * @home      https://github.com/metalevel-tech/mw-MSO365Handler
 *
 * This file is a part of the MediaWiki Extension:MSO365Handler
 *
 */


if (!defined('MEDIAWIKI')) {
    die('This file is an extension to MediaWiki and thus not a valid entry point.');
}


/**
 * This is the main Class of the extension
 * Ref: https://www.mediawiki.org/wiki/Manual:Hooks
 */
class MSO365HandlerHooks
{
    /**
     * This is the main function, the one that will process the content.
     * Ref: https://www.mediawiki.org/wiki/Manual:Hooks/ParserAfterTidy
     */
    public static function onParserAfterTidy( Parser $parser, &$text )
    {
        global $wgMSO365Handler;
        global $wgUploadDirectory;

        // Get the current NameSpace
        $currentNS = $parser->getTitle()->getNamespace();
        $pageTitle = $parser->getTitle()->getText();

        // Test whether the current NameSpace belongs to the Allowed NameSpaces
        if (in_array($currentNS, $wgMSO365Handler['allowedNameSpaces']) && strpos( $text, $wgMSO365Handler['container'] ) !== false ) {

            if (preg_match('~^([^\/]+\.(docx|xlsx|pptx|ppsx|txt|sh|xlsm))$~', $pageTitle, $re)) {
                $filename = $re[1];  // re contains the groups; //echo $re[1]; //if (count($re) == 3) { $page = $re[2]; }

                $fileObject = wfFindFile($pageTitle);
                if ($fileObject) {
                    $filePath = $fileObject->getPath();
                    $fullFileName = str_replace("mwstore://local-backend/local-public", $wgUploadDirectory, $filePath);

                    $output = shell_exec('bash '. __DIR__ .'/'. $wgMSO365Handler['bash-processor'] .' "'. $fullFileName .'" 2>&1');
                    $text = str_replace("MSO365SearchIndex", $output, $text);

                    return true;
                }
            }
        }
        return true;
    }

    /**
     * Load the extension's Scripts And Styles
     * Ref: https://www.mediawiki.org/wiki/Manual:Hooks/BeforePageDisplay
     */
    public static function onBeforePageDisplay(OutputPage $out, Skin $skin)
    {
        global $wgMSO365Handler;

        // Get the current NameSpace and if it is File: add the embed script
        $currentNS = $out->getTitle()->getNamespace();
        if (in_array($currentNS, $wgMSO365Handler['allowedNameSpaces'])) {
            $out->addModules('MSO365HandlerScriptsAndStyles');
        }

        // Add MultiMedia Viewer redirect script
        $out->addModules('MSO365HandlerMMVRedirectScript');
        return true;
    }


    /**
     * Exposrt some variables to the JS environment
     * Ref: https://www.mediawiki.org/wiki/Manual:Hooks/ResourceLoaderGetConfigVars
     * 
     * Actually the JS embed the file,
     * above we just proccess its content and "push it to the search index"
     */
    public static function onResourceLoaderGetConfigVars( array &$vars )
    {
        global $wgMSO365Handler;

        // Forward some PHP variables to the JavaScript environment
        $vars['wgMSO365Handler'] = [
            'width'  => $wgMSO365Handler['width'],
            'height' => $wgMSO365Handler['height'],
            'style'  => $wgMSO365Handler['style'],
            'action' => $wgMSO365Handler['action'],
        ];
        return true;
    }
}
