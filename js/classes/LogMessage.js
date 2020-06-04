function LogMessage(type="general",message="Nothing to say",related=new Array(),age=world.age){
    this.type=type;
    this.message=message;
    this.age=age;
    this.related=related
}
LogMessage.prototype.display= function(){
    let display=utils.applyBBCode(this.message);
    return "<strong>"+utils.getDate(this.age)+"</strong> : "+display+"<br>";}
