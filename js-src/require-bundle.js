/**
 * Resource dependency manager to asyncronously load JS, CSS or Images as a bundle.
 */
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
	  define([], factory(root));
	} else if ( typeof exports === 'object' ) {
	  module.exports = factory(root);
	} else {
	  root.RequireBundle = factory(root);
	}
  })(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';


	var _publicMethods = {};
	var _bundles = {};



	/******************
	 * PRIVATE METHODS
	 *****************/



	/**
	 * Maybe autoload bundles
	 */
	var maybeAutoload = function() {
		_publicMethods.getIds().forEach( function( bundleId ) {
			var bundle = _bundles[ bundleId ];
			if ( typeof bundle.autoLoadSelector === 'string' && document.querySelector( bundle.autoLoadSelector ) ) {
				_publicMethods.require( bundleId, bundle.callbackFn );
			}
		} );
	}



	/******************
	 * PUBLIC METHODS
	 *****************/



	/**
	 * Get list of registered bundles
	 *
	 * @return  {Array}  List of registered bundle ids
	 */
	_publicMethods.getIds = function() {
		return Object.keys( _bundles );
	};



	/**
	 * Check if a bundle has been registered
	 *
	 * @param   {String}  bundleId  Bundle Id
	 *
	 * @return  {Boolean}           True if a bundle has been registered with the id passed
	 */
	_publicMethods.hasBundle = function( bundleId ) {
		return _bundles.hasOwnProperty( bundleId );
	};



	/**
	 * Get the bundle dependencies values
	 * 
	 * @param   {String}  bundleId  Bundle Id
	 *
	 * @return  {Array/Boolean}  Bundle dependencies values or false if not registered
	 */
	_publicMethods.getBundle = function( bundleId ) {
		if ( ! _publicMethods.hasBundle( bundleId ) ) return [];
		return _bundles[ bundleId ];
	};



	/**
	 * Register new bundle of resources
	 *
	 * @param   {String}  bundleId  Bundle ID
	 * @param   {Array}   deps      Array of resource paths
	 */
	_publicMethods.register = function( bundleId, deps, autoLoadSelector, callbackFn ) {
		// Already registered
		if ( _publicMethods.hasBundle( bundleId ) ) { 
			console.log( 'Bundle already registered: `' + bundleId + '`' );
			return false;
		};

		// Register
		_bundles[ bundleId ] = {
			bundleId: bundleId,
			deps: deps,
			autoLoadSelector: autoLoadSelector,
			callbackFn: callbackFn,
		}

		return true;
	};



	/**
	 * Deregister a bundle of resources
	 *
	 * @param   {String}  bundleId  Bundle ID
	 */
	_publicMethods.deregister = function( bundleId ) {
		// Already registered
		if ( _publicMethods.hasBundle( bundleId ) ) { 
			delete _bundles[ bundleId ];
			return true;
		};

		return false;
	};



	/**
	 * Load bundle of dependencies using LoadJS
	 *
	 * @param   {Array}     bundleIds   Array of Bundle IDs to load
	 * @param   {Function}  callbackFn  Function executed after bundle is successfully loaded
	 */
	_publicMethods.require = function( bundleIds, callbackFn ) {
		// Make sure variables are in the expected format
		if ( ! Array.isArray( bundleIds ) ) bundleIds = [ bundleIds ];
		if ( typeof callbackFn !== 'function' ) {
			callbackFn = function(){};
		}
		
		// Load each bundle
		bundleIds.forEach( function( bundleId ) {
			var bundle = _publicMethods.getBundle( bundleId );
			if ( bundle ) {
				if ( ! loadjs.isDefined( bundleId ) ) loadjs( bundle.deps, bundleId );
			}
		});
		
		// Run callback when ready
		loadjs.ready( bundleIds, callbackFn );
	};



	/**
	 * Add load event listener to auto-load bundles
	 */
	window.addEventListener( 'load', maybeAutoload );


	//
	// Expose Public APIs
	//
	return _publicMethods;

});
