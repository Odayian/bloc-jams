// Example Album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};
//Vars for functions
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
// Store state of playing songs
var currentlyPlayingSong = null;

var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    return template;
};

var setCurrentAlbum = function(album) {
    // #1
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

    // #2
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    // #3
    albumSongList.innerHTML = '';

    // #4
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

/*
-on click change from number to play button.
-on mouseleave table row, pause button stays
-on switch songs, check all other rows for currently playing and revert them to numbers. then play new click
-on hover of songs not playing, play icon should still appear
*/

//enter an element and the class you're looking for. bubbles out to search for class and returns the parent
var findParentByClassName = function(element, targetClass) {
    var runOnce = false;
    if (element){
        var currentParent = element.parentElement;
        while(currentParent.className !== targetClass && currentParent.className !== null){
            currentParent = currentParent.parentElement;
            runOnce = true;
        }
        //if a parent is never found, log to console.
        if(currentParent.className == null){
            console.log("No parent found.");
            return null;
        }
        //if while loop has ran but never matches the targetClass, log to console
        if(runOnce){
            console.log("No parent found with that class name.");
            return null;
        }
        return currentParent;
    }
};
//will return the element with the ".song-item-number" class
var getSongItem = function(element){
    //use a switch statement to return the element with the ".song-item-number" class
    switch(element.className){
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }

};

//click handler
var clickHandler = function(targetElement){
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSong === null){
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')){
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
};


window.onload = function() {
    //set current album
    setCurrentAlbum(albumPicasso);
    //add a listener to the track container and its contents for mouseover
    songListContainer.addEventListener('mouseover', function(event) {
        //if a song-item (checked by seeing if parent element is a 'album-view-song-item')
        if (event.target.parentElement.className === 'album-view-song-item') {

           var songItem = getSongItem(event.target);
           //if the 'data-song-number' of a track is !== the currentlyPlayingSong variable change the innerHTML to the playButtonTemplate on mouseover
           if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
               songItem.innerHTML = playButtonTemplate;
           }
       }
   });
    //add an event listener dynamically to every songRow for leaving and clicking
     for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            //reset track number if not the currently playing song when mouse leaves container
            if(songItemNumber!== currentlyPlayingSong){
                songItem.innerHTML = songItemNumber;
            }

         });
         //onClick, run clickHandler. ClickHandler: Change track number to pause icon
         songRows[i].addEventListener('click', function(event) {
         // Event handler call
            clickHandler(event.target);
        });
    }
};
