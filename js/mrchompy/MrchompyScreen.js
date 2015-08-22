// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var MrchompyModel = require( 'MRCHOMPY/mrchompy/model/MrchompyModel' );
  var MrchompyScreenView = require( 'MRCHOMPY/mrchompy/view/MrchompyScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var mrchompySimString = require( 'string!MRCHOMPY/mrchompy.name' );

  /**
   * @constructor
   */
  function MrchompyScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, mrchompySimString, icon,
      function() { return new MrchompyModel(); },
      function( model ) { return new MrchompyScreenView( model ); },
      { backgroundColor: 'black' }
    );
  }

  return inherit( Screen, MrchompyScreen );
} );