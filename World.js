function World(duration=50,startPop=100,maxPop=10000,frameDuration=20){
    this.duration=(duration>1)?duration:50;
    this.startPop=(startPop>1)?startPop:100;
    this.maxPop=(maxPop>10)?maxPop:10000;
    this.frameDuration=(frameDuration>5)?frameDuration:20;
    this.aliveHumanList=new Array();
    this.deadHumanList=new Array();
    this.logsList=new Array();
    this.lastHumanId=0;
    this.age=0;
    for(let i=0;i<this.startPop;i++){
        this.aliveHumanList.push(new Human(true));
        this.aliveHumanList[i].id=this.lastHumanId;
        this.lastHumanId++;
    }
}
