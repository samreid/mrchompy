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
    var Util = require( 'DOT/Util' );

    /**
     *
     * @constructor
     */
    function MonsterNode( monsterModel ) {
      Node.call( this );

      var t = Date.now();
      //var t = 1000;

      var maxAlpha1 = Math.PI / 5;
      var minAlpha1 = 0;

      var maxAlpha2 = Math.PI / 8;
      var minAlpha2 = Math.PI / 16;

      var mouthOpenAmount = monsterModel.mouthOpenAmount;
      var alpha1 = Util.linear( 0, 1, minAlpha1, maxAlpha1, mouthOpenAmount );
      var alpha2 = Util.linear( 0, 1, minAlpha2, maxAlpha2, mouthOpenAmount );
      console.log( alpha1, alpha2 );
      // Linearly interpolate two points and evaluate the line equation for a third point
      // f( a1 ) = b1, f( a2 ) = b2, f( a3 ) = <linear mapped value>
      //linear: function( a1, a2, b1, b2, a3 ) {

      var monsterNode = this;

      // test with oscillation
      //var omega = t / 1000 * 5;
      //var alpha1 = Math.abs( Math.sin( omega ) * (maxAlpha1 - minAlpha1) ) + minAlpha1;
      ////var alpha1 = Math.PI / 5;
      //
      //var alpha2 = Math.abs( Math.sin( omega ) * (maxAlpha2 - minAlpha2) ) + minAlpha2;
      //var alpha2 = Math.PI / 8;

      //this.addChild( new Rectangle( 0, 0, 100, 100, { fill: 'red' } ) );
      //var jawAngle = Math.PI / 4;

      var j1 = 300;
      var j2 = 280;

      var jawPoint1X = j1 * Math.cos( alpha1 );
      var jawPoint1Y = j1 * Math.sin( alpha1 );

      var jawPoint2X = j2 * Math.cos( alpha2 );
      var jawPoint2Y = -j2 * Math.sin( alpha2 );

      var shape = new Shape();
      shape.moveTo( 0, 0 );
      shape.lineTo( jawPoint1X, jawPoint1Y );
      shape.lineTo( -100, 200 );
      shape.lineTo( -200, 0 );
      shape.lineTo( -200, -200 );
      shape.lineTo( -100, -300 );
      shape.lineTo( jawPoint2X, jawPoint2Y );
      shape.close();

      var toRadians = function( degrees ) {
        return degrees / 180 * Math.PI;
      };
      var addLowerTooth = function( distanceFromFrontOfJawToTooth, toothBaseLength, toothHeight, toothAngle ) {
        var tooth1 = new Shape();
        var toothPoint1x = (j1 - distanceFromFrontOfJawToTooth) * Math.cos( alpha1 );
        var toothPoint1y = (j1 - distanceFromFrontOfJawToTooth) * Math.sin( alpha1 );
        tooth1.moveTo( toothPoint1x, toothPoint1y );
        tooth1.lineTo(
          toothPoint1x - toothHeight * Math.cos( alpha1 + toothAngle ),
          toothPoint1y - toothHeight * Math.sin( alpha1 + toothAngle )
        );
        var toothPoint2x = (j1 - distanceFromFrontOfJawToTooth - toothBaseLength) * Math.cos( alpha1 );
        var toothPoint2y = (j1 - distanceFromFrontOfJawToTooth - toothBaseLength) * Math.sin( alpha1 );
        tooth1.lineTo( toothPoint2x, toothPoint2y );
        tooth1.close();
        monsterNode.addChild( new Path( tooth1, { fill: 'white', stroke: 'gray', lineWidth: 2 } ) );
      };

      var addUpperTooth = function( distanceFromFrontOfJawToTooth, toothBaseLength, toothHeight, toothAngle ) {
        var tooth = new Shape();
        var toothPoint1x = (j2 - distanceFromFrontOfJawToTooth) * Math.cos( alpha2 );
        var toothPoint1y = -(j2 - distanceFromFrontOfJawToTooth) * Math.sin( alpha2 );
        tooth.moveTo( toothPoint1x, toothPoint1y );
        tooth.lineTo(
          toothPoint1x - toothHeight * Math.cos( alpha2 + toothAngle ),
          toothPoint1y + toothHeight * Math.sin( alpha2 + toothAngle )
        );
        var toothPoint2x = (j2 - distanceFromFrontOfJawToTooth - toothBaseLength) * Math.cos( alpha2 );
        var toothPoint2y = -(j2 - distanceFromFrontOfJawToTooth - toothBaseLength) * Math.sin( alpha2 );
        tooth.lineTo( toothPoint2x, toothPoint2y );
        tooth.close();
        monsterNode.addChild( new Path( tooth, { fill: 'white', stroke: 'gray', lineWidth: 2 } ) );
      };

      addLowerTooth( 0, 30, 80, toRadians( 60 ) );
      addLowerTooth( 25, 30, 70, toRadians( 70 ) );
      addLowerTooth( 38, 30, 70, toRadians( 65 ) );
      addLowerTooth( 54, 30, 70, toRadians( 60 ) );
      addLowerTooth( 60, 30, 50, toRadians( 50 ) );
      addLowerTooth( 80, 30, 60, toRadians( 60 ) );
      addLowerTooth( 100, 30, 70, toRadians( 60 ) );
      addLowerTooth( 140, 30, 70, toRadians( 70 ) );

      addUpperTooth( 0, 30, 120, toRadians( 70 ) );
      addUpperTooth( 20, 30, 120, toRadians( 70 ) );

      this.addChild( new Path( shape, { fill: 'green', stroke: 'gray' } ) );

      this.addChild( new Path( new Shape().moveTo( 0, -100 ).
          lineToRelative( 20, -50 ).
          lineToRelative( 40, 40 ).
          close(), { fill: 'white', stroke: 'black', lineWidth: 2 }
      ) );
    }

    return inherit( Node, MonsterNode );
  }
);