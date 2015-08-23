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

    monsterNode.bottom = ground.top;
    this.addChild( monsterNode );

    var floorY = 400;
    var monsterModel = {
      x: 200,
      jumping: false,
      vy: 0,
      gravity: 5000,
      y: floorY
    };

    this.step = function( dt ) {

      if ( pressedKeys[ 39 ] ) {

        // right
        console.log( 'right' );
        monsterModel.x += 10;
      }
      if ( pressedKeys[ 37 ] ) {
        console.log( 'left' );
        monsterModel.x -= 10;
      }
      if ( pressedKeys[ 38 ] && !monsterModel.jumping ) {
        monsterModel.jumping = true;
        monsterModel.vy = -1000;
      }

      monsterModel.vy = monsterModel.vy + monsterModel.gravity * dt;
      monsterModel.y = monsterModel.y + monsterModel.vy * dt;
      if ( monsterModel.y >= floorY ) {
        monsterModel.y = floorY;
        monsterModel.jumping = false;
      }

      this.removeChild( monsterNode );

      monsterNode = new MonsterNode();
      monsterNode.x = monsterModel.x;
      monsterNode.y = monsterModel.y;
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