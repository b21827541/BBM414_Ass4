

var canvas;
var gl;
var flag = false;
var RADIUS = 20;

var NumVertices  = 18;

var pointsArray = [
         ];
var colorsArray = [vec4( 1.0, 0.0, 0.0, 1.0 ),vec4( 1.0, 0.0, 0.0, 1.0 ),vec4( 1.0, 0.0, 0.0, 1.0 ),//red
                   vec4( 1.0, 1.0, 0.0, 1.0 ),vec4( 1.0, 1.0, 0.0, 1.0 ),vec4( 1.0, 1.0, 0.0, 1.0 ),//yel
                   vec4( 1.0, 0.0, 1.0, 1.0 ), vec4( 1.0, 0.0, 1.0, 1.0 ),  vec4( 1.0, 0.0, 1.0, 1.0 ),  //mag
                   vec4( 1.0, 0.0, 1.0, 1.0 ),  vec4( 1.0, 0.0, 1.0, 1.0 ),  vec4( 1.0, 0.0, 1.0, 1.0 ),  //mag
                   vec4( 0.0, 1.0, 0.0, 1.0 ),vec4( 0.0, 1.0, 0.0, 1.0 ),vec4( 0.0, 1.0, 0.0, 1.0 ),//green
                   vec4( 0.0, 0.0, 1.0, 1.0 ),vec4( 0.0, 0.0, 1.0, 1.0 ),vec4( 0.0, 0.0, 1.0, 1.0 )//blue
         ];

var vertices = [
    vec4(0.0, 0.5, 1.0, 1.0),
    
    vec4(-0.5, -0.5,  1.5, 1.0),
    //vec4(-0.5,  0.5,  1.5, 1.0),
    //vec4(0.5,  0.5,  1.5, 1.0),
    vec4(0.5, -0.5,  1.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    //vec4(-0.5,  0.5, 0.5, 1.0),
    //vec4(0.5,  0.5, 0.5, 1.0),
    vec4( 0.5, -0.5, 0.5, 1.0) 
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];


var near = 0.3;
var far = 3.0;
var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);



function quad(a, b, c) {
     pointsArray.push(vertices[a]); 
     //colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[b]); 
     //colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     //colorsArray.push(vertexColors[a]);     
     //pointsArray.push(vertices[a]); 
     //colorsArray.push(vertexColors[a]); 
     //pointsArray.push(vertices[c]); 
     //colorsArray.push(vertexColors[a]); 
     //pointsArray.push(vertices[d]); 
     //colorsArray.push(vertexColors[a]);  
}

function colorCube()
{
    quad( 0, 1, 2 );
    quad( 0, 2, 4 );
    quad( 2, 1, 3 );
    quad( 4, 2, 3 );
    quad( 0, 3, 4 );
    quad( 0, 3, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    aspect =  canvas.width/canvas.height;
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

// sliders for viewing parameters

    document.getElementById("zFarSlider").onchange = function() {
        far = event.srcElement.value;
    };
    document.getElementById("zNearSlider").onchange = function() {
        near = event.srcElement.value;
    };
    document.getElementById("radiusSlider").onchange = function() {
       radius = event.srcElement.value;
    };
    
    document.getElementById("aspectSlider").onchange = function() {
        aspect = event.srcElement.value;
    };
    document.getElementById("fovSlider").onchange = function() {
        fovy = event.srcElement.value;
    };
    
    
 
    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;
                
                  
    document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;
                              
    

    
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

        
                 
    document.addEventListener('keydown', keyPressed);    
    
    render();
}
function onMouseMove(e){
        theta += e.movementX/40;
        phi += e.movementY/40;
        if (theta > canvas.width + RADIUS) {
          theta = -RADIUS;
        }
        if (phi > canvas.height + RADIUS) {
          phi = -RADIUS;
        }  
        if (theta < -RADIUS) {
          theta = canvas.width + RADIUS;
        }
        if (phi < -RADIUS) {
          phi = canvas.height + RADIUS;
        }
        
        console.log(theta);
}
function lockChangeAlert() {
          if (document.pointerLockElement === canvas ||
              document.mozPointerLockElement === canvas ) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updatePosition, false);
          } else {
            console.log('The pointer lock status is now unlocked');  
            document.removeEventListener("mousemove", updatePosition, false);
          }
        }
function keyPressed(e) {
    switch(e.key) {
        case 'p':
            if(!flag){
                canvas.addEventListener("mousemove", onMouseMove, false);
                flag = true;
            }else{
                flag = false;
                canvas.removeEventListener("mousemove", onMouseMove, false);
            }
            break;
            
    }
 }

var render = function(){
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
            
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    requestAnimFrame(render);
}

