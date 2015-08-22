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

    var rays = [ { tail: new Vector2( 0, 0 ), tip: new Vector2( 100, 100 ) } ];
    var monsterNode = new MonsterNode( this.layoutBounds.width, this.layoutBounds.height, rays );
    this.addChild( monsterNode );

    this.events.on( 'layoutFinished', function( dx, dy, width, height ) {
        monsterNode.setCanvasBounds( new Bounds2( -dx, -dy, width - dx, height - dy ) );
      }
    );
  }

  return inherit( ScreenView, MrchompyScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );