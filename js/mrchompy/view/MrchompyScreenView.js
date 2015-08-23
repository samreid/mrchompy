// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var MonsterNode = require( 'MRCHOMPY/mrchompy/view/MonsterNode' );

  /**
   * @param {MrchompyModel} mrchompyModel
   * @constructor
   */
  function MrchompyScreenView( mrchompyModel ) {

    ScreenView.call( this );

    var ground = new Rectangle( -1000, 600, 20000, 1000, { fill: '#092e0d' } );
    this.addChild( ground );

    var monsterNode = new MonsterNode();
    monsterNode.x = 200;
    monsterNode.bottom = ground.top;
    this.addChild( monsterNode );

    this.step = function() {

      if ( pressedKeys[ 39 ] ) {

        // right
        console.log( 'right' );
      }
      if ( pressedKeys[ 37 ] ) {
        console.log( 'left' );
      }
      if ( pressedKeys[ 38 ] ) {
        console.log( 'up' );
      }
      this.removeChild( monsterNode );

      monsterNode = new MonsterNode();
      monsterNode.x = 200;
      monsterNode.bottom = ground.top;
      this.addChild( monsterNode );
    };

    // Key listeners 
    // http://stackoverflow.com/questions/16089421/simplest-way-to-detect-keypresses-in-javascript
    function addEvent( element, eventName, callback ) {
      if ( element.addEventListener ) {
        element.addEventListener( eventName, callback, false );
      }
      else if ( element.attachEvent ) {
        element.attachEvent( "on" + eventName, callback );
      }
      else {
        element[ "on" + eventName ] = callback;
      }
    }

    var pressedKeys = {};
    addEvent( document, "keydown", function( e ) {
      var e = e || window.event;
      // use e.keyCode
      console.log( e.keyCode, 'down' );
      pressedKeys[ e.keyCode ] = true;
    } );

    addEvent( document, "keyup", function( e ) {
      var e = e || window.event;
      // use e.keyCode
      console.log( e.keyCode, 'up' );
      pressedKeys[ e.keyCode ] = false;
    } );

  }

  return inherit( ScreenView, MrchompyScreenView );
} );