
function imgToCanvas(url) {
    // ����imgԪ��
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    img.src = url;
    img.setAttribute("crossOrigin", "anonymous"); // ��ֹ��������� Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.

    //await new Promise((resolve) => (img.onload = resolve));
    img.onload = function (){
        // ����canvas DOMԪ�أ����������ߺ�ͼƬһ��

        //const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        // ����(0,0) ��ʾ�Ӵ˴���ʼ���ƣ��൱��ƫ�ơ�
        canvas.getContext("2d").drawImage(img, 0, 0);
        }
    return canvas;
}

function addWatermark(canvas, text) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 20, 20);
    return canvas;
}


function canvasToImg(canvas) {
    // �½�Image���󣬿������ΪDOM
    var image = new Image();
    // canvas.toDataURL ���ص���һ��Base64�����URL
    // ָ����ʽ PNG
    image.src = canvas.toDataURL("image/png");
    return image;
}


export function run(imgUrl) {
    // const imgUrl =
    //     "http://localhost:8080/ipfs/QmUzvbh8ZeVs7MjNopDbid3PdGdDGmUoJHZk6SDWwDBTW5";
    // 1.ͼƬ·��ת��canvas
    const tempCanvas = imgToCanvas(imgUrl);
    // 2.canvas���ˮӡ
    const canvas = addWatermark(tempCanvas,"newMark");
    // 3.canvasת��img
    const img = canvasToImg(canvas);
    // // �鿴Ч��
    // document.body.appendChild(img);
    return img;
}
