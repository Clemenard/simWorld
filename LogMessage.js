function LogMessage(type="general",message="Nothing to say",age=undefined,related=new Array()){
    this.type=type;
    this.message=message;
    this.age=age;
    this.related=related
}
LogMessage.prototype.display= function(){
    let display=utils.applyBBCode(this.message);
    return "<strong>"+(this.age%12+1)+""+utils.numberParticle(this.age%12+1)+" month of the "+Math.floor(this.age/12)+" year</strong> : "+display+"<br>";}
