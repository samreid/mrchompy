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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   *
   * @constructor
   */
  function PersonNode( person ) {
    Node.call( this );
    var head = new Rectangle( 0, 0, 50, 50, 20, 20, { fill: 'yellow', stroke: 'red' } );
    this.addChild( head );

    var hairShape = new Shape();
    hairShape.moveTo( 0, 0 );
    hairShape.lineTo( 50, 50 );
    hairShape.lineTo( 0, 50 );
    hairShape.close();

    var eyeNode = new Rectangle( 6, 12, 14, 14, 5, 5, { fill: 'white', stroke: 'black' } );

    var pupil = new Circle( 4, { left: eyeNode.left, centerY: eyeNode.centerY, fill: 'black' } );

    if ( person.dead ) {
      this.addChild( new Text( 'x', { fontSize: 28, center: eyeNode.center } ) );
    }
    else {
      this.addChild( eyeNode );
      this.addChild( pupil );
    }

    var body = new Rectangle( 0, 0, 40, 100, 20, 20, {
      fill: 'yellow',
      stroke: 'red',
      top: head.bottom,
      centerX: head.centerX
    } );
    this.addChild( body );

    var hairNode = new Path( hairShape, { fill: 'red', stroke: 'yellow', bottom: head.top, left: head.left } );
    this.addChild( hairNode )
  }

  return inherit( Node, PersonNode );
} );