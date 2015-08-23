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

  /**
   *
   * @constructor
   */
  function PersonNode( person ) {
    Node.call( this );
    this.addChild( new Rectangle( person.x, person.y, 50, 50, 20, 20, { fill: 'yellow', stroke: 'red' } ) );
  }

  return inherit( Node, PersonNode );
} );