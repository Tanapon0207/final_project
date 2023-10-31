google.charts.load('current', {
    'packages': ['corechart', 'bar']
  });
  google.charts.setOnLoadCallback(loadTable);
  
  function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3500/data");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
  
                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['TOCALLDATE'] + '</td>';
                trHTML += '<td>' + object['MSYMPTOMID'] + '</td>';
                trHTML += '<td>' + object['worksheets_closed'] + '</td>';
                /*trHTML += "<td>" + object["Make"] + "</td>";
                trHTML += "<td>" + object["Quantity"] + "</td>";
                trHTML += "<td>" + object["Pct"] + "</td>";*/
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object['_id'] + '\')"><i class="fas fa-edit"></i></a>';
                trHTML += "&nbsp;"
                trHTML += "&nbsp;"
                trHTML += "&nbsp;"
                trHTML += "&nbsp;"
                /*trHTML += "&nbsp;"*/
                /*trHTML += "&nbsp;"*/
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
                trHTML += "</tr>";
  
                num++;
            }
            document.getElementById("mytable").innerHTML = trHTML;
  
            loadGraph();
        }
    };
  }
  
  function loadQueryTable() {
    document.getElementById("mytable").innerHTML = "<tr><th scope=\"row\" colspan=\"5\">Loading...</th></tr>";
    const searchText = document.getElementById('searchTextBox').value;
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3500/data/findtext/" + searchText);
  
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText).Complaint;
            for (let object of objects) {
                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['TOCALLDATE'] + '</td>';
                trHTML += '<td>' + object['MSYMPTOMID'] + '</td>';
                trHTML += '<td>' + object['worksheets_closed'] + '</td>';
                /*trHTML += '<td>' + object['Issue'] + '</td>';
                trHTML += '<td>' + object['Sub-issue'] + '</td>';
                trHTML += '<td>' + object['Company response to consumer'] + '</td>';
                trHTML += '<td>' + object['Timely response?'] + '</td>';
                trHTML += '<td>' + object['Consumer disputed?'] + '</td>';*/
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object['_id'] + '\')"><i class="fas fa-edit"></i></a>';
                trHTML += "&nbsp;"
                trHTML += "&nbsp;"
                trHTML += "&nbsp;"
                trHTML += "&nbsp;"
                /*trHTML += "&nbsp;"*/
                /*trHTML += "&nbsp;"*/
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
                trHTML += "</tr>";
                num++;
  
  
            }
            console.log(trHTML);
            document.getElementById("mytable").innerHTML = trHTML;
  
        }
    };
  }
  
  function loadGraph() {
    //ตัวแปลที่จะนำไปเเสดงผลรายปี
    var Year_2560 = 0;
    var Year_2561 = 0;
    var Year_2562 = 0;
    var Year_2563 = 0;
    var Year_2564 = 0;
    /*var closeMo = 0;
    var closeNonMo = 0;
    var other = 0;*/
  
  
    //ตัวแปลที่จะนำไปเเสดงผลกลุ่มปัญหา
    var Hardware = 0;
    var Software = 0;
    var Internet = 0;
    var Telephony = 0;
    var Others = 0;
    var Finger_scan = 0;
  
  
    //ตัวแปลที่จะไปเเสดงผลใบงานที่ปิดได้
    var V1 = 0;
    var V2 = 0;
    var V3 = 0;
    var V4 = 0;
    var V5 = 0;
  
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3500/data/");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                switch (object['TOCALLDATE']) {
                    case "Year_2560":
                        Year_2560 = Year_2560 + 1;
                        break;
                    case "Year_2561":
                        Year_2561 = Year_2561 + 1;
                        break;
                    case "Year_2562":
                        Year_2562 = Year_2562 + 1;
                        break;
                    case "Year_2563":
                        Year_2563 = Year_2563 + 1;
                        break;
                    /*case "Others":
                        Others = Others + 1;
                        break;*/
                    default:
                        Year_2564 = Year_2564 + 1;
                        break;
                }
  
                switch (object['MSYMPTOMID']) {
                    case "Hardware":
                        Hardware = Hardware + 1;
                        break;
                    case "Software":
                        Software = Software + 1;
                        break;
  
                    case "Internet":
                        Internet = Internet + 1;
                        break;
                    case "Telephony":
                        Telephony = Telephony + 1;
                        break;
                    case "Others":
                        Others = Others + 1;
                        break;
                    default:
                        Finger_scan = Finger_scan + 1;
                        break;
                }
  
                switch (object['worksheets_closed']) {
                    case "V1":
                        V1 = V1 + 1;
                        break;
                    case "V2":
                        V2 = V2 + 1;
                        break;
  
                    case "V3":
                        V3 = V3 + 1;
                        break;
                    case "V4":
                        V4 = V4 + 1;
                        break;
                    default:
                        V5 = V5 + 1;
                        break;
                }
            }
  
            var TimelyResponseData = google.visualization.arrayToDataTable([
                ['ปี', 'ปี 2560-2564'],
                ['ปี 2560 จำนวน : 3,331 ใบงาน', Year_2560],
                ['ปี 2561 จำนวน : 2,777 ใบงาน', Year_2561],
                ['ปี 2562 จำนวน : 2,182 ใบงาน', Year_2562],
                ['ปี 2563 จำนวน : 2,243 ใบงาน', Year_2563],
                ['ปี 2564 จำนวน : 1,959 ใบงาน', Year_2564],
                /*['Others with non-monetary relief', closeNonMo],
                ['Telephony response', Telephony],
                ['Other', other]*/
            ]);
  
            var optionsTimelyResponse = { title: 'เปอร์เซ็นต์และจำนวนการเเจ้งซ่อมเเยกตามปีตั้งเเต่ ปี 2560-2564 (รวมทั้งหมด 12,492 ใบงาน)', pieHole: 0.4,};
            var chartTimelyResponse = new google.visualization.PieChart(document.getElementById('piechartTimelyResponse'));
            chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);
  
  
  
            var dataSubmitted = google.visualization.arrayToDataTable([
                ['ประเภทปัญหา', 'จำนวน', {
                    role: 'style'
                }, {
                        role: 'annotation'
                    }],
  
                ['ฮาร์ดเเวร์', Hardware, 'gold', '5,260 ใบงาน'],
                ['ซอฟต์แวร์', Software, 'color: #F65A83', '2,386 ใบงาน'],
                ['อินเทอร์เน็ต', Internet, 'color: #1E90FF', '2,162 ใบงาน'],
                ['ระบบโทรศัพท์', Telephony, 'color: #E04D01', '1,841 ใบงาน'],
                ['อื่นๆ', Others, 'color: #1C3879', '782 ใบงาน'],
                ['ฟิงเกอร์สแกน', Finger_scan, 'color: #66FF33', '61 ใบงาน']
            ]);
  
            var optionSubmitted = {
                title: 'สรุปกลุ่มปัญหาที่มีจำนวนมากที่สุด 6 อันดับ ตั้งเเต่ ปี 2560-2564 ',
                legend: { position: 'none' }
            };
  
            var chartSubmitted = new google.visualization.BarChart(document.getElementById('barchartSubmitted'));
            chartSubmitted.draw(dataSubmitted, optionSubmitted);
  
  
            
            
            var  Data = google.visualization.arrayToDataTable([
                ['ปี', 'ปี 2560-2564'],
                ['0-7 วัน : 11,949 ใบงาน (95.7%)', V1],
                ['8-14 วัน : 325 ใบงาน (2.6 %)', V2],
                ['15-22 วัน : 93 ใบงาน (95.7 %)', V3],
                ['23-31 วัน : 22 ใบงาน (95.7 %)', V4],
                ['มากกว่า 31 วัน : 103 ใบงาน (95.7 %)', V5],
                /*['Others with non-monetary relief', closeNonMo],
                ['Telephony response', Telephony],
                ['Other', other]*/
            ]);
  
            var optionsData = { title: 'ใบงานที่ปิดได้(คิดเป็นเปอร์เซ็น) ตั้งเเต่ ปี 2560-2564 ', pieHole: 0.4,is3D: true, };
            var charts = new google.visualization.PieChart(document.getElementById('chart_div'));
            charts.draw(Data, optionsData);
  
  
  
           
        }
    };
  
  
  }
  
  function showCompliantCreateBox() {
  
    var d = new Date();
    const date = d.toISOString().split('T')[0]
  
    Swal.fire({
        title: 'เพิ่มข้อมูล',
        html:
            '<div class="mb-3"><label for="TOCALLDATE" class="form-label">ปีที่เเจ้งซ่อม</label>' +
            '<input class="form-control" id="TOCALLDATE" placeholder="TOCALLDATE"></div>' +
  
            '<div class="mb-3"><label for="MSYMPTOMID" class="form-label">ประเภทปัญหา</label>' +
            '<input class="form-control" id="MSYMPTOMID" placeholder="MSYMPTOMID"></div>' +
  
            '<div class="mb-3"><label for="worksheets_closed" class="form-label">ใบงานที่ปิดได้</label>' +
            '<input class="form-control" id="worksheets_closed" placeholder="worksheets_closed"></div>' ,/*+
            /*'<div class="mb-3"><label for="Sub_issue" class="form-label">Sub-issue</label>' +
            '<input class="form-control" id="Sub_issue" placeholder="Sub-issue"></div>' +
            '<div class="mb-3"><label for="Company" class="form-label">Company</label>' +
            '<input class="form-control" id="Company" placeholder="Company"></div>' +
            '<div class="mb-3"><label for="State" class="form-label">State</label>' +
            '<input class="form-control" id="State" placeholder="State"></div>' +
            '<div class="mb-3"><label for="Submitted_via" class="form-label">Submitted via</label>' +
            '<input class="form-control" id="Submitted_via" placeholder="Submitted_via"></div>' +
            '<div class="mb-3"><label for="Date_sent" class="form-label">Date sent to company</label>' +
            '<input class="form-control" id="Date_sent" placeholder="Date sent to company, e.g. 2022-08-09"></div>' +
            '<div class="mb-3"><label for="Timely_response" class="form-label">Timely response?</label>' +
            '<input class="form-control" id="Timely_response" placeholder="Timely response?, e.g. yes, no"></div>' +
            '<div class="mb-3"><label for="Consumer_disputed" class="form-label">Consumer disputed?</label>' +
            '<input class="form-control" id="Consumer_disputed" placeholder="Consumer disputed?"></div>' +
            '<div class="mb-3"><label for="Complaint_ID" class="form-label">Complaint ID</label>' +
            '<input class="form-control" id="Complaint_ID" placeholder="Complaint ID"></div>',*/
        focusConfirm: false,
        preConfirm: () => {
            compliantCreate();
        }
    });
  }
  
  function compliantCreate() {
  
    const TOCALLDATE = document.getElementById("TOCALLDATE").value;
    const MSYMPTOMID = document.getElementById("MSYMPTOMID").value;
    const worksheets_closed = document.getElementById("worksheets_closed").value;
    /*const Sub_TOCALLDATE = document.getElementById("Sub_TOCALLDATE").value;
    const Issue = document.getElementById("Issue").value;
    const Sub_issue = document.getElementById("Sub_issue").value;
    const Company = document.getElementById("Company").value;
    const State = document.getElementById("State").value;
    const Submitted_via = document.getElementById("Submitted_via").value;
    const Date_sent = document.getElementById("Date_sent").value;
    const Timely_response = document.getElementById("Timely_response").value;
    const Consumer_disputed = document.getElementById("Consumer_disputed").value;
    const Complaint_ID = document.getElementById("Complaint_ID").value;*/
  
    console.log(JSON.stringify({
        'TOCALLDATE': TOCALLDATE,
        "MSYMPTOMID": MSYMPTOMID,
        "worksheets_closed": worksheets_closed,
        /*'Sub-TOCALLDATE': Sub_TOCALLDATE,
        "Issue": Issue,
        'Sub-issue': Sub_issue,
        "Company": Company,
        "State": State,
        'Submitted via': Submitted_via,
        'Date sent to company': Date_sent,
        'Timely response?': Timely_response,
        'Consumer disputed?': Consumer_disputed,
        'Complaint ID': Complaint_ID,*/
    }));
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3500/data/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        'TOCALLDATE': TOCALLDATE,
        "MSYMPTOMID": MSYMPTOMID,
        "worksheets_closed": worksheets_closed,
        /*'Sub-TOCALLDATE': Sub_TOCALLDATE,
        "Issue": Issue,
        'Sub-issue': Sub_issue,
        "Company": Company,
        "State": State,
        'Submitted via': Submitted_via,
        'Date sent to company': Date_sent,
        'Timely response?': Timely_response,
        'Consumer disputed?': Consumer_disputed,
        'Complaint ID': Complaint_ID,*/
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Create Compliant Successfully!',
                'success'
            );
            loadTable();
        }
    };
  }
  
  function compliantDelete(id) {
    console.log("Delete: ", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3500/data/delete");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "_id": id
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            console.log(objects);
            Swal.fire(
                'ลบข้อมูลสำเร็จ!',
                'คุณทำการลบข้อมูลเรียบร้อยเเล้ว!'
                //'success'
            );
            loadTable();
        }
    };
  }
  
  function showCompliantEditBox(id) {
    console.log("edit", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3500/data/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText).object;
            console.log("showCompliantEditBox", object);
            Swal.fire({
                title: 'Edit Compliant',
                html: '<input id="id" class="swal2-input" placeholder="TOCALLDATE" type="hidden" value="' + object['_id'] + '"><br>' +
  
                    '<div class="mb-3"><label for="TOCALLDATE" class="form-label">ปีที่เเจ้งซ่อม</label>' +
                    '<input class="form-control" id="TOCALLDATE" placeholder="TOCALLDATE" value="' + object['TOCALLDATE'] + '"></div>' +
  
                    '<div class="mb-3"><label for="MSYMPTOMID" class="form-label">ประเภทปัญหา</label>' +
                    '<input class="form-control" id="MSYMPTOMID" placeholder="MSYMPTOMID" value="' + object['MSYMPTOMID'] + '"></div>' +
  
                    '<div class="mb-3"><label for="worksheets_closed" class="form-label">ใบงานที่ปิดได้</label>' +
                    '<input class="form-control" id="worksheets_closed" placeholder="worksheets_closed" value="' + object['worksheets_closed'] + '"></div>' ,/*+
                    '<div class="mb-3"><label for="Issue" class="form-label">Issue</label>' +
                    '<input class="form-control" id="Issue" placeholder="Issue" value="' + object['Issue'] + '"></div>' +
                    '<div class="mb-3"><label for="Sub_issue" class="form-label">Sub-issue</label>' +
                    '<input class="form-control" id="Sub_issue" placeholder="Sub-issue" value="' + object['Sub-issue'] + '"></div>' +
                    '<div class="mb-3"><label for="Company" class="form-label">Company</label>' +
                    '<input class="form-control" id="Company" placeholder="Company" value="' + object['Company'] + '"></div>' +
                    '<div class="mb-3"><label for="State" class="form-label">State</label>' +
                    '<input class="form-control" id="State" placeholder="State" value="' + object['State'] + '"></div>' +
                    '<div class="mb-3"><label for="Submitted_via" class="form-label">Submitted via</label>' +
                    '<input class="form-control" id="Submitted_via" placeholder="Submitted_via" value="' + object['Submitted via'] + '"></div>' +
                    '<div class="mb-3"><label for="Date_sent" class="form-label">Date sent to company</label>' +
                    '<input class="form-control" id="Date_sent" placeholder="Date sent to company, e.g. 2022-08-09" value="' + object['Date sent to company'] + '"></div>' +
                    '<div class="mb-3"><label for="Timely_response" class="form-label">Timely response?</label>' +
                    '<input class="form-control" id="Timely_response" placeholder="Timely response?, e.g. yes, no" value="' + object['Timely response?'] + '"></div>' +
                    '<div class="mb-3"><label for="Consumer_disputed" class="form-label">Consumer disputed?</label>' +
                    '<input class="form-control" id="Consumer_disputed" placeholder="Consumer disputed?" value="' + object['Consumer disputed?'] + '"></div>' +
                    '<div class="mb-3"><label for="Complaint_ID" class="form-label">Complaint ID</label>' +
                    '<input class="form-control" id="Complaint_ID" placeholder="Complaint ID" value="' + object['Complaint ID'] + '"></div>',*/
                focusConfirm: false,
                preConfirm: () => {
                    userEdit();
                }
            });
        }
    };
  }
  
  function userEdit() {
    const id = document.getElementById("id").value;
    const TOCALLDATE = document.getElementById("TOCALLDATE").value;
    const MSYMPTOMID = document.getElementById("MSYMPTOMID").value;
    const worksheets_closed = document.getElementById("worksheets_closed").value;
    /*const Sub_TOCALLDATE = document.getElementById("Sub_TOCALLDATE").value;
    const Issue = document.getElementById("Issue").value;
    const Sub_issue = document.getElementById("Sub_issue").value;
    const Company = document.getElementById("Company").value;
    const State = document.getElementById("State").value;
    const Submitted_via = document.getElementById("Submitted_via").value;
    const Date_sent = document.getElementById("Date_sent").value;
    const Timely_response = document.getElementById("Timely_response").value;
    const Consumer_disputed = document.getElementById("Consumer_disputed").value;
    const Complaint_ID = document.getElementById("Complaint_ID").value;*/
  
    console.log(JSON.stringify({
        "_id": id,
        'TOCALLDATE': TOCALLDATE,
        "MSYMPTOMID": MSYMPTOMID,
        "worksheets_closed": worksheets_closed,
        /*"Sub-TOCALLDATE": Sub_TOCALLDATE,
        "Issue": Issue,
        "Sub-issue": Sub_issue,
        "Company": Company,
        "State": State,
        "Submitted via": Submitted_via,
        "Date sent to company": Date_sent,
        "Timely response?": Timely_response,
        "Consumer disputed?": Consumer_disputed,
        "Complaint ID": Complaint_ID,*/
    }));
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:3500/data/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "_id": id,
        'TOCALLDATE': TOCALLDATE,
        "MSYMPTOMID": MSYMPTOMID,
        "worksheets_closed": worksheets_closed,
        /*"Sub-TOCALLDATE": Sub_TOCALLDATE,
        "Issue": Issue,
        "Sub-issue": Sub_issue,
        "Company": Company,
        "State": State,
        "Submitted via": Submitted_via,
        "Date sent to company": Date_sent,
        "Timely response?": Timely_response,
        "Consumer disputed?": Consumer_disputed,
        "Complaint ID": Complaint_ID,*/
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Update Compliant Successfully!',
                'success'
            )
            loadTable();
        }
    };
  }
  