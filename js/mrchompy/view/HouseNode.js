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
  function HouseNode( options ) {
    Node.call( this );
    var houseBody = new Rectangle( 0, 0, 200, 200, 10, 10, { fill: '#22212c' } );
    this.addChild( houseBody );
    this.addChild( new Path( new Shape().moveTo( 0, 0 ).lineTo( 300, 0 ).lineTo( 150, -150 ).close(), {
      fill: '#22212c',
      centerX: houseBody.centerX
    } ) );
    this.mutate(options);
  }

  return inherit( Node, HouseNode );
} );