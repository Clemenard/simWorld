function LogMessage(type="general",message="Nothing to say",age=undefined,related=new Array()){
    this.type=type;
    this.message=message;
    this.age=age;
    this.related=related
}
LogMessage.prototype.display= function(){
    let display=this.message.replace(/\[(\w*?) id=(\d+)\](.*?)\[\/id\]/g,"<span class='$1 link' value='$2' title='id : $2'>$3</span>")
    return "<strong>"+(this.age%12+1)+""+utils.numberParticle(this.age%12+1)+" month of the "+Math.floor(this.age/12)+" year</strong> : "+display+"<br>";}
