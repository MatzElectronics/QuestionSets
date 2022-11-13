window.docDoc = self.frames['FRAME_CONTENT'].document;
window.pageAttendaceData = null;

function fillAttTable() {
    let currentAttendancePeriod = docDoc.getElementById('CIPeriod').innerText.trim();

    docDoc.querySelectorAll('.ui-droppable').forEach(e => {
        e.style.height = ((parseFloat(e.style.height) + 50) + 'px');

        let stuIDcontainer = e.querySelector('.StudentID');
        let stuID
        if (stuIDcontainer) {
            stuID = stuIDcontainer.innerText.replace(/ID:/gm,'').trim();
        }

        let stuAttInfo = pageAttendaceData.filter(r => {if (r[2] === currentAttendancePeriod && r[4] === stuID) return true;})[0];

        if (stuAttInfo) {
            let tabRecord = docDoc.createElement('table');
            tabRecord.style.fontSize = '10px';
            let tabRecordInside = '<tr>';
            tabRecordInside += '<td style="min-width:unset;height:unset;text-align:center;' + (stuAttInfo[5] > 8 ? 'background:#faa;' : '') + '">' + stuAttInfo[5] + '</td>';
            tabRecordInside += '<td style="min-width:unset;height:unset;text-align:center;' + (stuAttInfo[6] > 8 ? 'background:#faa;' : '') + '">' + stuAttInfo[6] + '</td>';
            tabRecordInside += '</tr><tr>';
            tabRecordInside += '<td style="min-width:unset;height:unset;text-align:center;' + (stuAttInfo[7] < 1 ? 'background:#faa;' : '') + '">' + stuAttInfo[7] + '</td>';
            tabRecordInside += '<td style="min-width:unset;height:unset;text-align:center;' + (stuAttInfo[8] < 4 ? 'background:#faa;' : '') + '">' + stuAttInfo[8] + '</td>';
            tabRecordInside += '</tr>';
            tabRecord.innerHTML = tabRecordInside;
            e.appendChild(tabRecord);
        }
    });
}


function buildTable() {
    const docBody = docDoc.body;
    
    let div = docDoc.createElement("div");
    div.id = "week-table-box";
    div.style.alignItems = "center";
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100vw";
    div.style.height = "100vh";
    div.style.background = "rgba(0,0,0,0.7)";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.outline = "none";
    div.style.overflow = "auto";
    div.style.zIndex = "99999";
    //let lastChild = document.body.lastChild;
    docBody.appendChild(div);
    //docBody.insertBefore(div, lastChild.nextSibling);

    let divBox = docDoc.createElement('div');
    divBox.style.border = "1px solid black";
    divBox.style.background = "#fff";
    divBox.style.borderRadius = "8px";
    divBox.style.width = "50vw";
    divBox.style.height = "40vh";
    divBox.style.display = "flex";
    divBox.style.alignItems = "center";
    divBox.style.justifyContent = "space-around";
    divBox.style.flexDirection = "column";
    divBox.style.boxShadow = "0px 0px 20px 0px black";
    
    divBox.innerHTML = '<div>Paste JSON Data:</div>';
    divBox.innerHTML += '<textarea style="width:400px;height:150px;" id="report-data-rows"></textarea>\n';
    divBox.innerHTML += '<div><button class="btn btn-success" id="paste-json-data">Add JSON</button></div>\n';

    div.appendChild(divBox);

    docDoc.getElementById("paste-json-data").addEventListener('click', () => { 
        pageAttendaceData = JSON.parse(docDoc.getElementById('report-data-rows').value);
        docDoc.getElementById('week-table-box').remove();
        if (Array.isArray(pageAttendaceData)) {
            setTimeout(fillAttTable, 2000);
        } else {
            alert('No valid attendace data!');
        }
    });
}

docDoc.querySelector('#miAttendance').click();
setTimeout(buildTable, 2000);