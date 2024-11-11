//////////////////
// Turtle Class //
//////////////////

export class Turtle {
    static singleton = undefined;
    canvas = undefined;
    ctx = undefined;
    path = undefined;
    pathToFill = undefined;
    width = 500;
    height = 500;
    x = 250;
    y = 250;
    angle = 0;
    penColor = '#00F';
    lineWidth = 1;
    fillColor = '#00F';
    hidePen = false;

    constructor(config) {
        this.canvas = document.getElementById(config?.canvas ?? 'canvas');
        this.ctx = this.canvas.getContext('2d');

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.x = this.width / 2;
        this.y = this.height / 2;

        this.onKeyPressed(config?.keyPressed);
        this.onMouseClicked(config?.mouseClicked);
        this.onMouseMoved(config?.mouseMoved);
    }

    onKeyPressed(callback) {
        window.addEventListener('keydown', (event) => {
            callback && callback(event.key);
        });
    }

    onMouseClicked(callback) {
        this.canvas.addEventListener('click', (event) => {
            callback &&
            callback(
                ...this.__canvasCoordinatesToUserCoordinates([
                    2 * event.offsetX,
                    2 * event.offsetY,
                ])
            );
        });
    }

    onMouseMoved(callback) {
        this.canvas.addEventListener('mousemove', (event) => {
            callback &&
            callback(
                ...this.__canvasCoordinatesToUserCoordinates([
                    2 * event.offsetX,
                    2 * event.offsetY,
                ])
            );
        });
    }

    forward(pixels) {
        const oldX = this.x;
        const oldY = this.y;
        const newX = oldX + Math.sin((2 * Math.PI * this.angle) / 360) * pixels;
        const newY = oldY - Math.cos((2 * Math.PI * this.angle) / 360) * pixels;
        this.x = newX;
        this.y = newY;
        this.path = new Path2D();
        this.path.moveTo(oldX, oldY);
        this.path.lineTo(newX, newY);
        this.pathToFill?.lineTo(newX, newY);
        this.ctx.strokeStyle = this.penColor;
        this.ctx.lineWidth = this.lineWidth;
        if (!this.hidePen) {
            this.ctx.stroke(this.path);
        }
    }

    back(pixels) {
        this.forward(-pixels);
    }

    left(angle) {
        this.angle -= angle;
    }

    right(angle) {
        this.angle += angle;
    }

    setHeading(angle) {
        this.angle = angle;
    }

    towards(x, y) {
        [x, y] = this.__userCoordinatesToCanvasCoordinates([x, y]);
        let angle = 0;
        if (this.x === x) {
            if (this.y < y) {
                angle = 180;
            }
        }
        angle = (180 * Math.atan((this.y - y) / (this.x - x))) / Math.PI;
        return (x < this.x && y < this.y) || (x < this.x && y > this.y)
            ? -90 + angle
            : 90 + angle;
    }

    penUp() {
        this.hidePen = true;
    }

    penDown() {
        this.hidePen = false;
    }

    setFillColor(color) {
        this.fillColor = color;
    }

    setPenColor(color) {
        this.penColor = color;
    }

    setLineWidth(width) {
        this.lineWidth = width;
    }

    dot(radius = 10) {
        const region = new Path2D();
        region.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.penColor;
        this.ctx.fill(region);
    }

    startPath() {
        this.pathToFill = new Path2D();
        this.pathToFill.moveTo(this.x, this.y);
    }

    fillPath() {
        this.pathToFill?.closePath();
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fill(this.pathToFill);
    }

    setPos(x, y) {
        [this.x, this.y] = this.__userCoordinatesToCanvasCoordinates([x, y]);
    }

    getPos() {
        return this.__canvasCoordinatesToUserCoordinates([this.x, this.y]);
    }

    getX(x) {
        return this.getPos()[0];
    }

    setX(x) {
        this.setPos(x, this.getY());
    }

    getY(y) {
        return this.getPos()[1];
    }

    setY(y) {
        this.setPos(this.getX(), y);
    }

    setRandomPos(xMin, xMax, yMin, yMax) {
        const x = xMin + Math.random() * (xMax - xMin);
        const y = yMin + Math.random() * (yMax - yMin);
        this.setPos(x, y);
    }

    __userCoordinatesToCanvasCoordinates([x, y]) {
        return [this.width / 2 + x, this.height / 2 - y];
    }

    __canvasCoordinatesToUserCoordinates([x, y]) {
        return [x - this.width / 2, this.height / 2 - y];
    }
}

///////////////////////////
// Global Turtle methods //
///////////////////////////

window.makeTurtle = (config) => (Turtle.singleton = new Turtle(config));
window.forward = (pixels) => Turtle.singleton?.forward(pixels);
window.back = (pixels) => Turtle.singleton?.forward(-pixels);
window.right = (angle) => Turtle.singleton?.right(angle);
window.left = (angle) => Turtle.singleton?.left(angle);
window.setHeading = (angle) => Turtle.singleton?.setHeading(angle);
window.towards = (x, y) => Turtle.singleton?.towards(x, y);
window.startPath = () => Turtle.singleton?.startPath();
window.fillPath = () => Turtle.singleton?.fillPath();
window.setFillColor = (color) => Turtle.singleton?.setFillColor(color);
window.setPenColor = (color) => Turtle.singleton?.setPenColor(color);
window.penUp = () => Turtle.singleton?.penUp();
window.penDown = () => Turtle.singleton?.penDown();
window.setLineWidth = (width) => Turtle.singleton?.setLineWidth(width);
window.dot = (radius) => Turtle.singleton?.dot(radius);
window.setPos = (x, y) => Turtle.singleton?.setPos(x, y);
window.getPos = () => Turtle.singleton?.getPos();
window.setX = (x) => Turtle.singleton?.setX(x);
window.getX = () => Turtle.singleton?.getX();
window.setY = (y) => Turtle.singleton?.setY(y);
window.getY = () => Turtle.singleton?.getY();
window.setRandomPos = (xMin, xMax, yMin, yMax) =>
    Turtle.singleton?.setRandomPos(xMin, xMax, yMin, yMax);

//////////////////////////////////
// Other helpful global methods //
//////////////////////////////////

window.inputInt = (text) => parseInt(prompt(text), 10);
window.inputFloat = (text) => parseFloat(prompt(text));
window.inputString = (text) => prompt(text) + '';

window.repeat = (count, callback) => {
    for (let i = 0; i < count; i++) {
        callback();
    }
};
