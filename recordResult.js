const SPREADSHEET_ID = '1hztn09tyiNWbJ9R351DNCNzQX8Gmy_tEhKNoXWQbdnQ';
const CLIENT_ID = '577330164204-gl74gvihq2salvig519oaoe5s50khj18.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDwzsmOQntaQhlhotpa0HrbQZaIx4fX-XE';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function initSheetsApi () { //initialize the Google API
    gapi.load('client:auth2', initClient);
  }

function initClient () { //provide the authentication credentials you set up in the Google developer console
    gapi.client.init({
      'apiKey': API_KEY,
      'clientId': CLIENT_ID,
      'scope': SCOPE,
      'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    })
    
    //.then(()=> {
    //  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus); //add a function called `updateSignInStatus` if you want to do something once a user is logged in with Google
    //  updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    //});
  }

 function onFormSubmit(submissionValues) {

    const params = {
      // The ID of the spreadsheet to update.
      spreadsheetId: SPREADSHEET_ID, 
      // The A1 notation of a range to search for a logical table of data.Values will be appended after the last row of the table.
      range: 'Sheet1', //this is the default spreadsheet name, so unless you've changed it, or are submitting to multiple sheets, you can leave this
      // How the input data should be interpreted.
      valueInputOption: 'RAW', //RAW = if no conversion or formatting of submitted data is needed. Otherwise USER_ENTERED
      // How the input data should be inserted.
      insertDataOption: 'INSERT_ROWS', //Choose OVERWRITE OR INSERT_ROWS
    };

    const valueRangeBody = {
      'majorDimension': 'ROWS', //log each entry as a new row (vs column)
      'values': [submissionValues] //convert the object's values to an array
    };

    let request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    request.then(function (response) {
      // TODO: Insert desired response behaviour on submission
      console.log(response.result);
    }, function (reason) {
      console.error('error: ' + reason.result.error.message);
    });
  }
