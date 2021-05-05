document.addEventListener('DOMContentLoaded', place);

function place() {
    // Replace all images with the attribute data-place
    var images = document.querySelectorAll("img[data-place]");

    for (var i = 0; i < images.length; i++) {
        let image = images[i];

        let newImage = image.cloneNode();

        let w = newImage.width;
        let h = newImage.height;

        // Set up container div to hold placeholder

        let container = document.createElement("div");
        container.style.display = "inline-block";
        container.style.width = w + "px"
        container.style.height = h + "px"
        container.style.position = "relative"

        // Add a canvas above the image 

        let canvas = document.createElement("canvas");
        canvas.style.display = "inline-block";
        canvas.style.position = "absolute";
        canvas.style.zIndex = 99;
        canvas.style.transition = "opacity 0.7s";

        container.appendChild(canvas);
        container.appendChild(newImage);

        image.parentNode.replaceChild(container, image);

        var xhr = new XMLHttpRequest();

        // Look for an asset with the same name and the extension .tri

        let name = image.dataset.place.replace(/\.[^/.]+$/, ".tri");

        xhr.open("GET", name, true);
        xhr.responseType = "arraybuffer";

        xhr.onreadystatechange = (resp) => {
            var buffer = resp.currentTarget.response;
            if (buffer) {

                // Load the original image
                newImage.src = newImage.dataset.place;

                newImage.onload = function () {
                    canvas.style.opacity = "0"; // Hide the canvas after the image is loaded
                }

                var data = new DataView(buffer);
                let width = data.getUint16(0, true);
                let height = data.getUint16(2, true);

                canvas.width = width;
                canvas.height = height;

                // Set width and height of placeholders

                w = w || h * (width / height);
                h = h || w * (height / width);

                if (!w && !h) {
                    w = width;
                    h = height;
                }

                container.style.width = w + "px"
                container.style.height = h + "px"

                canvas.style.width = w + "px";
                canvas.style.height = h + "px";

                render(parseData(data), canvas);
            }
        };
        xhr.send();

    }
}

function parseData(data) {
    var triangles = [];

    triangles.push({
        triangle: [
            [data.getUint16(5, true), data.getUint16(7, true)],
            [data.getUint16(9, true), data.getUint16(11, true)],
            [data.getUint16(13, true), data.getUint16(15, true)],
        ],
        color: [data.getUint8(17, true), data.getUint8(18, true), data.getUint8(19, true)],
        remaining: data.getUint8(4, true),
    });

    var current = 0;

    for (var i = 20; i < data.byteLength; i += 8) {
        let face = data.getUint8(i, true) % 3

        let adjacent = triangles[current].triangle;

        triangles.push({
            triangle: [
                adjacent[face],
                adjacent[(face + 1) % 3],
                [data.getUint16(i + 1, true), data.getUint16(i + 3, true)],
            ].sort(function (a, b) {
                if (a[1] == b[1]) {
                    return a[0] - b[0];
                }

                return a[1] - b[1];
            }),
            color: [data.getUint8(i + 5, true), data.getUint8(i + 6, true), data.getUint8(i + 7, true)],
            remaining: Math.floor(data.getUint8(i, true) / 3),
        });

        triangles[current].remaining--;
        while (triangles[current] && triangles[current].remaining == 0) {
            current++;
        }
    }
    return triangles
}

function render(triangles, canvas) {
    var ctx = canvas.getContext("2d", {
        alpha: false,
    });
    let dpi = window.devicePixelRatio;
    if (dpi > 1) {
        canvas.width *= dpi;
        canvas.height *= dpi;
        ctx.scale(dpi, dpi);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < triangles.length; i++) {
        let triangle = triangles[i].triangle
        let color = triangles[i].color
        let rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.fillStyle = rgb;
        ctx.strokeStyle = rgb;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(triangle[0][0], triangle[0][1]);
        ctx.lineTo(triangle[1][0], triangle[1][1]);
        ctx.lineTo(triangle[2][0], triangle[2][1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
