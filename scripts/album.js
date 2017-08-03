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

//Ben's Example Album
var albumVHF = {
    title: 'Television',
    artist: 'VHF',
    label: 'RGB',
    year: '1948',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'What\'s on?', duration: '3:00' },
        { title: 'White Noise', duration: '12:06' },
        { title: 'Tracking Issues', duration: '2:33'},
        { title: 'Progressive Times', duration: '1:11' },
        { title: 'Living in a Soap Opera', duration: '6:04'}
    ]
};
var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number">' + songNumber + '</td>'
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


window.onload = function() {
    setCurrentAlbum(albumPicasso);
};

var albumCount = 3;
var nextAlbum = function(){
    albumCount++;
    if(albumCount%3 == 0){
        setCurrentAlbum(albumPicasso);
    }else if(albumCount%3 == 1){
        setCurrentAlbum(albumMarconi);
    }else if (albumCount%3 ==2){
        setCurrentAlbum(albumVHF);
    }
    //debug info
    console.log("clicked");
};
document.getElementsByClassName('album-cover-art')[0].addEventListener("click",nextAlbum);
