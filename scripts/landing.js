var animatePoints = function() {

    var points = document.getElementsByClassName('point');
    var revealPoint = function(point){
            point.style.opacity = 1;
            point.style.transform = "scaleX(1) translateX(0) translateY(0)";
            point.style.msTransform = "scaleX(1) translateX(0) translateY(0)";
            point.style.WebkitTransform = "scaleX(1) translateX(0) translateY(0)";
    }

    for(var i = 0; i < points.length; i++){
        revealPoint(points[i]);
    }
};
