import defineAccessors from '../accessors/define-accessors';
import ObserversMixin from '../mixins/observers-mixin';
import { Class } from '../common';
import { deg, rad, round } from '../util';

import closeOrLess from './math/close-or-less';
import lineIntersection from './math/line-intersection';
import ellipseExtremeAngles from './math/ellipse-extreme-angles';

import { PRECISION } from './constants';
import Point from './point';
import Rect from './rect';

var MAX_INTERVAL = 45;
var pow = Math.pow;

var Arc = (function (Class) {
    function Arc(center, options) {
        if ( center === void 0 ) center = new Point();
        if ( options === void 0 ) options = {};

        Class.call(this);

        this.setCenter(center);

        this.radiusX = options.radiusX;
        this.radiusY = options.radiusY || options.radiusX;
        this.startAngle = options.startAngle;
        this.endAngle = options.endAngle;
        this.anticlockwise = options.anticlockwise || false;
    }

    if ( Class ) Arc.__proto__ = Class;
    Arc.prototype = Object.create( Class && Class.prototype );
    Arc.prototype.constructor = Arc;

    Arc.prototype.clone = function clone () {
        return new Arc(this.center, {
            radiusX: this.radiusX,
            radiusY: this.radiusY,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            anticlockwise: this.anticlockwise
        });
    };

    Arc.prototype.setCenter = function setCenter (value) {
        this._observerField("center", Point.create(value));
        this.geometryChange();
        return this;
    };

    Arc.prototype.getCenter = function getCenter () {
        return this.center;
    };

    Arc.prototype.pointAt = function pointAt (angle) {
        var center = this.center;
        var radian = rad(angle);

        return new Point(
            center.x + this.radiusX * Math.cos(radian),
            center.y + this.radiusY * Math.sin(radian)
        );
    };

    Arc.prototype.curvePoints = function curvePoints () {
        var this$1 = this;

        var startAngle = this.startAngle;
        var dir = this.anticlockwise ? -1 : 1;
        var curvePoints = [ this.pointAt(startAngle) ];
        var interval = this._arcInterval();
        var intervalAngle = interval.endAngle - interval.startAngle;
        var subIntervalsCount = Math.ceil(intervalAngle / MAX_INTERVAL);
        var subIntervalAngle = intervalAngle / subIntervalsCount;
        var currentAngle = startAngle;

        for (var i = 1; i <= subIntervalsCount; i++) {
            var nextAngle = currentAngle + dir * subIntervalAngle;
            var points = this$1._intervalCurvePoints(currentAngle, nextAngle);

            curvePoints.push(points.cp1, points.cp2, points.p2);
            currentAngle = nextAngle;
        }

        return curvePoints;
    };

    Arc.prototype.bbox = function bbox (matrix) {
        var this$1 = this;

        var interval = this._arcInterval();
        var startAngle = interval.startAngle;
        var endAngle = interval.endAngle;
        var extremeAngles = ellipseExtremeAngles(this.center, this.radiusX, this.radiusY, matrix);
        var extremeX = deg(extremeAngles.x);
        var extremeY = deg(extremeAngles.y);
        var endPoint = this.pointAt(endAngle).transformCopy(matrix);
        var currentAngleX = bboxStartAngle(extremeX, startAngle);
        var currentAngleY = bboxStartAngle(extremeY, startAngle);
        var currentPoint = this.pointAt(startAngle).transformCopy(matrix);
        var minPoint = Point.min(currentPoint, endPoint);
        var maxPoint = Point.max(currentPoint, endPoint);

        while (currentAngleX < endAngle || currentAngleY < endAngle) {
            var currentPointX;
            if (currentAngleX < endAngle) {
                currentPointX = this$1.pointAt(currentAngleX).transformCopy(matrix);
                currentAngleX += 90;
            }

            var currentPointY;
            if (currentAngleY < endAngle) {
                currentPointY = this$1.pointAt(currentAngleY).transformCopy(matrix);
                currentAngleY += 90;
            }

            currentPoint = new Point(currentPointX.x, currentPointY.y);
            minPoint = Point.min(minPoint, currentPoint);
            maxPoint = Point.max(maxPoint, currentPoint);
        }

        return Rect.fromPoints(minPoint, maxPoint);
    };

    Arc.prototype._arcInterval = function _arcInterval () {
        var ref = this;
        var startAngle = ref.startAngle;
        var endAngle = ref.endAngle;
        var anticlockwise = ref.anticlockwise;

        if (anticlockwise) {
            var oldStart = startAngle;
            startAngle = endAngle;
            endAngle = oldStart;
        }

        if (startAngle > endAngle || (anticlockwise && startAngle === endAngle)) {
            endAngle += 360;
        }

        return {
            startAngle: startAngle,
            endAngle: endAngle
        };
    };

    Arc.prototype._intervalCurvePoints = function _intervalCurvePoints (startAngle, endAngle) {
        var p1 = this.pointAt(startAngle);
        var p2 = this.pointAt(endAngle);
        var p1Derivative = this._derivativeAt(startAngle);
        var p2Derivative = this._derivativeAt(endAngle);
        var t = (rad(endAngle) - rad(startAngle)) / 3;
        var cp1 = new Point(p1.x + t * p1Derivative.x, p1.y + t * p1Derivative.y);
        var cp2 = new Point(p2.x - t * p2Derivative.x, p2.y - t * p2Derivative.y);

        return {
            p1: p1,
            cp1: cp1,
            cp2: cp2,
            p2: p2
        };
    };

    Arc.prototype._derivativeAt = function _derivativeAt (angle) {
        var radian = rad(angle);

        return new Point(-this.radiusX * Math.sin(radian), this.radiusY * Math.cos(radian));
    };

    Arc.prototype.containsPoint = function containsPoint (point) {
        var interval = this._arcInterval();
        var intervalAngle = interval.endAngle - interval.startAngle;
        var ref = this;
        var center = ref.center;
        var radiusX = ref.radiusX;
        var radiusY = ref.radiusY;
        var distance = center.distanceTo(point);
        var angleRad = Math.atan2(point.y - center.y, point.x - center.x);
        var pointRadius = (radiusX * radiusY) /
            Math.sqrt(pow(radiusX, 2) * pow(Math.sin(angleRad), 2) + pow(radiusY, 2) * pow(Math.cos(angleRad), 2));
        var startPoint = this.pointAt(this.startAngle).round(PRECISION);
        var endPoint = this.pointAt(this.endAngle).round(PRECISION);
        var intersection = lineIntersection(center, point.round(PRECISION), startPoint, endPoint);
        var containsPoint;

        if (intervalAngle < 180) {
            containsPoint = intersection && closeOrLess(center.distanceTo(intersection), distance) && closeOrLess(distance, pointRadius);
        } else {
            var angle = calculateAngle(center.x, center.y, radiusX, radiusY, point.x, point.y);
            if (angle !== 360) {
                angle = (360 + angle) % 360;
            }

            var inAngleRange = interval.startAngle <= angle && angle <= interval.endAngle;
            containsPoint = (inAngleRange && closeOrLess(distance, pointRadius)) || (!inAngleRange && (!intersection || intersection.equals(point)));
        }
        return containsPoint;
    };

    Arc.prototype._isOnPath = function _isOnPath (point, width) {
        var interval = this._arcInterval();
        var center = this.center;
        var angle = calculateAngle(center.x, center.y, this.radiusX, this.radiusY, point.x, point.y);
        if (angle !== 360) {
            angle = (360 + angle) % 360;
        }

        var inAngleRange = interval.startAngle <= angle && angle <= interval.endAngle;

        return inAngleRange && this.pointAt(angle).distanceTo(point) <= width;
    };

    Arc.fromPoints = function fromPoints (start, end, rx, ry, largeArc, swipe) {
        var arcParameters = normalizeArcParameters({
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
            rx: rx,
            ry: ry,
            largeArc: largeArc,
            swipe: swipe
        });

        return new Arc(arcParameters.center, {
            startAngle: arcParameters.startAngle,
            endAngle: arcParameters.endAngle,
            radiusX: rx,
            radiusY: ry,
            anticlockwise: swipe === 0
        });
    };

    return Arc;
}(Class));

