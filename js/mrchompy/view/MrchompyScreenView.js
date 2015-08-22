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

    // MatterTools aliases
    if ( window.MatterTools ) {
      var Gui = MatterTools.Gui,
        Inspector = MatterTools.Inspector;
    }

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
        metrics: { extended: true }
      };

      // create a Matter engine
      // NOTE: this is actually Matter.Engine.create(), see the aliases at top of this file
      if ( _isBrowser ) {
        var container = document.getElementById( 'canvas-container' );
        _engine = Engine.create( container, options );

        // add a mouse controlled constraint
        _mouseConstraint = MouseConstraint.create( _engine );
        World.add( _engine.world, _mouseConstraint );
      }
      else {
        _engine = Engine.create( options );
        _engine.render = {};
        _engine.render.options = {};
      }

      // engine reference for external use
      Matter.Demo._engine = _engine;

      // skip runner when performing automated tests
      if ( _isAutomatedTest ) {
        return;
      }

      // run the engine
      _runner = Engine.run( _engine );

      // default scene function name
      _sceneName = 'mixed';

      // get the scene function name from hash
      if ( window.location.hash.length !== 0 ) {
        _sceneName = window.location.hash.replace( '#', '' ).replace( '-inspect', '' );
      }

      // set up a scene with bodies
      Demo[ _sceneName ]();

      // set up demo interface (see end of this file)
      Demo.initControls();
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

      Demo.reset();

      var stack = Composites.stack( 20, 20, 15, 4, 0, 0, function( x, y, column, row ) {
        var sides = Math.round( Common.random( 1, 8 ) );

        // triangles can be a little unstable, so avoid until fixed
        sides = (sides === 3) ? 4 : sides;

        // round the edges of some bodies
        var chamfer = null;
        if ( sides > 2 && Common.random() > 0.7 ) {
          chamfer = {
            radius: 10
          };
        }

        switch( Math.round( Common.random( 0, 1 ) ) ) {
          case 0:
            if ( Common.random() < 0.8 ) {
              return Bodies.rectangle( x, y, Common.random( 25, 50 ), Common.random( 25, 50 ), { chamfer: chamfer } );
            }
            else {
              return Bodies.rectangle( x, y, Common.random( 80, 120 ), Common.random( 25, 30 ), { chamfer: chamfer } );
            }
            break;
          case 1:
            return Bodies.polygon( x, y, sides, Common.random( 25, 50 ), { chamfer: chamfer } );
        }
      } );

      mrchompyScreenView.stack = stack;
      World.add( _world, stack );

      var renderOptions = _engine.render.options;
    };

    Demo.reset = function() {
      var _world = _engine.world,
        i;

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

      // reset mouse offset and scale (only required for Demo.views)
      if ( _mouseConstraint ) {
        Mouse.setScale( _mouseConstraint.mouse, { x: 1, y: 1 } );
        Mouse.setOffset( _mouseConstraint.mouse, { x: 0, y: 0 } );
      }

      _engine.enableSleeping = false;
      _engine.world.gravity.y = 1;
      _engine.world.gravity.x = 0;
      _engine.timing.timeScale = 1;

      var offset = 5;
      World.add( _world, [
        Bodies.rectangle( 400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true } ),
        Bodies.rectangle( 400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true } ),
        Bodies.rectangle( 800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true } ),
        Bodies.rectangle( -offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true } )
      ] );

      if ( _mouseConstraint ) {
        World.add( _world, _mouseConstraint );
      }

      if ( _engine.render ) {
        var renderOptions = _engine.render.options;
        renderOptions.wireframes = true;
        renderOptions.hasBounds = false;
        renderOptions.showDebug = false;
        renderOptions.showBroadphase = false;
        renderOptions.showBounds = false;
        renderOptions.showVelocity = false;
        renderOptions.showCollisions = false;
        renderOptions.showAxes = false;
        renderOptions.showPositions = false;
        renderOptions.showAngleIndicator = true;
        renderOptions.showIds = false;
        renderOptions.showShadows = false;
        renderOptions.showVertexNumbers = false;
        renderOptions.showConvexHulls = false;
        renderOptions.showInternalEdges = false;
        renderOptions.showSeparations = false;
        renderOptions.background = '#fff';

        if ( _isMobile ) {
          renderOptions.showDebug = true;
        }
      }
    };

    Demo.initControls = function() {
      //var demoSelect = document.getElementById('demo-select'),
      //  demoReset = document.getElementById('demo-reset');

      // create a Matter.Gui
      //if (!_isMobile && Gui) {
      //  _gui = Gui.create(_engine, _runner);
      //
      //  // need to add mouse constraint back in after gui clear or load is pressed
      //  Events.on(_gui, 'clear load', function() {
      //    _mouseConstraint = MouseConstraint.create(_engine);
      //    World.add(_engine.world, _mouseConstraint);
      //  });
      //
      //  // need to rebind mouse on render change
      //  Events.on(_gui, 'setRenderer', function() {
      //    Mouse.setElement(_mouseConstraint.mouse, _engine.render.canvas);
      //  });
      //}

      // create a Matter.Inspector
      //if (!_isMobile && Inspector && _useInspector) {
      //  _inspector = Inspector.create(_engine, _runner);
      //
      //  Events.on(_inspector, 'import', function() {
      //    _mouseConstraint = MouseConstraint.create(_engine);
      //    World.add(_engine.world, _mouseConstraint);
      //  });
      //
      //  Events.on(_inspector, 'play', function() {
      //    _mouseConstraint = MouseConstraint.create(_engine);
      //    World.add(_engine.world, _mouseConstraint);
      //  });
      //
      //  Events.on(_inspector, 'selectStart', function() {
      //    _mouseConstraint.constraint.render.visible = false;
      //  });
      //
      //  Events.on(_inspector, 'selectEnd', function() {
      //    _mouseConstraint.constraint.render.visible = true;
      //  });
      //}

      // go fullscreen when using a mobile device
      //if (_isMobile) {
      //  var body = document.body;
      //
      //  body.className += ' is-mobile';
      //  _engine.render.canvas.addEventListener('touchstart', Demo.fullscreen);
      //
      //  var fullscreenChange = function() {
      //    var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
      //
      //    // delay fullscreen styles until fullscreen has finished changing
      //    setTimeout(function() {
      //      if (fullscreenEnabled) {
      //        body.className += ' is-fullscreen';
      //      } else {
      //        body.className = body.className.replace('is-fullscreen', '');
      //      }
      //    }, 2000);
      //  };
      //
      //  document.addEventListener('webkitfullscreenchange', fullscreenChange);
      //  document.addEventListener('mozfullscreenchange', fullscreenChange);
      //  document.addEventListener('fullscreenchange', fullscreenChange);
      //}

      // initialise demo selector
      //demoSelect.value = _sceneName;

      //demoSelect.addEventListener('change', function(e) {
      //  Demo[_sceneName = e.target.value]();
      //  Gui.update(_gui);
      //
      //  var scrollY = window.scrollY;
      //  window.location.hash = _sceneName;
      //  window.scrollY = scrollY;
      //});

      //demoReset.addEventListener('click', function(e) {
      //  Demo[_sceneName]();
      //  Gui.update(_gui);
      //});
    };

    Demo.init();

    var triangles = [ { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 50, r: 1, g: 0, b: 0, a: 1 } ];
    var monsterNode = new MonsterNode( this.layoutBounds.width, this.layoutBounds.height, triangles );
    this.addChild( monsterNode );

    this.events.on( 'layoutFinished', function( dx, dy, width, height ) {
        monsterNode.setCanvasBounds( new Bounds2( -dx, -dy, width - dx, height - dy ) );
      }
    );

    this.step = function( dt ) {
      triangles.length = 0;
      for ( var i = 0; i < mrchompyScreenView.stack.bodies.length; i++ ) {
        var element = mrchompyScreenView.stack.bodies[ i ];
        triangles.push( {
          x1: element.position.x, y1: element.position.y,
          x2: element.position.x + 10, y2: element.position.y,
          x3: element.position.x, y3: element.position.y + 10, r: 1, g: 0, b: 0, a: 1
        } );
      }
      monsterNode.invalidatePaint();
    };
  }

  return inherit( ScreenView, MrchompyScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    step: function( dt ) {

      //TODO Handle view animation here.
    }
  } );
} );