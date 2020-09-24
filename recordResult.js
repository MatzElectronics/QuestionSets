const SPREADSHEET_ID = '1hztn09tyiNWbJ9R351DNCNzQX8Gmy_tEhKNoXWQbdnQ';
const CLIENT_ID = '577330164204-gl74gvihq2salvig519oaoe5s50khj18.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDwzsmOQntaQhlhotpa0HrbQZaIx4fX-XE';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function initSheetsApi () { //initialize the Google API
    gapi.load('client:auth2', initClient);
  }

var GoogleAuth; // Google Auth object.
function initClient() {
  gapi.client.init({
      'apiKey': 'YOUR_API_KEY',
      'clientId': 'YOUR_CLIENT_ID',
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
  });
}

var isAuthorized;
var currentApiRequest;

/**
 * Store the request details. Then check to determine whether the user
 * has authorized the application.
 *   - If the user has granted access, make the API request.
 *   - If the user has not granted access, initiate the sign-in flow.
 */
function sendAuthorizedApiRequest(requestDetails) {
  currentApiRequest = requestDetails;
  if (isAuthorized) {
    // Make API request
    // gapi.client.request(requestDetails)

    // Reset currentApiRequest variable.
    currentApiRequest = {};
  } else {
    GoogleAuth.signIn();
  }
}

/**
 * Listener called when user completes auth flow. If the currentApiRequest
 * variable is set, then the user was prompted to authorize the application
 * before the request executed. In that case, proceed with that API request.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    isAuthorized = true;
    if (currentApiRequest) {
      sendAuthorizedApiRequest(currentApiRequest);
    }
  } else {
    isAuthorized = false;
  }
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