defineAccessors(Arc.prototype, [ "radiusX", "radiusY", "startAngle", "endAngle", "anticlockwise" ]);
ObserversMixin.extend(Arc.prototype);

function elipseAngle(start, end, swipe) {
    var endAngle = end;

    if (start > endAngle) {
        endAngle += 360;
    }

    var alpha = Math.abs(endAngle - start);
    if (!swipe) {
        alpha = 360 - alpha;
    }

    return alpha;
}

function calculateAngle(cx, cy, rx, ry, x, y) {
    var cos = round((x - cx) / rx, 3);
    var sin = round((y - cy) / ry, 3);

    return round(deg(Math.atan2(sin, cos)));
}

function normalizeArcParameters(parameters) {
    var x1 = parameters.x1;
    var y1 = parameters.y1;
    var x2 = parameters.x2;
    var y2 = parameters.y2;
    var rx = parameters.rx;
    var ry = parameters.ry;
    var largeArc = parameters.largeArc;
    var swipe = parameters.swipe;
    var cx, cy;
    var cx1, cy1;
    var a, b, c, sqrt;

    if (y1 !== y2) {
        var x21 = x2 - x1;
        var y21 = y2 - y1;
        var rx2 = pow(rx, 2), ry2 = pow(ry, 2);
        var k = (ry2 * x21 * (x1 + x2) + rx2 * y21 * (y1 + y2)) / (2 * rx2 * y21);
        var yk2 = k - y2;
        var l = -(x21 * ry2) / (rx2 * y21);

        a = 1 / rx2 + pow(l, 2) / ry2;
        b = 2 * ((l * yk2) / ry2 - x2 / rx2);
        c = pow(x2, 2) / rx2 + pow(yk2, 2) / ry2 - 1;
        sqrt = Math.sqrt(pow(b, 2) - 4 * a * c);

        cx = (-b - sqrt) / (2 * a);
        cy = k + l * cx;
        cx1 = (-b + sqrt) / (2 * a);
        cy1 = k + l * cx1;
    } else if (x1 !== x2) {
        b = - 2 * y2;
        c = pow(((x2 - x1) * ry) / (2 * rx), 2) + pow(y2, 2) - pow(ry, 2);
        sqrt = Math.sqrt(pow(b, 2) - 4 * c);

        cx = cx1 = (x1 + x2) / 2;
        cy = (-b - sqrt) / 2;
        cy1 = (-b + sqrt) / 2;
    } else {
        return false;
    }

    var start = calculateAngle(cx, cy, rx, ry, x1, y1);
    var end = calculateAngle(cx, cy, rx, ry, x2, y2);
    var alpha = elipseAngle(start, end, swipe);

    if ((largeArc && alpha <= 180) || (!largeArc && alpha > 180)) {
        cx = cx1; cy = cy1;
        start = calculateAngle(cx, cy, rx, ry, x1, y1);
        end = calculateAngle(cx, cy, rx, ry, x2, y2);
    }

    return {
        center: new Point(cx, cy),
        startAngle: start,
        endAngle: end
    };
}

function bboxStartAngle(angle, start) {
    var startAngle = angle;

    while (startAngle < start) {
        startAngle += 90;
    }

    return startAngle;
}

export default Arc;

//# sourceMappingURL=arc.js.map
