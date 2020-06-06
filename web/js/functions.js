$(document).ready(function () {
  if (getPwd() == "poissy") {
    $("#disconnect").show()
  }
  if ($('#photo').length == 1) {
    $('#photo').change(function (e) {
      let reader = new FileReader();
      reader.onload = function (e) {
        if ($('img').length == 1) {
          $("img").attr('src', e.target.result);
        } else {
          $('#photo').prev('label').before('<img src="' + e.target.result + '" class="thumbnail img-fluid">');
        }
      }
      if (e.target.files.length > 0)
        reader.readAsDataURL(e.target.files[0]);
    });
  }
});

function setLang(lang) {
  Cookies.set('lng', lang, {
    expires: 7
  });
  window.location = window.location;
}

function setPwd(pwd) {
  Cookies.set('pwd', pwd, {
    expires: 7
  });
}

function getPwd() {
  return Cookies.get('pwd');
}