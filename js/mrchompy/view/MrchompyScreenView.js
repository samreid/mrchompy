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
      this.removeChild( monsterNode );

      monsterNode = new MonsterNode();
      monsterNode.x = 200;
      monsterNode.bottom = ground.top;
      this.addChild( monsterNode );
    };
  }

  return inherit( ScreenView, MrchompyScreenView );
} );