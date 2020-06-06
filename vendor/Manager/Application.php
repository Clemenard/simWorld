<?php
namespace Manager;
final class Application{
  private $controller;
  private $action;
  private $argument='';
  private $argumentBis='';
private $inc=0;

public function __construct(){
  $tab=explode('/',$_SERVER['REQUEST_URI']);
  if(!empty($tab[2+$this->inc]) && file_exists(__DIR__ . '/../../src/Controller/'.ucfirst($tab[2+$this->inc]).'Controller.php')){
    $this->controller = 'Controller\\'.ucfirst($tab[2+$this->inc]).'Controller';
  }
  else{
  $this->controller =  'Controller\PhotoController';
  }
  if(!empty($tab[3+$this->inc])) {
    $this->action = $tab[3+$this->inc];
  }
  else{
    $this->controller =  'Controller\PhotoController';
    $this->action = 'all';
  }
  if(!empty($tab[4+$this->inc])) {
    $this->argument = urldecode($tab[4+$this->inc]);
  }
  if(!empty($tab[5+$this->inc])) {
    $this->argumentBis = urldecode($tab[5+$this->inc]);
  }

}

public function run(){

  if(!is_null($this->controller)){
    $a=new $this->controller;
    if(!is_null($this->action) && method_exists($a,$this->action)){
      $action=$this->action;
      $a->$action($this->argument,$this->argumentBis);
    }
    else{
      require __DIR__.'/../../src/View/404.html';
    }
  }
}
}
