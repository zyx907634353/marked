function addMark() {

    var canvas = document.getElementById("myCanvas")

    var ctx = canvas.getContext("2d")

    var img = new Image();
    //img.src = url;

    img.setAttribute("crossOrigin", "anonymous"); // ��ֹ��������� Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
    var textData, originalData;
    img.src = 'http://localhost:8080/ipfs/QmU3t79th94h9D6mcREnrkpNryXuhGxyf2EeKbboFhW4LN'
    //ͼƬ�������
    img.onload = function () {
        //���û������ΪͼƬ���
        canvas.width = img.width;
        canvas.height = img.height;
        //����ˮӡ����
        ctx.font = '30px Microsoft Yahei';
        //����ͼƬ��ȹ̶�Ϊ800��������Ҫ��ÿһ���������ˮӡ,ÿ��100��������һ��ˮӡ
        for (var i = 50; i < canvas.height; i += 100) {
            ctx.fillText('�ܽ���', 100, i);
            ctx.fillText('�ܽ���', 300, i);
            ctx.fillText('�ܽ���', 600, i);
        }

        //��ʱ�������Ѿ�����ˮӡ����Ϣ�����ǻ�ȡˮӡ�ĸ������ص���Ϣ
        textData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        //��ͼƬ���뻭��
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        //��ȡͼƬ�������ص����Ϣ����originalData��ӡ�������ᷢ����һ���ǳ�������飨�������ֺ�ͼƬ��ͬһ�黭�������textData�ĳ��ȵ���originalData���ȣ�
        //�������ĳ��ȵ���ͼƬwidth*height*4����ͼƬ���ؿ���Ը߳���4��0-3λ�ǵ�һ�����RGBAֵ����4-7λ�ǵڶ������RGBAֵ���Դ�����
        originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        //����äˮӡ�㷨
        mergeData(ctx, textData, 'R', originalData)
    }

}
    function mergeData(ctx, textData, color, originalData) {
        var oData = originalData.data;
        var newData = textData.data
        var bit, offset;  // offset���������ҵ����bit�ҵ���Ӧ��Aֵ����͸����

        switch (color) {
            case 'R':
                bit = 0;
                offset = 3;
                break;
            case 'G':
                bit = 1;
                offset = 2;
                break;
            case 'B':
                bit = 2;
                offset = 1;
                break;
        }

        for (var i = 0; i < oData.length; i++) {
            //�˴���Ϊ��ɸѡ����Ҫ�޸ĵ�RGB����һ��ڴ˴������˳����ľ���ÿ��������Rֵ
            if (i % 4 == bit) {

                //���ǻ�ȡ��Rֵ��λ�ã��Ƕ�Ӧ������Aֵ����i+offset
                if (newData[i + offset] === 0 && (oData[i] % 2 === 1)) {
                    //�˴����жϸ�������͸���ȣ����Ϊ0��˵���������û��ˮӡ�ģ���û��ˮӡ��Ϣ���Rֵ��Ϊż�������Ҳ��ܳ���0-255�ķ�Χ
                    if (oData[i] === 255) {
                        oData[i]--;
                    } else {
                        oData[i]++;
                    }
                } else if (newData[i + offset] !== 0 && (oData[i] % 2 === 0)) {
                    //͸���ȷ�0���õ�����Ϣ�����õ��Rֵ��ż���������Ϊ����
                    oData[i]++;
                }
            }
        }
        //���ˣ�����ͼƬ�����а���ˮӡ��Ϣ�ĵ��Rֵ����������û��ˮӡ��Ϣ�ĵ��Rֵ����ż�����ٽ�ͼƬ���뻭�������������ˮӡ��ӹ���
        ctx.putImageData(originalData, 0, 0);
    }
addMark();
