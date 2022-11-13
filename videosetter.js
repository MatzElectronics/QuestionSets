// find the first video that can be edited
function openVideoDialog(callback) {
    let editableVideoButtons = [];
    document.querySelectorAll(".label.ytcp-button").forEach(e => {
        if (e.innerText == "EDIT DRAFT") {
            editableVideoButtons.push(e);
        }
    });

    if (editableVideoButtons[0]) {
        editableVideoButtons[0].click();
        setTimeout(callback, 500);
    }
}

function setMadeForKids(value, callback) {
    if (value) {
        document.getElementsByName('VIDEO_MADE_FOR_KIDS_MFK')[0].click();
    } else {
        document.getElementsByName('VIDEO_MADE_FOR_KIDS_NOT_MFK')[0].click();
    }

    setTimeout(callback, 500);
}

function setPlaylist(callback) {
    // Get the playlist name from the video title
    let videoTitleParts = document.querySelector('#textbox.ytcp-social-suggestions-textbox').innerText.split(' ');
    //let videoDateParts = videoTitleParts.splice(0, 4);
    let videoPlaylist = videoTitleParts[4];

    // Open the list of Playlists
    setTimeout(() => {
        document.querySelector('div.container.ytcp-dropdown-trigger:not(.borderless)').click();

        setTimeout(() => {
            // Get the checkboxes
            let playlistCheckboxes = document.querySelector('#playlists-list.ytcp-playlist-dialog').querySelectorAll('#checkbox.ytcp-checkbox-lit');
            let playlistLabelSpans = document.querySelectorAll('label.ytcp-checkbox-label.ytcp-checkbox-group[label-truncation]');

            // Find the matching playlist
            for (let i = 0; i < playlistLabelSpans.length; i++) {
                let playlistTitle = playlistLabelSpans[i].innerText; //.split(' ')[0];

                if (playlistTitle.startsWith(videoPlaylist)) {
                    setTimeout(() => {
                        // Select the matching playlist
                        playlistCheckboxes[i].click();

                        setTimeout(() => {
                            // Click the "Done" button
                            document.querySelector('.action-buttons.ytcp-playlist-dialog').querySelectorAll('.label.ytcp-button')[2].click();

                            setTimeout(callback, 500);
                        }, 200);
                    }, 200);
                    break;
                }
            }
        }, 200);
    }, 200);
}

function setVisibility(callback) {
    setTimeout(() => {
        // Open the visibility tab
        document.querySelector('#step-badge-3').click()
        setTimeout(() => {
            // Set to Private
            document.querySelector('#privacy-radios').querySelector('#radioLabel').click()
            setTimeout(() => {
                // Set to salkeiz.k12.or.us can see
                document.querySelector('#privacy-radios > div.private-share-area.style-scope.ytcp-video-visibility-select > ytcp-button > div').click();
                setTimeout(() => {
                    // Confirm
                    document.querySelector('#dialog > div.content.style-scope.ytcp-dialog > div').querySelector('#checkbox-container').click();
                    setTimeout(() => {
                        // Click Done
                        document.querySelector('#dialog > div.footer.style-scope.ytcp-dialog #done-button').click()
                        setTimeout(() => {
                            // Save video
                            document.querySelector('#done-button').click();
                            // Click Close
                            setTimeout(() => {
                                if (document.querySelector('#close-button > div') && document.querySelector('#close-button > div').innerText == 'CLOSE') {
                                    document.querySelector('#close-button > div').click();
                                    if (callback) {
                                        setTimeout(callback, 500);
                                    }
                                }
                            }, 1000);
                        }, 300);
                    }, 300);
                }, 500);
            }, 500);
        }, 300);
    }, 300);
}

function runner() {
    setMadeForKids(true, () => {
        setPlaylist(() => {
            setVisibility(() => {
                openVideoDialog(runner);
            });
        });
    });
}

// Run it all
openVideoDialog(runner);