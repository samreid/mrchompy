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

  var hairShape = new Shape();
  hairShape.moveTo( 0, 0 );
  hairShape.lineTo( 50, 50 );
  hairShape.lineTo( 0, 50 );
  hairShape.close();

  var text = new Text( 'x', { fontSize: 28 } );

  /**
   *
   * @constructor
   */
  function PersonNode( person, options ) {
    Node.call( this );
    var head = new Rectangle( 0, 0, 40, 40, 12, 12, { fill: 'yellow' } );
    this.addChild( head );

    var eyeNode = new Rectangle( 6, 12, 14, 14, 5, 5, { fill: 'white' } );

    var pupil = new Circle( 4, { left: eyeNode.left, centerY: eyeNode.centerY, fill: 'black' } );

    if ( person.dead ) {
      this.addChild( new Node( { children: [ text ], center: eyeNode.center } ) );
    }
    else {
      this.addChild( eyeNode );
      this.addChild( pupil );
    }

    var body = new Rectangle( 0, 0, 40, 100, 20, 20, {
      fill: 'yellow',
      top: head.bottom,
      centerX: head.centerX
    } );
    this.addChild( body );

    //var hairNode = new Path( hairShape, { fill: 'red', bottom: head.top, left: head.left } );
    //this.addChild( hairNode )
    this.mutate(options);
  }

  return inherit( Node, PersonNode );
} );