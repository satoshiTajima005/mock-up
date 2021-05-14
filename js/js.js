var app = new Vue({
  el: '#app',
  data: {
    vWidth: 1280,
    vHeight: 720,
    editor: ClassicEditor,
    editorData: '<p>自由入力テキストエリア</p><h2><a href="https://ckeditor.com/ckeditor-5/demo/"><strong>エディターデモページ</strong></a></h2><figure class="image image-style-side"><img src="https://placehold.jp/640x480.png"><figcaption>画像に対するキャプションが入れられます</figcaption></figure><p>&nbsp;</p><p>画像を横にずらして、説明文を入れられます。</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>',
    editorConfig: {
      language: 'ja'
    },
    flash: false,
    current_view: 'search',
    result: [],
    current_line: 0,
    proc: ggf,
    detail_proc: 'shitadori',
    shitadori_proc: '#8800CH',
    hari_proc: 'L1',
    press_proc: '16',
    dlg_pic: {
      isShow: false,
      current: 0,
      list: pic
    },
    dlg_mov: {
      isShow: false,
      current: 0,
      list: mov
    },
    dlg_oth: {
      isShow: false
    },
    dlg_pdf: {
      isShow: false,
      url: ""
    },
    item_pic: {
      current: 0,
      src: [
        "img/Koala.jpg",
        "img/Lighthouse.jpg"
      ]
    },
    dlg_camera: {
      video: {},
      fb: null,
      isShow: false,
      isEdit: false
    }
  },
  mounted: function () {
    if (navigator.mediaDevices) {
      this.dlg_camera.video = document.querySelector("#camera");

      /** カメラ設定 */
      const constraints = {
        audio: false,
        video: {
          width: this.vWidth,
          height: this.vHeight,
          facingMode: "environment" // リアカメラを利用する場合
        }
      };

      //カメラを<video>と同期
      const v = this.dlg_camera.video;
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        v.srcObject = stream;
        v.onloadedmetadata = function (e) {
          v.play();
        };
      }).catch(function (err) {
        console.log(err.name + ": " + err.message);
      });

      //Fabric.jsの初期設定
      this.dlg_camera.fb = new fabric.Canvas("cvs", {
        isDrawingMode: true // 手書き入力ON
      });
      const fb = this.dlg_camera.fb;

      //ペンの色/・種類指定
      fb.freeDrawingBrush = new fabric['PencilBrush'](fb); // ペンシルブラシを指定
      const brush = fb.freeDrawingBrush;
      brush.color = '#0F0'; //色　とりあえず緑で設定
      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush); // 設定を反映
      }
      brush.width = 5; // 線の太さを指定
    }

    Vue.use(CKEditor);
  },
  methods: {
    search: function () {
      this.result = itemlist;
    },
    click_to_top: function (e) {
      e.preventDefault();
      this.current_view = 'search'
      this.current_line = 0;
    },
    run_flash: function () {
      this.flash = true;
      let me = this;
      setTimeout(function () {
        me.flash = false;
      }, 3000);
    },
    print: function () {
      window.print();
    },
    click_to_item: function () {
      this.current_view = 'item';
      this.run_flash();
    },
    click_to_detail: function (line) {
      this.current_view = 'detail'
      this.current_line = line;
      this.run_flash();
    },
    delPic: function () {
      if (!confirm('表示中の写真を削除しますか？')) return;
      this.item_pic.src.splice(this.item_pic.current, 1);
      this.item_pic.current = 0;
    },
    open_dlg_pic: function () {
      this.dlg_pic.isShow = true;
    },
    open_dlg_mov: function () {
      this.dlg_mov.isShow = true;
    },
    open_dlg_oth: function () {
      this.dlg_oth.isShow = true;
    },
    shutter: function () {
      this.dlg_camera.isEdit = true;

      //写真をtmp-canvasに一旦書き出し
      const tmp = document.querySelector("#tmp");
      tmp.getContext("2d").drawImage(this.dlg_camera.video, 0, 0);

      //背景画像を設定(tmpからdataURLで取得)
      const me = this;
      fabric.Image.fromURL(tmp.toDataURL("image/png"), function (img) {
        const fb = me.dlg_camera.fb;
        fb.setBackgroundImage(img, fb.requestRenderAll.bind(fb)); // 画像を背景に設定
      });

    },
    dlgDelPic: function () {
      this.dlg_camera.fb.clear();
      this.dlg_camera.isEdit = false;
    },
    addPic: function () {
      this.item_pic.src.push(this.dlg_camera.fb.toDataURL("image/png"));
      this.closeCamera();
      this.item_pic.current = this.item_pic.src.length - 1;
    },
    closeCamera: function () {
      this.dlgDelPic();
      this.dlg_camera.isShow = false;
    }
  }
});