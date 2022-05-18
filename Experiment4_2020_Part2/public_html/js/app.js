"use strict";

var gl;
var pointsArray = [];
var colorsArray= [];
var surfPoints = [];
var surfColors = [];
var objtodraw;
var Tx = 0.0, Ty = 0.0, Tz = 0.0;
var u_Translation;
var ssx ;
var ssy ;
var ssz ;
var sx = 1.0;
var sy = 1.0;
var sz = 1.0;
var ANGLE = 0;
var ANGLE1 = 0;
var thetaLoc;
var scalefac ;
var scale = 0.0;
var incr = 2;
var flag = true;

window.onload = function() {
    init();
};

async function init(){
    
    const canvas = document.querySelector("#canvas");
    gl = canvas.getContext("webgl2");
    
    if(!gl) {
        alert("not supported");
        return;
    }
    
    const response = await fetch('dragon/dragon_10k.obj');
    const text = await response.text();
    const data = parseOBJ(text);
    for(var i=0; i < data[0].length; i++){
        pointsArray.push(data[0][i*3], data[0][i*3+1], data[0][i*3+2], 1.0);
    }
    for(var i = 0; i < data[0].length ; i++){
        colorsArray.push(0.0, 1.0, 0.0, 1.0);
    }
    
    surfPoints.push(-1.0, -0.5, -1.0, 1.0);
    surfPoints.push(1.0, -0.5, -1.0, 1.0);
    surfPoints.push(1.0, 0.5, 1.0, 1.0);
    surfPoints.push(-1.0, -0.5, -1.0, 1.0);
    surfPoints.push(1.0, 0.5, 1.0, 1.0);
    surfPoints.push(-1.0, 0.5, 1.0, 1.0);
    
    surfColors.push(1.0, 0.0, 0.0, 1.0);
    surfColors.push(1.0, 0.0, 0.0, 1.0);
    surfColors.push(1.0, 0.0, 0.0, 1.0);
    surfColors.push(1.0, 0.0, 0.0, 1.0);
    surfColors.push(1.0, 0.0, 0.0, 1.0);
    surfColors.push(1.0, 0.0, 0.0, 1.0);
    
    
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //creating shaders
    const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, vs);
    gl.compileShader(vertex_shader);
    if ( !gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS) ) {
        var info = gl.getShaderInfoLog(vertex_shader);
        alert("error: \n" + info);
        return;
    }
    
    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, fs);
    gl.compileShader(fragment_shader);
    if ( !gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS) ) {
        var info = gl.getShaderInfoLog(fragment_shader);
        alert("error :  \n" + info);
        return;
    }
    //creating program
    const program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
        var info = gl.getProgramInfoLog(program);
        alert("error : \n" + info);
        return;
    }
    gl.useProgram(program);

    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var v1Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, v1Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(surfPoints), gl.STATIC_DRAW );
    
    var c1Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, c1Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(surfColors), gl.STATIC_DRAW );
    
    
    
    ssx = gl.getUniformLocation(program, "sx");
    ssy = gl.getUniformLocation(program, "sy");
    ssz = gl.getUniformLocation(program, "sz");
    thetaLoc = gl.getUniformLocation(program, "angle");
    scalefac = gl.getUniformLocation(program, "scale");
    u_Translation = gl.getUniformLocation(program, 'u_Translation');


    document.body.addEventListener('keydown', keyPressed);

    objtodraw = [
        {buffer: vBuffer,
        vertex_location: vPosition,
        coord: pointsArray,
        color_location: vColor}/*,
        {buffer: v1Buffer,
        vertex_location: vPosition,
        coord: surfPoints,
        color_location: vColor}*/
    ];   
    //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //objtodraw.forEach(function(object){
    //        gl.drawArrays( gl.TRIANGLES, 0, object.coord.length);
    //});
    var a = pointsArray.length;
    console.log(a);
    render();
    function render(){
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        sx = 4.0;
        sy = 4.0;
        sz = 4.0;
        scale = 1.0;
        gl.uniform1f(scalefac, scale);
        Ty = -1.0;
        gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

        objtodraw.forEach(function(object){
            if(object.coord.length === 359964){
                ANGLE -= incr;
                gl.uniform1f(ssx, sx);
                gl.uniform1f(ssy, sy);
                gl.uniform1f(ssz, sz);
                gl.uniform1f(thetaLoc, ANGLE * Math.PI/180);

                gl.drawArrays( gl.TRIANGLES, 0, object.coord.length);
            }
            else{
                ANGLE1=ANGLE;
                ANGLE = 0;
                gl.uniform1f(ssx, sx);
                gl.uniform1f(ssy, sy);
                gl.uniform1f(ssz, sz);
                gl.drawArrays( gl.TRIANGLES, 0, object.coord.length);
                ANGLE = ANGLE1;
            }
            
            

        });
        requestAnimationFrame(render);
    }
}
function keyPressed(e){
        switch(e.key) {
          
          case '-':
              incr -= 1;
              break;
          case '+':
              incr += 1;
              
              break;
        }
        e.preventDefault();
        
}

function parseOBJ(text) {
    text = text.trim() + "\n";
    
    var line,
        itm,
        ind,
        cVert=[],
        fVert=[],
        posA=0,
        posB=text.indexOf("\n", 0);
        
    while(posB > posA){
        line = text.substring(posA, posB).trim();
        
        switch(line.charAt(0)){
            case "v":
                itm = line.split(" ");
                itm.shift();
                switch(line.charAt(1)){
                    case " ":cVert.push(parseFloat(itm[0]), parseFloat(itm[1]), parseFloat(itm[2]));break;
                }
            break;
            
            case "f":
                itm = line.split(" ");
                itm.shift();
                //fVert.push(parseInt(itm[0]), parseInt(itm[1]), parseInt(itm[2]));
                for(var i = 0; i < itm.length ; i++){
                    ind = (parseInt(itm[i])-1)*3;
                    fVert.push(cVert[ind], cVert[ind+1], cVert[ind+2]);
                }
            break;
        }
        posA = posB + 1;
        posB = text.indexOf("\n", posA);
    }
    return[fVert];
}
