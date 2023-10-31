
function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3500/complaints");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      var num = 1;
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        console.log(object);
        trHTML += "<tr>";
        trHTML += "<td>" + num + "</td>";
        trHTML += "<td>" + object["username"] + "</td>";
        trHTML += "<td>" + object["password"] + "</td>";
        trHTML += "<td>" + object["position"] + "</td>";
        trHTML += "<td>"     
        trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object["_id"] + '\')"><i class="fas fa-edit"></i></a>';
        trHTML += "&nbsp;"
        trHTML += "&nbsp;"
        trHTML += "&nbsp;"
        trHTML += "&nbsp;"
        trHTML += "&nbsp;"
        trHTML += "&nbsp;"  
        trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object["_id"] + '\')"><i class="fas fa-trash"></i></a></word-spacing:30px;>';
        trHTML += "</tr>";

        num++;
      }
      document.getElementById("mytable").innerHTML = trHTML;


    }
  };
}

function loadQueryTable() {
  document.getElementById("mytable").innerHTML = '<tr><th scope=\"row\" colspan=\"5\">Loading...</th></tr>';
  const searchText = document.getElementById("searchTextBox").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3500/complaints/Admin/" + searchText);

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      var num = 1;
      const objects = JSON.parse(this.responseText).Complaint;
      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += "<td>" + num + "</td>";
        trHTML += "<td>" + object["username"] + "</td>";
        trHTML += "<td>" + object["password"] + "</td>";
        trHTML += "<td>" + object["position"] + "</td>";

        trHTML += "<td>";
        trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object["_id"] + '\')"><i class="fas fa-edit"></i></a>';
        trHTML += "&nbsp;" 
        trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object["_id"] + '\')"><i class="fas fa-trash"></i></a></td>';
        trHTML += "</tr>";
        num++;
      }
      console.log(trHTML);
      document.getElementById("mytable").innerHTML = trHTML;
    }
  };
}





function showCompliantCreateBox() {
  var d = new Date();
  const date = d.toISOString().split("T")[0]

  Swal.fire({
    title: "สร้างข้อมูลใหม่",
    html:
      '<div class="mb-3"><label for="username" class="form-label">ชื่อผู้ใช้ :</label>' +
      '<input class="form-control" id="username" placeholder="username"></div>' +

      '<div class="mb-3"><label for="password" class="form-label">รหัสผ่าน :</label>' +
      '<input class="form-control" id="password" placeholder="password"></div>' +

      '<div class="mb-3"><label for="position" class="form-label">ตำเเหน่ง :</label>' +
      '<input class="form-control" id="position" placeholder="position"></div>',

    focusConfirm: false,
    preConfirm: () => {
      compliantCreate();
    },
  });
}

function compliantCreate() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const position = document.getElementById("position").value;


  console.log(JSON.stringify({
    "username": username,
    "password": password,
    "position": position,

  }));

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3500/complaints/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password,
    "position": position,
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        "สำเร็จ!",
        "คุณได้ทำการเพิ่มข้อมูลเรียบร้อยเเล้ว!",
        "success"
      );
      loadTable();
    }
  };
}
function compliantDelete(id) {
  console.log("Delete: ", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://localhost:3500/complaints/delete");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "_id": id
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects);
      Swal.fire(
        'สำเร็จ!',
        'คุณได้ทำการลบข้อมูลเรียบร้อยเเล้ว!',
        'success'
      );
      loadTable();
    }
  };
}


function showCompliantEditBox(id) {
  console.log("edit", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3500/complaints/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText).object;
      console.log("showCompliantEditBox", object);
      Swal.fire({
        title: "แก้ไขข้อมูล",
        html:
          '<input id="id" class="swal2-input" placeholder="Year" type="hidden" value="' + object["_id"] + '"><br>' +

          '<div class="mb-3"><label for="username" class="form-label">username</label>' +
          '<input class="form-control" id="username" placeholder="Year Name" value="' + object["username"] + '"></div>' +

          '<div class="mb-3"><label for="password" class="form-label">password</label>' +
          '<input class="form-control" id="password" placeholder="Month" value="' + object["password"] + '"></div>' +

          '<div class="mb-3"><label for="position" class="form-label">position</label>' +
          '<input class="form-control" id="position" placeholder="Make" value="' + object["position"] + '"></div>',

        focusConfirm: false,
        preConfirm: () => {
          userEdit();
        },
      });
    }
  };
}

function userEdit() {
  const id = document.getElementById("id").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const position = document.getElementById("position").value;

  console.log(JSON.stringify({
    "_id": id,
    "username": username,
    "password": password,
    "position": position,

  })
  );

  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:3500/complaints/update");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "_id": id,
    "username": username,
    "password": password,
    "position": position,
  })
  );

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        "สำเร็จ",
        "คุณได้ทำการแก้ไขข้อมูลเรียบร้อยเเล้ว!",
        "success"
      );
      loadTable();
    }
  };
}

