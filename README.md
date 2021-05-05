# tip 
Easy-to-use triangulated image placeholders. 


_Not production ready_

## Usage

1. Add to your the library to your HTML:
```html 
<head>
  ...
  <script src="https://cdn.jsdelivr.net/gh/rh12503/tip@latest/lib/placeholder.min.js"></script>
</head>
```

2. For any images with placeholders, change the `src` attribute to `data-src`.

All operations are done on the original `img` tag, so any formatting applied to the original image will be retained!

## Generating placeholders

### CLI
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

Taken from https://developer.mozilla.org/

Chrome: 26, 
Edge: 12, 
Firefox: 16, 
IE: 10, 
Opera: 12.1, 
Safari: 9

Android Browser: 37, 
Chrome Android: 26, 
Firefox for Android: 32, 
Opera Android: 14, 
Safari on iOS: 9, 
Samsung Internet: 1.5
