Instructions:

0) Check gulpfile.js

1) Begin
    1. font:
        - replace all .ttf fonts in src/font (with real)

    2. img:
        - replace example images logo.png, logo.svg, img.jpg and favicon.ico (with real)
        - rename directory main-page and main-block (if necessary)
        - load all images from design

    3. js:
        - rename directory main-page
        - rename file main-block.js

    3. scss:
        - rename main-page, main-page.scss and _main-block.scss
        - edit main-page.scss (rename main-block)
        - replace colors in _color.scss (with real)
        - check if _font-face.scss file is clean (non lines!)
        - set variables in _mixin.scss, and edit fontSC() mixin


2) First Compile
    1. font:
        - run _font-face.scss compiler "gulp fontStyle"
        - rename related fonts to one name and change font-weight in _font-face.scss
    2. css, js:
        - set css libs to load in gulpfile.js (line 98)
        - set js libs to load in gulpfile.js (line 126)
        - run "gulp firstCompile"
        - check _main-block.scss


3) Run Gulp:
    1. "gulp"

4) Make Zip:
    1. "gulp zip"

5) Deploy with FTP:
    1. set ftp connection data in gulpfile.js
    2. run "gulp deploy"