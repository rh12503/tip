
window.addEventListener('load', place);

function place() {
    var images = document.querySelectorAll("img[data-src]");

    // Test for search engine crawlers
    if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
        for (var i = 0; i < images.length; i++) {
            images[i].src = images[i].dataset.src;
        }
        return;
    }

    // Replace all images with the attribute data-src

    for (var i = 0; i < images.length; i++) {
        let image = images[i];
        image.style.transition = "opacity 1s"

        let w = image.width
        let h = image.height

        var xhr = new XMLHttpRequest();

        // Look for an asset with the same name and the extension .tri

        let name = image.dataset.src.replace(/\.[^/.]+$/, ".tri");

        xhr.open("GET", name, true);
        xhr.responseType = "arraybuffer";

        xhr.onreadystatechange = (resp) => {
            var buffer = resp.currentTarget.response;

            if (buffer) {

                let container = document.createElement("div");
                container.style.display = "inline-block";
                container.style.position = "relative"
                container.style.overflow = "hidden"
                container.style.padding = "0"
                container.style.margin = "0"

                var originalImage = image.cloneNode();

                image.style.position = "absolute"
                originalImage.style.verticalAlign = "middle"

                image.parentNode.replaceChild(container, image);

                if (image.style.width || w) {
                    container.style.width = image.style.width || (w + "px")
                    originalImage.style.width = "100%"
                    originalImage.style.setProperty("height", "calc(100% - 4px)");
                    image.style.width = "100%"
                }
                if (image.style.height || h) {
                    container.style.height = image.style.height || (h + "px")
                    originalImage.style.height = "100%"
                    image.style.height = "100%"
                }
                container.appendChild(image)
                container.appendChild(originalImage)

                var data = new DataView(buffer);
                let triangles = parseData(data);
                let width = data.getUint16(0, true);
                let height = data.getUint16(2, true);

                let canvas = document.createElement("canvas", { alpha: false });
                canvas.width = width;
                canvas.height = height;
                originalImage.style.transition = ""
                originalImage.style.opacity = 0
                originalImage.src = canvas.toDataURL("image/jpeg");

                renderData(canvas, triangles)

                image.src = canvas.toDataURL("image/jpeg");

                let blur = image.dataset.blur;
                if (blur) {
                    image.style.filter = `blur(${blur}px)`
                }

                image.onload = () => {
                    originalImage.src = image.dataset.src;

                    originalImage.onload = () => {
                        originalImage.style.opacity = 1
                        image.style.opacity = 0
                        originalImage.addEventListener('transitionend', function () {
                            image.style.visibility = "hidden"
                        });
                    }
                }
            }
        };
        xhr.send();

    }
}

function renderData(canvas, triangles) {

    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < triangles.length; i++) {
        let triangle = triangles[i].triangle;
        let color = triangles[i].color;
        let rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        ctx.fillStyle = rgb;
        ctx.strokeStyle = rgb;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(triangle[0][0], triangle[0][1]);
        ctx.lineTo(triangle[1][0], triangle[1][1]);
        ctx.lineTo(triangle[2][0], triangle[2][1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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

    for (var i = 20; i < data.byteLength;) {
        let parent = triangles[current];

        let dataByte = data.getUint8(i, true);

        i++;
        let face = (dataByte >> 2) & 3;

        let adjacent = triangles[current].triangle;

        var vertex;

        if ((dataByte >> 4) & 1) {
            vertex = [parent.triangle[face][0] + data.getInt8(i, true), parent.triangle[face][1] + data.getInt8(i + 1, true)];
            i += 2;
        } else {
            vertex = [data.getUint16(i, true), data.getUint16(i + 2, true)];
            i += 4;
        }

        var color;

        if ((dataByte >> 5) & 1) {
            let colorData = data.getUint16(i, true);

            color = [parent.color[0] + (colorData & 63) - 32, parent.color[1] + ((colorData >> 6) & 63) - 32, parent.color[2] + (((colorData >> 12) & 15) | ((dataByte >> 6) & 3) << 4) - 32];
            i += 2;
        } else {
            color = [data.getUint8(i, true), data.getUint8(i + 1, true), data.getUint8(i + 2, true)];
            i += 3;
        }

        let triangle = [
            adjacent[face],
            adjacent[(face + 1) % 3],
            vertex,
        ].sort(function (a, b) {
            if (a[1] == b[1]) {
                return a[0] - b[0];
            }

            return a[1] - b[1];
        });

        triangles.push({
            triangle: triangle,
            color: color,
            remaining: dataByte & 3,
        });

        triangles[current].remaining--;
        while (triangles[current] && triangles[current].remaining == 0) {
            current++;
        }
    }

    return triangles;
}