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
  var Util = require( 'DOT/Util' );
  var Line = require( 'SCENERY/nodes/Line' );

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

    var addedSpears = false;
    var zoomingOut = false;

    worldNode.addChild( new HouseNode( { x: 800, bottom: ground.top } ) );
    worldNode.addChild( new HouseNode( { x: 1600, bottom: ground.top } ) );
    worldNode.addChild( new HouseNode( { x: 2400, bottom: ground.top } ) );
    worldNode.addChild( new HouseNode( { x: 3200, bottom: ground.top } ) );

    var peopleLayer = new Node();
    worldNode.addChild( peopleLayer );
    var monsterNode = new MonsterNode( monsterModel );
    worldNode.addChild( monsterNode );

    var createSpear = function() {
      return {
        thrown: false,
        x: 0
      };
    };

    var newPerson = function( x, spear ) {
      return {
        x: x,
        y: 450,
        dead: false,
        vx: -180,
        scared: false,
        angle: 0,
        falling: false,
        finishedFalling: false,
        spear: spear
      };
    };

    var worldScale = 1;
    var people = [];
    for ( var i = 0; i < 4; i++ ) {
      people.push( newPerson( i * 800 + 1500, null ) );
    }

    this.step = function( dt ) {

      if ( pressedKeys[ 39 ] ) {

        // right
        monsterModel.x += 400 * dt;
      }
      if ( pressedKeys[ 37 ] ) {
        monsterModel.x -= 400 * dt;
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
          if ( Math.abs( p.x - monsterModel.x ) < 250 ) {
            p.dead = true;
          }
        } );
      }
      if ( monsterModel.jawsOpening && monsterModel.mouthOpenAmount >= 1 ) {
        monsterModel.mouthOpenAmount = 1;
        monsterModel.jawsOpening = false;
      }
      if ( monsterModel.jawsClosing ) {
        monsterModel.mouthOpenAmount -= 0.2;
      }
      if ( monsterModel.jawsOpening ) {
        monsterModel.mouthOpenAmount += 0.1;
      }

      people.forEach( function( person ) {
        if ( !person.dead ) {
          person.x += person.vx * dt;
        }
        if ( !person.spear || (person.spear && person.spear.thrown) ) {
          if ( person.x <= monsterModel.x + 500 && !person.scared ) {
            person.vx = Math.abs( person.vx );
            person.scared = true;
            person.vx = 320;
          }
          if ( person.x >= monsterModel.x + 1000 && person.scared ) {
            person.scared = false;
            person.vx = 0;
          }
          if ( person.dead && !person.finishedFalling ) {
            person.angle = person.angle + Math.PI * 2 * dt;
            if ( person.angle > Math.PI / 2 ) {
              person.angle = Math.PI / 2;
              person.falling = false;
              person.finishedFalling = true;
            }
          }
        }
        else {
          if ( person.x <= monsterModel.x + 1000 && !person.spear.thrown ) {
            person.vx = 0;
            person.spear.thrown = true;
          }
        }

        if ( person.spear && person.spear.thrown ) {
          person.spear.x += 800 * dt;
        }
      } );
      var deadCount = 0;
      for ( var i = 0; i < people.length; i++ ) {
        var person = people[ i ];
        if ( person.dead ) {
          deadCount++;
        }
      }
      if ( deadCount === 4 && !addedSpears ) {
        addedSpears = true;
        zoomingOut = true;
        people.push( newPerson( monsterModel.x + 3000, createSpear() ) );
        people.push( newPerson( monsterModel.x + 3400, createSpear() ) );
        people.push( newPerson( monsterModel.x + 3600, createSpear() ) );
        people.push( newPerson( monsterModel.x + 3800, createSpear() ) );
      }
      if ( zoomingOut ) {
        worldScale = worldScale - 1.2 * dt;
        if ( worldScale <= 0.5 ) {
          zoomingOut = false;
          worldScale = 0.5;
        }
        worldNode.setScaleMagnitude( worldScale );
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
        var personNode = new PersonNode( people[ i ], {
          scale: {
            x: people[ i ].scared ? -1 : 1,
            y: 1
          },
          centerX: people[ i ].x,
          bottom: ground.top,
          rotation: people[ i ].angle
        } );
        peopleLayer.addChild( personNode );

        if ( people[ i ].spear ) {
          var spear = new Line( 0, 0, 0, 120, {
            lineWidth: 10,
            stroke: '#937b33',
            rotation: -people[ i ].spear.x / 1000 * 2
          } );
          peopleLayer.addChild( spear );
          if ( people[ i ].spear.thrown ) {
            spear.left = personNode.right + 10 - people[ i ].spear.x;
            spear.bottom = personNode.bottom - people[ i ].spear.x / 3;
          }
          else {
            spear.left = personNode.right + 10;
            spear.bottom = personNode.bottom;
          }
        }
      }

      if ( monsterModel.x >= 400 ) {
        worldNode.x = (-monsterModel.x + 400) * worldScale;
        worldNode.y = Util.linear( 1, 0.5, 0, 250, worldScale );
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