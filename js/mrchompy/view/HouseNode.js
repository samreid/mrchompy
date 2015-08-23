//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   *
   * @constructor
   */
  function HouseNode() {
    Node.call( this );
    this.addChild( new Rectangle( 0, 0, 300, 300, 10, 10, { fill: 'green' } ) );
    this.addChild( new Path( new Shape().moveTo( 0, 0 ).lineTo( 400, 0 ).lineTo( 200, -200 ).close(), { fill: 'blue' } ) );
  }

  return inherit( Node, HouseNode );
} );