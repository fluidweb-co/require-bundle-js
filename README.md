# Require Bundle

[![npm version](https://badge.fury.io/js/require-bundle-js.svg)](https://badge.fury.io/js/require-bundle-js)
[![DragsterJS gzip size](http://img.badgesize.io/https://raw.githubusercontent.com/fluidweb-co/require-bundle-js/master/dist/require-bundle.min.js?compression=gzip
)](https://raw.githubusercontent.com/fluidweb-co/require-bundle-js/master/dist/require-bundle.min.js)

Some features on a web page require more than just the script file to work and will need to load styles and other resources, this is where Require Bundle can come in handy by providing a way to detect when a bundle of resources is necessary and loading it automatically.

Require Bundle will load various resources related to a feature or elements in your application only on the pages which they are present present or required.

Use cases:
- When the page has collapsible blocks, load collapsible.js and collapsible.css
- When the page has a product details image, load product-image-zoom.js and product-image-zoom.css

You might also require bundles from inside other scripts:
- From collapsible.js, require animate-helper.js before initializing a collapsible block to help with animating the open/close states
- Require cookie-helper.js before initializing a grid/list view feature that needs to save it's state



## Installation

Setting up is pretty straight-forward. Download the script from __dist__ folder and include it in your HTML preferably inside the document `<head>` element.

```html
<script type="text/javascript" src="path/to/dist/require-bundle.min.js"></script>
```

### NPM

Require Bundle is also available on NPM:

```sh
$ npm install require-bundle-js
```



## Basic Usage

### 1. Register a bundle

To register a bundle you call `RequireBundle.register`, give it a name and pass in an array of the resource urls it needs to load, or other bundles as dependencies.

```js
RequireBundle.register( 'animate-helper', [ '//url/to/animate-helper.min.js' ] ); // one script
RequireBundle.register( 'hammerjs', [ '//url/to/hammer.min.js', '//url/to/hammerjs-init.min.js' ] ); // two scripts
RequireBundle.register( 'fluid-slider', [ '//domain/js/fluid-slider.min.js', '//domain/css/fluid-slider.min.css' ] ); // one script, one style
RequireBundle.register( 'collapsible-block', [ '//domain/js/collapsible.min.js', 'animate-helper' ] ); // one script, one dependency
RequireBundle.register( 'bundle-only-dependencies', [ 'animate-helper', 'hammerjs' ] ); // bundles as dependencies
```

The order or the resources does not matter since they will be loaded asyncronosly and only after all resources from a bundle is loaded the callback function will be executed.

### 2. Require/load a bundle

To load a bundle you call `RequireBundle.require` and pass in the bundle name and callback function to execute after all resources have been loaded.

```js
RequireBundle.require( 'fluid-slider', function(){ FluidSlider.init() });
RequireBundle.require( 'collapsible-block', function(){ Collapsible.init() });
```

### 3. Auto-load bundles

Bundles can be auto-loaded in 2 ways:

a. Provide a script that will detect the presence of an html element that requires a bundle and load the bundle with `RequireBundle.require`:
```js
window.addEventListener( 'load', function(){
    if( document.querySelector( '.slider-wrapper' ) ) {
        RequireBundle.require( 'fluid-slider', function(){
            FluidSlider.init();
        } );
    }
} );
```

b. Register a bundle passing in the selector to detect the html elements that require it and optionally the callback function to execute:
```js
RequireBundle.register( 'fluid-slider', [ '//domain/js/fluid-slider.min.js', '//domain/css/fluid-slider.min.css' ], '.slider-wrapper', function(){ FluidSlider.init(); } ); // Auto-load when `.slider-wrapper` is present, then execute callback
```

### 4. De-register a bundle

You can remove a bundle from the registered bundles by calling the method `RequireBundle.deregister`:
```js
window.addEventListener( 'load', function(){
    RequireBundle.deregister( 'fluid-slider' );
} );
```


## Contributing to Development

This isn't a large project by any means, but you are definitely welcome to contribute.

### Development environment

Clone the repo and run [npm](http://npmjs.org/) install:

```
$ cd path/to/require-bundle-js
$ npm install
```

Run the build command:

```
$ gulp build
```

Build on file save:

```
$ gulp
$ gulp watch
```


## License

Licensed under MIT.
