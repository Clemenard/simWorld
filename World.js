function World(duration=50,startPop=100,maxPop=200000){
    this.duration=duration;
    this.startPop=startPop;
    this.maxPop=maxPop;
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
