/* global $ */
/* global buzz */
/* global albumPicasso*/
var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
     + '</tr>'
     ;

    var $row = $(template);

    var clickHandler = function() {
	    var songNumber = parseInt($(this).attr('data-song-number'));

	    if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
	    }
	    if (currentlyPlayingSongNumber !== songNumber) {
		    $(this).html(pauseButtonTemplate);
		    setSong(songNumber);
		    currentSoundFile.play();
		    updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            //updates volume bar on initial start of a song. 
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
	    }else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $mainPPButton.html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $mainPPButton.html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
	    }
    };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        
    };

        $row.find('.song-item-number').click(clickHandler);
        $row.hover(onHover, offHover);

        return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.aritst);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration );
        $albumSongList.append($newRow);
    }
};
var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            setCurrentTimeInPlayerBar(this.getTime());
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
     }
};
 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;

    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};
var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
 
    $seekBars.click(function(event) {

        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();

        var seekBarFillRatio = offsetX / barWidth;
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        }else {
            setVolume(seekBarFillRatio * 100);   
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBars.find('.thumb').mousedown(function(event) {

        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
        
    });
};
//updates the player bar at bottom of page
var updatePlayerBarSong = function(){
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + " - "+currentAlbum.artist);
    $mainPPButton.html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};
//tracks the index of current song
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function(){
    // Use the trackIndex() helper function to get the index of the current song and then increment the value of the index.
    // Know what the previous song is. This includes the situation in which the next song is the first song,
    //following the final song in the album (that is, it should "wrap" around).
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    var lastSongNumber = currentlyPlayingSongNumber;
    // Set a new current song to currentSongFromAlbum.
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    // Update the player bar to show the new song.
    updatePlayerBarSong();
    // Update the HTML of the previous song's .song-item-number element with a number.
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    // Update the HTML of the new song's .song-item-number element with a pause button.
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
var previousSong = function(){
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    if(currentSongIndex < 0 ){
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();

    $('main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var setSong = function(songNumber){
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
 
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
     });
    
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
        currentVolume = volume;
    }
};

var setCurrentTimeInPlayerBar = function(currentTime){
    $('.current-time').text(filterTimeCode(currentTime));  
};
var setTotalTimeInPlayerBar = function(totalTime){
    $('.total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds){
    var minutes = Math.floor(timeInSeconds/60);
    var seconds = Math.floor(timeInSeconds%60);
    if(seconds < 10){
        return minutes+":0"+seconds;
    }else{
        return minutes+":"+seconds;
    }
};
var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]')
};

var togglePlayFromPlayerBar = function(){
    var $currentlyPlaying = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    if(currentSoundFile.isPaused()){
        currentSoundFile.play();
        $currentlyPlaying.html(pauseButtonTemplate);
        $mainPPButton.html(playerBarPauseButton);
       
    }else if(currentSoundFile !== null){
        currentSoundFile.pause();
        $currentlyPlaying.html(playButtonTemplate);
        $mainPPButton.html(playerBarPlayButton);
        
    }
    
    
};
//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $mainPPButton = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
//executes once document is loaded
$(document).ready(function() {
    //set current album
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $mainPPButton.click(togglePlayFromPlayerBar);
    setupSeekBars();
});
