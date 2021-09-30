#!/bin/bash
if [[ -z ${1+x} ]]
then
    echo 'Something went wrong!'
else
    fileName="${1}"
    fileExtension="${fileName##*.}"

    #export LC=C

    if   [[ $fileExtension == 'docx' ]]
    then
        unzip -p "$fileName" word/document.xml word/endnotes.xml word/footnotes.xml word/header1.xml word/footer1.xml | sed -e 's/<\/w:p>/\n/g; s/<[^>]\{1,\}>//g; s/[^[:print:]\n]\{1,\}//g' | sed "s/style.visibilit//g; s/[^[:blank:][:print:]\t]//g; s/[!@#\$%^&*();GÝ'ß\/]/ /g; s/[[:space:]]\+/ /g; /^.$/d; /^$/d;"
    elif [[ $fileExtension == 'xlsx' || $fileExtension == 'xlsm' ]]
    then
        unzip -p "$fileName" xl/sharedStrings.xml xl/comments*.xml | sed -e 's/<\/w:p>/\n/g; s/<[^>]\{1,\}>/ /g; s/[^[:print:]\n]\{1,\}/ /g' | sed "s/style.visibilit//g; s/[^[:blank:][:print:]\t]//g; s/[!@#\$%^&*();GÝ'ß\/]/ /g; s/[[:space:]]\+/ /g; /^.$/d;"
    elif [[ $fileExtension == 'pptx' || $fileExtension == 'ppsx' ]]
    then
        unzip -p "$fileName" ppt/slides/slide*.xml ppt/notesSlides/notes*.xml | sed -e 's/<\/w:p>/\n/g; s/<[^>]\{1,\}>/ /g; s/[^[:print:]\n]\{1,\}//g' | sed "s/style.visibilit//g; s/[^[:blank:][:print:]\t]//g; s/[!@#\$%^&*();GÝ'ß\/]/ /g; s/[[:space:]]\+/ /g; /^.$/d;"
    elif [[ $fileExtension == 'txt' || $fileExtension == 'sh'  || $fileExtension == 'js' || $fileExtension == 'css' || $fileExtension == 'html' || $fileExtension == 'json' ]]
    then
        # sudo apt install -y python-chardet
        # https://stackoverflow.com/questions/64860/best-way-to-convert-text-files-between-character-sets
        fileEncoding="$(chardetect "$fileName" | awk '{print $2}')"
        iconv -f "$fileEncoding" -t UTF-8 -c "$fileName"
    else
        echo "We can't handle '${fileExtension}' files."
    fi
fi
