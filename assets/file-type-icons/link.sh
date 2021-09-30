#!/bin/bash
for file in *.png
do
	cd ../../../../resources/assets/file-type-icons/
	ln -s ../../../"extensions/MSO365Handler/assets/file-type-icons/${file}" . 
	cd - >/dev/null
done
echo -e '\n\nfind ../../../../resources/assets/file-type-icons/ -type l -ls\n'
find ../../../../resources/assets/file-type-icons/ -type l -ls
echo -e '\n\nTo remove all symbolic links from "$IP/resources/assets/file-type-icons/" use:'
echo -e '\nfind ../../../../resources/assets/file-type-icons/ -type l -delete\n'