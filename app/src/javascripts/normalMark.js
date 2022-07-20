//简单水印测试
/**
 * 图片路径转成canvas
 * @param {图片url} url
 */
export async function imgToCanvas(url) {
    // 创建img元素
    const img = document.createElement("img");
    img.src = url;
    img.setAttribute("crossOrigin", "anonymous"); // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
    await new Promise((resolve) => (img.onload = resolve));
    // 创建canvas DOM元素，并设置其宽高和图片一样
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
    canvas.getContext("2d").drawImage(img, 0, 0);
    return canvas;
}

/**
 * canvas添加水印
 * @param {canvas对象} canvas
 * @param {水印文字} text
 */
export function addWatermark(canvas, text) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 20, 20);
    return canvas;
}

/**
 * canvas转成img
 * @param {canvas对象} canvas
 */
export function convasToImg(canvas) {
    // 新建Image对象，可以理解为DOM
    var image = new Image();
    // canvas.toDataURL 返回的是一串Base64编码的URL
    // 指定格式 PNG
    image.src = canvas.toDataURL("image/png");
    return image;
}


export async function run(imgUrl,pwd) {
    // const imgUrl =
    //     "http://localhost:8080/ipfs/QmUzvbh8ZeVs7MjNopDbid3PdGdDGmUoJHZk6SDWwDBTW5";
    // 1.图片路径转成canvas
    const tempCanvas = await imgToCanvas(imgUrl);
    // 2.canvas添加水印
    const canvas = addWatermark(tempCanvas, pwd);
    // 3.canvas转成img
    const img = convasToImg(canvas);
    // 查看效果
    document.body.appendChild(img);
}


