## 安装

```shell
npm install --save html2canvas
or
yarn add -s html2canvas
```

## 引入

```javascript
在组件中
import html2canvas from 'html2canvas'
```

## 使用(图片)

```javascript
  upLoadPdfImg() {
      //清除因为滚动条产生的偏移量
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      
      let that = this;
      event.preventDefault();
      var canvas2 = document.createElement("canvas");
      let _canvas = document.getElementById('pdf-img');
      var w = parseInt(window.getComputedStyle(_canvas).width);
      var h = parseInt(window.getComputedStyle(_canvas).height);
      //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了  
      canvas2.width = w * 2;
      canvas2.height = h * 2;
      canvas2.style.width = w + "px";
      canvas2.style.height = h + "px";
      //可以按照自己的需求，对context的参数修改,translate指的是偏移量  
      //  var context = canvas.getContext("2d");  
      //  context.translate(0,0);  
      var context = canvas2.getContext("2d");
      context.scale(2, 2);
      html2canvas(_canvas, {
        canvas: canvas2,
        useCORS: true // 允许CORS跨域
      }).then(canvas => {
        const img = canvas
          .toDataURL("image/jpeg")
          .replace("data:image/jpeg;base64,", "");
        const finalImageSrc = "data:image/jpeg;base64," + img;
        const aElem = document.createElement("a");
        document.body.appendChild(aElem);
        aElem.href = finalImageSrc;
        // 设置下载标题
        aElem.download = "chart.jpg";
        aElem.click();
        document.body.removeChild(aElem);
      });
    }
```

## PDF

```javascript
upLoadPdfImg() {
      //清除因为滚动条产生的偏移量
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      
      let that = this;
      event.preventDefault();
      var canvas2 = document.createElement("canvas");
      let _canvas = document.getElementById('pdf-img');
      var w = parseInt(window.getComputedStyle(_canvas).width);
      var h = parseInt(window.getComputedStyle(_canvas).height);
      //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了  
      canvas2.width = w * 2;
      canvas2.height = h * 2;
      canvas2.style.width = w + "px";
      canvas2.style.height = h + "px";
      //可以按照自己的需求，对context的参数修改,translate指的是偏移量  
      //  var context = canvas.getContext("2d");  
      //  context.translate(0,0);  
      var context = canvas2.getContext("2d");
      context.scale(2, 2);
      html2canvas(_canvas, {
        canvas: canvas2,
        useCORS: true // 允许CORS跨域
      }).then(canvas => {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new jspdf('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(that.uploadTitle + '.pdf')
      });
    }
```

