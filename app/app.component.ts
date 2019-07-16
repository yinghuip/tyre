import {
  Component, ElementRef, OnInit
} from '@angular/core';

@Component({
  selector: 'material-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
circle: any[] = [
  {Id: 1,Label:1}
  ,{Id: 2,Label:2}
  ,{Id: 3,Label:3}
    ,{Id: 4,Label:4}
  ,{Id: 5,Label:5}
    ,{Id: 6,Label:6}
  
  ];
Section;
innerRadius = 50;
outerRadius = 100;
textRadius = 85;
tireSelected = 0;
selectedColor;
centerX = 125;
centerY = 125;
colors = [
            { value: '#0099FF', Name: 'Aqua' },
            { value: '#0066FF', Name: 'Blue' },
            { value: '#996600', Name: 'Brown' },
            { value: '#669900', Name: 'Green' },
            { value: '#66CC00', Name: 'Lime' },
            { value: '#FF6600', Name: 'Orange' },
            { value: '#9900FF', Name: 'Purple' },
            { value: '#CC0000', Name: 'Red' },
            { value: '#FFCC00', Name: 'Yellow' }
        ];


ngOnInit(){
 this.renderCircle();
}

selectColor(color){
let sector = this.circle.find(i=> i.Id == this.tireSelected);
if(sector)
sector['color']=this.selectedColor.value;
}

enlarge(Id){
  if (Id == this.tireSelected){
    this.renderCircle();
    this.tireSelected= null;
  }
  else{
    this.selectedColor = "";
    let startAngle = 0;
    let endAngle = 0;
    this.circle = this.circle.map((s,index)=> {
    endAngle += 360/this.circle.length;
    s['d'] = this.render(this.centerX,this.centerY
    ,startAngle,endAngle
    ,s.Id == Id ?this.innerRadius + 15 : this.innerRadius
    ,s.Id == Id ? this.outerRadius + 15: this.outerRadius);

    s['textPath'] = this.renderTextPath(this.centerX,this.centerY
    ,startAngle,endAngle
    ,s.Id == Id ?this.textRadius + 15 : this.textRadius
    ,s.Id == Id ? this.textRadius + 15: this.textRadius);
    startAngle += 360/this.circle.length;
    return s;
  });
    this.tireSelected= Id;
    const color = this.circle.find(s=>s.Id == Id)['color'];
    if(color){
    this.selectedColor = this.colors
    .find(s=>s.value == color); 
    }
  
  }
}

change($event){
 
  const numberOfSection = $event;
  this.circle =  [];
  for(let i = 0 ; i< numberOfSection ; i++){
    this.circle.push({Id: i+ 1, Label: i+1});
  };
  this.renderCircle();
}


renderCircle(){
   let startAngle = 0;
   let endAngle =0;
    this.circle = this.circle.map((s,index)=> {
    endAngle += 360/this.circle.length;
    s['d'] = this.render(this.centerX,this.centerY,startAngle,endAngle, this.innerRadius,this.outerRadius);
    s['textPath'] = this.renderTextPath(this.centerX,this.centerY,startAngle,endAngle, this.innerRadius,this.textRadius);
    startAngle += 360/this.circle.length;
    return s;
  });
}

render(centerX,centerY,startAngle,endAngle,innerRadius,outerRadius){
    if(this.circle.length === 1) endAngle = 359.9;
     const p = this.caluculateArc(centerX,centerY,startAngle,endAngle,innerRadius,outerRadius);
    const angleDiff   = p[4][1] - p[4][0];
    let largeArc    = ((angleDiff % (Math.PI * 2)) > Math.PI ? 1 : 0);
    let commands    = []

  if(this.circle.length > 1){
      commands.push("M" + p[0].join());
      commands.push("L" + p[1].join());
      commands.push("A" + [ outerRadius, outerRadius ].join() + " 0 " + largeArc + "1" + p[2].join());
      commands.push("L" + p[3].join());
      commands.push("A" + [ innerRadius, innerRadius ].join() + " 0 " +  largeArc + 
      "0"  + p[0].join());
      commands.push("z");
  }
  else{
    commands.push("M " + p[1].join());
    commands.push("A " + [ outerRadius, outerRadius ].join() + " 0 " + 1 + "1" + p[2].join());
    commands.push("M " + p[0].join());
    commands.push("A " + [ innerRadius, innerRadius ].join() + " 0 " + 1 + "1"+ p[3].join());
  }



    return commands.join(" ");
}

caluculateArc(centerX,centerY,startAngle,endAngle,innerRadius,outerRadius){
    const startAngleInRadians  = (startAngle-90) * Math.PI / 180.0;
    const endAngleInRadians    = (endAngle-90) * Math.PI / 180.0;
    const p           = [ 
        [ centerX+innerRadius*Math.cos(startAngleInRadians),     centerY+innerRadius*Math.sin(startAngleInRadians) ],
        [ centerX+outerRadius*Math.cos(startAngleInRadians),     centerY+outerRadius*Math.sin(startAngleInRadians) ],
        [ centerX+outerRadius*Math.cos(endAngleInRadians),       centerY+outerRadius*Math.sin(endAngleInRadians) ],
        [ centerX+innerRadius*Math.cos(endAngleInRadians),       centerY+innerRadius*Math.sin(endAngleInRadians) ],
        [startAngleInRadians,endAngleInRadians]
    ]

    return p;
}


renderTextPath(centerX,centerY,startAngle,endAngle,innerRadius,outerRadius){
    const p = this.caluculateArc(centerX,centerY,startAngle,endAngle,innerRadius,outerRadius);
    const angleDiff   = p[4][1] - p[4][0];
    let largeArc    = ((angleDiff % (Math.PI * 2)) > Math.PI ? 1 : 0);

    let commands    = []
    commands.push("M" + p[1].join());
    commands.push("A" + [ outerRadius, outerRadius ].join() + " 0 " + largeArc + "1" + p[2].join());

    return commands.join(" ");
}


}


/**
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */