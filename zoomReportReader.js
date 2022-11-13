

const sleep = ms => new Promise(r => setTimeout(r, ms));

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

async function getReportText(url) {
    const rpt = await fetch(url);
    let rpttxt = await rpt.text();
    rpttxt = rpttxt.replace(/^.*?,Yes[\s]+/gm, '')
        .trim()
        .replace(/(,.*?)@.*?\..*?,/gm, '$1,')
        .replace(/,[0-9]+,No,No/gm, '')
        .replace(/[\r\n]+/gm, '\n');

    let rptdata = rpttxt.split('\n');
    rptdata.shift();
    let meetingHeader = rptdata.shift().split(',');
    meetingDate = (new Date(meetingHeader[2])).toISOString().split('T')[0];
    rptdata.shift();
    let meetingHost = rptdata.shift();
    rptdata.sort();
    rptdata.unshift(meetingHost);

    let rptrows = [];
    let rowPrefix = [meetingDate, meetingHeader[0], meetingHeader[1].replace(/Period ([0-9]).*/g,'$1')];
    tempStartTime = 0;
    firstStartTime = 10000000000000;
    let averageTime = 0;
    let timeDivisor = 0;
    for (let i = 0; i < rptdata.length; i++) {
        let row = rptdata[i].split(',');
        row[2] = Date.parse(row[2]);
        row[3] = Date.parse(row[3]);
        row.push(0);
        row.push(0);

        if (row[2] < firstStartTime && i > 0) {
            firstStartTime = row[2];
        }

        if (tempStartTime != 0) {
            row[2] = tempStartTime;
        }

        if (i + 1 < rptdata.length && row[1] != rptdata[i + 1].split(',')[1] || i + 1 == rptdata.length) {
            averageTime += row[3];
            timeDivisor++;

            rptrows.push(row);
            tempStartTime = 0;
        } else if (tempStartTime == 0) {
            tempStartTime = row[2];
        }
    }

    for (let i = 0; i < rptrows.length; i++) {
        row = rptrows[i];
        row[3] = Math.round(((averageTime / timeDivisor) - parseInt(row[3])) / 60000);
        if (row[3] < 0) {
            row[3] = 0;
        }
        row[2] = Math.round((parseInt(row[2]) - firstStartTime) / 60000);
        if (row[2] < 0) {
            row[2] = 0;
        }
        rptrows[i] = rowPrefix.concat(row);
    }

    return rptrows;
}

let meetingDate = '';
let reportData = [];
let currentReport = 0;
const modalLinks = document.querySelectorAll('[data-column="table.p"] > a');

async function getReportData(callback) {
    modalLinks[currentReport].click();
    await sleep(1500);
    if (!document.querySelector('#withMeetingHeader').checked) {
        document.querySelector('#withMeetingHeader').click();
    }
    await sleep(200);
    let reportLink = document.querySelector('#btnExportParticipants').value;
    let newRows = await getReportText(reportLink);
    reportData = reportData.concat(newRows);
    await sleep(200);
    document.querySelector('#attendees_dialog > div > div > div.modal-header.clearfix > button').click();
    await sleep(300);
    currentReport++;
    if (currentReport < modalLinks.length) {
        await sleep(500);
        await getReportData(callback);
    } else {
        callback();
    }
}

function processChatText(chatText, chatPeriod) {
    chatText = chatText.replace(/\s+From\s+|\s+[tT]o.*?:\s+| : /gm,'||').trim();
    chatTextRows = chatText.split('\n');
    for (let i = 0; i < chatTextRows.length; i++) {
        chatTextRows[i] = chatTextRows[i].replace(/^(.*?)\|\|(.*?)$/gm,(p,m1,m2) => {
            return m2 + '||' + Date.parse(meetingDate + ' ' + m1); 
        });
    }
    chatTextRows.sort();

    let chatRows = [];
    let chatCount = 0;
    let chatWords = 0;
    for (let i = 0; i < chatTextRows.length; i++) {
        let tempChatRow = chatTextRows[i].split('||');
        let tempNextChatRow = (i < chatTextRows.length - 1 ? chatTextRows[i + 1].split('||') : []);
        chatCount++;
        chatWords += tempChatRow[1].split(' ').length;
        if (tempChatRow[0] != tempNextChatRow[0]) {
            chatRows.push([tempChatRow[0], chatCount, chatWords]);
            chatCount = 0;
            chatWords = 0;
        }
    }

    reportData.forEach((r, i) => {
        if (r[2] === chatPeriod.toString()) {
            let chatCounts = chatRows.filter(el => {
                return el[0] === r[3];
            });
            if (chatCounts.length > 0) {
                reportData[i][7] = chatCounts[0][1];
                reportData[i][8] = chatCounts[0][2];
            }
        }
    });
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}


async function openFile(chatPeriod) {
    return new Promise((resolve, reject) => {
        readFile = function (e) {
            let file = e.target.files[0];
            if (!file) {
                reject;
            }
            let reader = new FileReader();
            reader.onload = function (e) {
                let contents = processChatText(e.target.result, chatPeriod);

                setTimeout(() => {
                    document.getElementById('report-data-rows').value = JSON.stringify(reportData);
                }, 500);

                resolve(contents);
                document.body.removeChild(fileInput);
            }
            reader.onerror = reject;
            reader.readAsText(file);
        }
        fileInput = document.createElement("input");
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.onchange = readFile;
        document.body.appendChild(fileInput);
        fileInput.click();
    });
}

let periodList = [];

getReportData(() => {
    reportData.forEach((r, i) => {
        if (periodList.length === 0 || (i > 0 && r[2] !== reportData[i - 1][2])) {
            periodList.push(r[2]);
        }
    });
    console.log('finished!');
    buildTable();
});




async function buildTable() {
    let div = document.createElement("div");
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
    let lastChild = document.body.lastChild;
    document.body.insertBefore(div, lastChild.nextSibling);

    let divBox = document.createElement('div');
    divBox.style.background = "#fff";
    divBox.style.borderRadius = "8px";
    divBox.style.width = "50vw";
    divBox.style.height = "50vh";
    divBox.style.display = "flex";
    divBox.style.alignItems = "center";
    divBox.style.justifyContent = "space-around";
    divBox.style.flexDirection = "column";
    divBox.style.boxShadow = "0px 0px 20px 0px black";
    
    let buttonRow = ''
    for (let i = 0; i < periodList.length; i++) {
        buttonRow += `&nbsp;<button style="display:inline-block" class="btn btn-primary" id="open-file-${periodList[i]}">Period ${periodList[i]}</button>&nbsp;\n`;
    }
    divBox.innerHTML = '<div>Upload chat.txt Files:</div><div>' + buttonRow + '</div>';
    divBox.innerHTML += '<textarea style="width:400px;height:150px;" id="report-data-rows"></textarea>\n';
    divBox.innerHTML += '<div>&nbsp;<button class="btn btn-success" id="copy-json-data">Copy JSON</button>&nbsp;&nbsp;<button class="btn btn-info" id="download-tsv-data">Download TSV</button>&nbsp;&nbsp;<button class="btn btn-secondary" id="report-manager-modal-close">Close</button>&nbsp;</div>\n';

    div.appendChild(divBox);

    for (let i = 0; i < periodList.length; i++) {
        document.getElementById(`open-file-${periodList[i]}`).addEventListener('click', () => { openFile(periodList[i]); });
    }
    document.getElementById("report-manager-modal-close").addEventListener('click', () => { document.getElementById('week-table-box').remove(); });
    document.getElementById("copy-json-data").addEventListener('click', () => { navigator.clipboard.writeText(document.getElementById('report-data-rows').value); });
    document.getElementById("download-tsv-data").addEventListener('click', () => { 
        let reportTSV = '';
        reportData.forEach((r) => {
            reportTSV += r.join('\t') + '\n';
        });
        downloadFile('attendance_' + meetingDate + '.tsv', reportTSV);
    });
}