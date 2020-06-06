<?php

namespace Controller;

class AdminController extends Controller
{

  public function loadHumans()
  {
    return $this->getModel('Model\HumanModel')->selectAllHuman();
  }

  public function saveHumans($infos)
  {
    $this->getModel('Model\HumanModel')->deleteAllHuman();
    foreach ($infos as $info) {
      $this->getModel('Model\HumanModel')->insertHuman($info);
    }
    return true;
  }

}
