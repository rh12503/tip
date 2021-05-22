<p align="center">
  <img src="/assets/tip.svg" width="130px">
</p>
<p align="center">
  Triangulated image placeholders 
</p>

tip is an easy-to-use, efficent, and lightweight library for triangulated image placeholders. It uses a highly-optimized format over 10x smaller than minified SVG. _(Currently not production ready)_

## Usage

1. Add the library to your HTML:
```html 
<head>
  ...
  <script src="https://cdn.jsdelivr.net/gh/rh12503/tip@latest/lib/tip.min.js"></script>
</head>
```

2. Change the `src` attribute to `data-src` for any image with placeholders.

The library will look for the placeholder asset in the same location as the original image. 

## Generating placeholders

Placeholder assets have the same name as the original asset but with the extension `.tri`. For example, `image.png` would become `image.tri`. 

### GUI
Install the GUI from the releases page. 

### CLI
_In the future the command will be added to npx._ 
Install the CLI using the command:
```
go get -u github.com/RH12503/tip-backend/tip
```
Generate the placeholder files by running
```
tip -in /path/to/image
```
or to process all images in a folder
```
tip -in /path/to/folder
```
The placeholder `.tri` files will be created in the same location as the image files! 

## Browser support

Every browser that has been updated within the last few years should be supported. 

| <img src="https://github.com/alrra/browser-logos/raw/main/src/chrome/chrome_256x256.png" width="40px"> | <img src="https://km.support.apple.com/kb/image.jsp?productid=PL165&size=240x240" width="40px"> | <img src="https://github.com/alrra/browser-logos/raw/main/src/edge/edge_256x256.png" width="40px"> | <img src="https://github.com/alrra/browser-logos/raw/main/src/firefox/firefox_256x256.png" width="40px"> | <img src="https://github.com/alrra/browser-logos/raw/main/src/opera/opera_256x256.png" width="40px"> | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Internet_Explorer_10%2B11_logo.svg/1043px-Internet_Explorer_10%2B11_logo.svg.png" width="40px"> 
| :-: | :-: | :-: | :-: | :-: | :-: |
| 26 | 9 | 12 | 16 | 12.1 | 10 |

All major mobile browsers are also supported including: Safari on iOS, Android WebView, Chrome Android & iOS, Firefox for Android, Opera Android, and Samsung Internet. 
