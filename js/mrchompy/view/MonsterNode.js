define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var WebGLNode = require( 'SCENERY/nodes/WebGLNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ModelViewTransform2} modelViewTransform - converts between model and view co-ordinates
   * @param {number} stageWidth - width of the dev area
   * @param {number} stageHeight - height of the dev area
   * @param {ObservableArray.<LightRay>} rays -
   * @constructor
   */
  function MonsterNode( stageWidth, stageHeight, rays ) {

    WebGLNode.call( this, {
      canvasBounds: new Bounds2( 0, 0, stageWidth, stageHeight )
    } );
    this.stageHeight = stageHeight; // @private
    this.stageWidth = stageWidth; // @private

    this.rays = rays;
    this.invalidatePaint();

    this.strokeWidth = 10;
  }

  return inherit( WebGLNode, MonsterNode, {

    initializeWebGLDrawable: function( drawable ) {
      var gl = drawable.gl;

      // Simple example for custom shader
      var vertexShaderSource = [
        // Position
        'attribute vec3 aPosition;',
        'attribute vec4 aColor;',
        'varying vec4 vColor;',
        'uniform mat3 uModelViewMatrix;',
        'uniform mat3 uProjectionMatrix;',

        'void main( void ) {',
        '  vColor = aColor;',

        // homogeneous model-view transformation
        '  vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );',

        // homogeneous map to to normalized device coordinates
        '  vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );',

        // combine with the z coordinate specified
        '  gl_Position = vec4( ndc.xy, aPosition.z, 1.0 );',
        '}'
      ].join( '\n' );

      // Simple demo for custom shader
      var fragmentShaderSource = [
        'precision mediump float;',
        'varying vec4 vColor;',

        // Returns the color from the vertex shader
        'void main( void ) {',
        '  gl_FragColor = vColor;',
        '}'
      ].join( '\n' );

      drawable.shaderProgram = new ShaderProgram( gl, vertexShaderSource, fragmentShaderSource, {
        attributes: [ 'aPosition', 'aColor' ],
        uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix' ]
      } );

      drawable.vertexBuffer = gl.createBuffer();
      drawable.colorBuffer = gl.createBuffer();

      this.updateBuffers( drawable );
    },
    updateBuffers: function( drawable ) {
      var gl = drawable.gl;

      var points = [];
      var colors = [];

      for ( var i = 0; i < this.rays.length; i++ ) {
        var ray = this.rays[ i ];

        // iPad3 shows a opacity=0 ray as opacity=1 for unknown reasons, so we simply omit those rays

        var x1 = ray.tail.x;
        var y1 = ray.tail.y;
        var x2 = ray.tip.x;
        var y2 = ray.tip.y;

        var distance = Math.sqrt( (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) );
        var unitVectorX = (x2 - x1) / distance;
        var unitVectorY = (y2 - y1) / distance;

        var perpendicularVectorX = -unitVectorY * this.strokeWidth / 2;
        var perpendicularVectorY = unitVectorX * this.strokeWidth / 2;

        points.push(
          x1 + perpendicularVectorX, y1 + perpendicularVectorY, 0.2,
          x2 + perpendicularVectorX, y2 + perpendicularVectorY, 0.2,
          x1 - perpendicularVectorX, y1 - perpendicularVectorY, 0.2,

          x1 - perpendicularVectorX, y1 - perpendicularVectorY, 0.2,
          x2 + perpendicularVectorX, y2 + perpendicularVectorY, 0.2,
          x2 - perpendicularVectorX, y2 - perpendicularVectorY, 0.2
        );

        colors.push(
          1, 0, 0, 1,
          1, 0, 0, 1,
          1, 0, 0, 1,

          1, 0, 0, 1,
          1, 0, 0, 1,
          1, 0, 0, 1
        );
      }

      gl.bindBuffer( gl.ARRAY_BUFFER, drawable.vertexBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

      gl.bindBuffer( gl.ARRAY_BUFFER, drawable.colorBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
    },

    paintWebGLDrawable: function( drawable, matrix ) {
      this.updateBuffers( drawable );

      var gl = drawable.gl;
      var shaderProgram = drawable.shaderProgram;

      shaderProgram.use();

      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uModelViewMatrix, false, matrix.entries );
      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uProjectionMatrix, false, drawable.webGLBlock.projectionMatrixArray );

      gl.bindBuffer( gl.ARRAY_BUFFER, drawable.vertexBuffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aPosition, 3, gl.FLOAT, false, 0, 0 );

      gl.bindBuffer( gl.ARRAY_BUFFER, drawable.colorBuffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aColor, 4, gl.FLOAT, false, 0, 0 );

      // 2 triangles per ray
      gl.drawArrays( gl.TRIANGLES, 0, this.rays.length * 3 * 2 );

      shaderProgram.unuse();
    },

    disposeWebGLDrawable: function( drawable ) {
      drawable.shaderProgram.dispose();
      drawable.gl.deleteBuffer( drawable.vertexBuffer );

      drawable.shaderProgram = null;
    },
    step: function() {
      this.invalidatePaint();
    }
  } );
} );