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
  var MonsterNode = require( 'MRCHOMPY/mrchompy/view/MonsterNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var title = require( 'image!MRCHOMPY/mrchompy.png' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   * @param {MrchompyModel} mrchompyModel
   * @constructor
   */
  function MrchompyScreenView( mrchompyModel ) {

    ScreenView.call( this );
    var mrchompyScreenView = this;

    var Matter = window.Matter;
    console.log( Matter );

    var Demo = {};
    Matter.Demo = Demo;

    // Matter aliases
    var Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Common = Matter.Common,
      Constraint = Matter.Constraint,
      Events = Matter.Events,
      Bounds = Matter.Bounds,
      Vector = Matter.Vector,
      Vertices = Matter.Vertices,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Query = Matter.Query,
      Svg = Matter.Svg;

    var _isBrowser = true;

    var _engine,
      _runner,
      _gui,
      _inspector,
      _sceneName,
      _mouseConstraint,
      _sceneEvents = [],
      _useInspector = _isBrowser && window.location.hash.indexOf( '-inspect' ) !== -1,
      _isMobile = _isBrowser && /(ipad|iphone|ipod|android)/gi.test( navigator.userAgent ),
      _isAutomatedTest = !_isBrowser || window._phantom;

    // initialise the demo

    Demo.init = function() {
      // some example engine options
      var options = {
        positionIterations: 6,
        velocityIterations: 4,
        enableSleeping: false,
        metrics: { extended: true },
        render: {}
      };

      // create a Matter engine
      // NOTE: this is actually Matter.Engine.create(), see the aliases at top of this file
      var container = document.getElementById( 'canvas-container' );
      _engine = Engine.create( container, options );

      // engine reference for external use
      Matter.Demo._engine = _engine;

      // run the engine
      Engine.run( _engine );

      Demo.mixed();
    };

    // call init when the page has loaded fully

    if ( window.addEventListener ) {
      window.addEventListener( 'load', Demo.init );
    }
    else if ( window.attachEvent ) {
      window.attachEvent( 'load', Demo.init );
    }

    // each demo scene is set up in its own function, see below

    Demo.mixed = function() {
      var _world = _engine.world;

      _world.bounds = {
        min: {
          x: 0, y: 0
        },
        max: { x: 5000, y: 800 }
      };

      Demo.reset();

      var particleOptions = {
        friction: 0.05,
        frictionStatic: 0.1
      };

      var elements = [
        //xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions
        Composites.softBody( 800, 0, 6, 6, 0, 0, true, 10, particleOptions ),
        //Composites.softBody( 250, 300, 8, 3, 0, 0, true, 15, particleOptions ),
        //Composites.softBody( 250, 400, 4, 4, 0, 0, true, 15, particleOptions ),
        Bodies.rectangle( 200, 100, 100, 100 )
      ];
      World.add( _world, elements );

      mrchompyScreenView.elements = elements;
    };

    Demo.reset = function() {
      var _world = _engine.world, i;

      World.clear( _world );
      Engine.clear( _engine );

      // clear scene graph (if defined in controller)
      if ( _engine.render ) {
        var renderController = _engine.render.controller;
        if ( renderController && renderController.clear ) {
          renderController.clear( _engine.render );
        }
      }

      // clear all scene events
      if ( _engine.events ) {
        for ( i = 0; i < _sceneEvents.length; i++ ) {
          Events.off( _engine, _sceneEvents[ i ] );
        }
      }

      if ( _mouseConstraint && _mouseConstraint.events ) {
        for ( i = 0; i < _sceneEvents.length; i++ ) {
          Events.off( _mouseConstraint, _sceneEvents[ i ] );
        }
      }

      if ( _world.events ) {
        for ( i = 0; i < _sceneEvents.length; i++ ) {
          Events.off( _world, _sceneEvents[ i ] );
        }
      }

      if ( _runner && _runner.events ) {
        for ( i = 0; i < _sceneEvents.length; i++ ) {
          Events.off( _runner, _sceneEvents[ i ] );
        }
      }

      if ( _engine.render && _engine.render.events ) {
        for ( i = 0; i < _sceneEvents.length; i++ ) {
          Events.off( _engine.render, _sceneEvents[ i ] );
        }
      }

      _sceneEvents = [];

      // reset id pool
      Common._nextId = 0;

      // reset random seed
      Common._seed = 0;

      _engine.enableSleeping = false;
      _engine.world.gravity.y = 1;
      _engine.world.gravity.x = 0;
      _engine.timing.timeScale = 1;

      var offset = 5;
      World.add( _world, [
        //Bodies.rectangle( 400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true } ),
        Bodies.rectangle( 400, 600 + offset, 10000, 50.5, { isStatic: true } ),
        //Bodies.rectangle( 800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true } ),
        Bodies.rectangle( -offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true } )
      ] );
    };

    Demo.init();

    var triangles = [ { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 50, r: 1, g: 0, b: 0, a: 1 } ];
    var offset = new Vector2( 0, 0 );
    var monsterNode = new MonsterNode( this.layoutBounds.width, this.layoutBounds.height, triangles, offset );
    this.addChild( monsterNode );

    this.events.on( 'layoutFinished', function( dx, dy, width, height ) {
        monsterNode.setCanvasBounds( new Bounds2( -dx, -dy, width - dx, height - dy ) );
      }
    );

    var addRectangle = function( x, y, width, height, r, g, b, a ) {
      triangles.push( { x1: x, y1: y, x2: x + width, y2: y, x3: x + width, y3: y + height, r: r, g: g, b: b, a: a } );
      triangles.push( {
        x1: x,
        y1: y,
        x2: x,
        y2: y + height,
        x3: x + width,
        y3: y + height,
        r: r,
        g: g,
        b: b,
        a: a
      } );
    };

    var timeSinceJump = 1000000;
    this.step = function( dt ) {

      console.log(_engine.pairs.collisionActive.length);
      var force = 0.01;
      if ( pressedKeys[ 39 ] ) {

        // right
        console.log( 'right' );
        Matter.Body.applyForce( mrchompyScreenView.elements[ 0 ].bodies[ 0 ], { x: 0, y: 0 }, { x: force, y: 0 } );
      }
      if ( pressedKeys[ 37 ] ) {
        Matter.Body.applyForce( mrchompyScreenView.elements[ 0 ].bodies[ 0 ], { x: 0, y: 0 }, { x: -force, y: 0 } );
      }
      if ( pressedKeys[ 38 ] && mrchompyScreenView.elements[ 0 ].bodies[ 0 ].position.y > 300 && _engine.pairs.collisionActive.length > 35 ) {
        for ( var i = 0; i < mrchompyScreenView.elements[ 0 ].bodies.length; i++ ) {
          var b = mrchompyScreenView.elements[ 0 ].bodies[ i ];
          Matter.Body.applyForce( b, { x: 0, y: 0 }, {
            x: 0,
            y: -0.40 / mrchompyScreenView.elements[ 0 ].bodies.length
          } );
        }
      }
      triangles.length = 0;
      for ( var i = 0; i < mrchompyScreenView.elements.length; i++ ) {
        var element = mrchompyScreenView.elements[ i ];
        if ( element.bodies ) {
          for ( var k = 0; k < element.bodies.length; k++ ) {
            var body = element.bodies[ k ];

            triangles.push( {
              x1: body.position.x, y1: body.position.y,
              x2: body.position.x + 35, y2: body.position.y,
              x3: body.position.x, y3: body.position.y + 35,
              r: 0.1, g: 0.1, b: 0.1, a: 1
            } );
          }
        }
        else {
          if ( element.label === 'Rectangle Body' ) {
            var body = element;

            triangles.push( {
              x1: body.vertices[ 0 ].x, y1: body.vertices[ 0 ].y,
              x2: body.vertices[ 1 ].x, y2: body.vertices[ 1 ].y,
              x3: body.vertices[ 2 ].x, y3: body.vertices[ 2 ].y,
              r: 0.1, g: 0.1, b: 0.1, a: 1
            } );

            triangles.push( {
              x1: body.vertices[ 0 ].x, y1: body.vertices[ 0 ].y,
              x2: body.vertices[ 2 ].x, y2: body.vertices[ 2 ].y,
              x3: body.vertices[ 3 ].x, y3: body.vertices[ 3 ].y,
              r: 0.1, g: 0.1, b: 0.1, a: 1
            } );
          }
        }
      }

      addRectangle( -1000, -1000, 1000 + 25, 600 + 1000, 0.1, 0.1, 0.1, 0.3 );
      addRectangle( -1000, 600, 10000, 1000, 9 / 255, 46 / 255, 13 / 255, 1 );

      offset.x = -mrchompyScreenView.elements[ 0 ].bodies[ 0 ].position.x + this.layoutBounds.width / 2;
      titleNode.x = offset.x + 420;
      monsterNode.invalidatePaint();
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
      console.log( e.keyCode );
      pressedKeys[ e.keyCode ] = true;
    } );

    addEvent( document, "keyup", function( e ) {
      var e = e || window.event;
      // use e.keyCode
      console.log( e.keyCode );
      pressedKeys[ e.keyCode ] = false;
    } );

    var titleNode = new Image( title, {
      centerX: this.layoutBounds.centerX,
      top: 100
    } );
    this.addChild( titleNode );
  }

  return inherit( ScreenView, MrchompyScreenView, {} );
} );