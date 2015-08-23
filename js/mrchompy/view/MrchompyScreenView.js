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
  var HouseNode = require( 'MRCHOMPY/mrchompy/view/HouseNode' );
  var PersonNode = require( 'MRCHOMPY/mrchompy/view/PersonNode' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {MrchompyModel} mrchompyModel
   * @constructor
   */
  function MrchompyScreenView( mrchompyModel ) {

    ScreenView.call( this );

    var worldNode = new Node();
    this.addChild( worldNode );
    var ground = new Rectangle( -1000, 600, 20000, 1000, { fill: '#092e0d' } );
    worldNode.addChild( ground );

    var floorY = 400;
    var monsterModel = {
      x: 200,
      jumping: false,
      vy: 0,
      gravity: 5000,
      y: floorY,
      jawsClosing: false,
      jawsOpening: false,
      mouthOpenAmount: 1
    };

    var houseNode = new HouseNode();
    houseNode.x = 800;
    houseNode.bottom = ground.top;
    worldNode.addChild( houseNode );

    var peopleLayer = new Node();
    worldNode.addChild( peopleLayer );
    var monsterNode = new MonsterNode( monsterModel );
    worldNode.addChild( monsterNode );

    var people = [ {
      x: 600,
      y: 450,
      dead: false
    } ];

    this.step = function( dt ) {

      if ( pressedKeys[ 39 ] ) {

        // right
        monsterModel.x += 10;
      }
      if ( pressedKeys[ 37 ] ) {
        monsterModel.x -= 10;
      }
      if ( pressedKeys[ 38 ] && !monsterModel.jumping ) {
        monsterModel.jumping = true;
        monsterModel.vy = -2000;
      }
      if ( pressedKeys[ 32 ] && !monsterModel.jawsClosing && !monsterModel.jawsOpening ) {
        monsterModel.jawsClosing = true;
      }
      if ( monsterModel.jawsClosing && monsterModel.mouthOpenAmount <= 0 ) {
        monsterModel.mouthOpenAmount = 0;
        monsterModel.jawsClosing = false;
        monsterModel.jawsOpening = true;
        people.forEach( function( p ) {
          p.dead = true;
        } );
      }
      if ( monsterModel.jawsOpening && monsterModel.mouthOpenAmount >= 1 ) {
        monsterModel.mouthOpenAmount = 1;
        monsterModel.jawsOpening = false;
      }
      if ( monsterModel.jawsClosing ) {
        monsterModel.mouthOpenAmount -= 0.1;
      }
      if ( monsterModel.jawsOpening ) {
        monsterModel.mouthOpenAmount += 0.1;
      }

      monsterModel.vy = monsterModel.vy + monsterModel.gravity * dt;
      monsterModel.y = monsterModel.y + monsterModel.vy * dt;
      if ( monsterModel.y >= floorY ) {
        monsterModel.y = floorY;
        monsterModel.jumping = false;
      }

      worldNode.removeChild( monsterNode );

      monsterNode = new MonsterNode( monsterModel );
      monsterNode.x = monsterModel.x;
      monsterNode.y = monsterModel.y;
      worldNode.addChild( monsterNode );

      peopleLayer.removeAllChildren();
      for ( var i = 0; i < people.length; i++ ) {
        var personNode = new PersonNode( people[ i ] );
        personNode.x = people[ i ].x;
        personNode.y = people[ i ].y;
        peopleLayer.addChild( personNode );
      }

      if ( monsterModel.x >= 400 ) {
        worldNode.x = -monsterModel.x + 400;
      }
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
      pressedKeys[ e.keyCode ] = true;
    } );

    addEvent( document, "keyup", function( e ) {
      var e = e || window.event;
      // use e.keyCode
      pressedKeys[ e.keyCode ] = false;
    } );

  }

  return inherit( ScreenView, MrchompyScreenView );
} );