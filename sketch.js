 var drawing = [];
 var currentPath = [];
 var colorpicker;
 var colorpicker2;
 var isDrawing = false;
 var name;
function setup(){

  database = firebase.database();

  var ref = database.ref('drawings');
  ref.on('value',gotData,error)

  canvas = createCanvas(1000,700);
  canvas.parent('canvascontainer')
  canvas.mousePressed(startPath);
  canvas.mouseReleased(stopDrawing);
  colorpicker = createColorPicker('black');
  colorpicker.position(10,height-680);
  colorpicker2 = createColorPicker(color('grey'));
  colorpicker2.position(60,height-680);

  S = createInput('EnterName');
  O = createButton('OK!')
  
  save = createButton('SAVE');
  save.mousePressed(()=>{
    var ref = database.ref('drawings');
    var data = {
     name: S.value(),
     drawing:drawing
    }
   var result =  ref.push(data,dataSent);
   console.log(result.key);
  })

  clear = createButton('CLEAR');
  clear.mousePressed(()=>{
    drawing = [];
  })

  

  function dataSent(err, status){
     console.log(status);
  }
}
function startPath(){
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath)
}
function stopDrawing(){
  isDrawing = false;
}

function draw(){
  background(colorpicker2.color())

  save.position(width+10,20);
  clear.position(width+10,50)
   S.position(400,350);
   O.position(575,350);
   O.mousePressed(()=>{
     S.hide();
     O.hide();
 
   })

  
 if(isDrawing){
     var point = {
       x:mouseX,
       y:mouseY
     }
     currentPath.push(point);
   }
   
   stroke(colorpicker.color());
   strokeWeight(10);
   noFill();
   for(var i = 0; i < drawing.length; i++){
     beginShape();
    var path = drawing[i];
     
    for(var j = 0; j < path.length; j++){
    
    vertex(path[j].x,path[j].y);
    }
   endShape(); 
   }
   
}

function gotData(data){

  var T = selectAll('.listing')

  for(var i = 0;i<T.length;i++){
    T[i].remove();
  }


var drawings = data.val();
var keys = Object.keys(drawings)
for(var i = 0;i<keys.length;i++){
  var key = keys[i];
  //console.log(key);
  var li = createElement('li','');
  li.class('listing');
  var aref = createA('#', key);
  aref.mousePressed(showDrawing);
  aref.parent(li);
  li.parent('drawinglist')
}
}

function showDrawing(){
  var key = this.html();

  var ref = database.ref('drawings/'+key);
  ref.once('value',oneDrawing,error);
  //console.log(this.html());

  function oneDrawing(data){
    var adrawing = data.val();
    drawing = adrawing.drawing;

  }
  function error(err){
    console.log(err);
  }
}

function error(err){
  console.log(err);
}