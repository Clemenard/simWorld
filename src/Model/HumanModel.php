<?php

namespace Model;

use PDO;

class HumanModel extends Model
{

  public function selectAllHuman($order = '', $asc = "")
  {
  }
  public function selectHuman($id)
  {
    return $this->select($id);
  }

  public function deleteHuman($id)
  {
    return $this->delete($id);
  }

  public function insertHuman($infos)
  {
    return $this->insert($infos);
  }

  public function updateHuman($id, $infos)
  {
    return $this->update($id, $infos);
  }

  public function deleteAllHuman()
  {
    return $this->deleteAll();
  }

}
