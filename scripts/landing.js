var pointsArray = document.getElementsByClassName('point');

var revealPoint = function(point) {
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateX(0) translateY(0)";
    point.style.msTransform = "scaleX(1) translateX(0) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateX(0) translateY(0)";
};

var animatePoints = function(points) {
    forEach(points, revealPoint);
};


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

window.onload = function() {
    if (window.innerHeight > 950) {
    animatePoints(pointsArray);
    }

    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

    window.addEventListener('scroll', function(event){
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
                 animatePoints(pointsArray);
                 console.log("animated");
             }
    })
};
