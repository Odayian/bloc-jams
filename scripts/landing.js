var animatePoints = function() {

    var points = document.getElementsByClassName('point');

    var revealPoint = function(point){
        for(var i = 0; i < point.length; i++){
            points[i].style.opacity = 1;
            points[i].style.transform = "scaleX(1) translateX(0) translateY(0)";
            points[i].style.msTransform = "scaleX(1) translateX(0) translateY(0)";
            points[i].style.WebkitTransform = "scaleX(1) translateX(0) translateY(0)";
        }
    }
    revealPoint(points);
};
