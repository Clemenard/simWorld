function LogMessage(type="general",message="Nothing to say",related=new Array(),town=-1,age=dc.age){
    this.type=type;
    this.message=message;
    this.age=age;
    this.town=town;
    this.related=related;
    dc.alivelogList.push(this);

}
LogMessage.prototype.display= function(){
    let display=utils.applyBBCode(this.message);
    return "<strong>"+utils.getDate(this.age)+","+dc.getOneBy("town","id",this.town).name+"</strong> : "+display+"<br>";}
