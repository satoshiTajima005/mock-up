var app = new Vue({
  el: '#app',
  data: {
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
      current: 0
    },
    dlg_mov: {
      isShow: false,
      current: 0
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
        "img/Lighthouse.jpg",
        "img/Penguins.jpg",
        "img/Tulips.jpg",
        "img/Chrysanthemum.jpg",
        "img/Desert.jpg",
        "img/Hydrangeas.jpg",
        "img/Jellyfish.jpg"
      ]
    },
    dlg_camera: {
      isShow: false,
      isEdit: false,
      picData: ""
    }
  },
  mounted:function(){
    const me = this;
    this.$nextTick(function () {
      if (navigator.mediaDevices){
        this.video  = document.querySelector("#camera");
        this.canvas = document.querySelector("#cvs");
      
        /** カメラ設定 */
        const constraints = {
          audio: false,
          video: {
            width: 1280,
            height: 720,
            //facingMode: "user"   // フロントカメラを利用する
            facingMode: "environment"  // リアカメラを利用する場合
          }
        };
      
        //カメラを<video>と同期
        const me = this;
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
          me.video.srcObject = stream;
          me.video.onloadedmetadata = function(e){
            me.video.play();
          };
        }).catch(function(err){
          console.log(err.name + ": " + err.message);
        });
      }

      Vue.use(CKEditor);
    });
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
    run_flash: function(){
      this.flash = true;
      let me = this;
      setTimeout(function () {
        me.flash = false;
      }, 3000);
    },
    print: function(){
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
    open_dlg_pic: function () {
      this.dlg_pic.isShow = true;
    },
    open_dlg_mov: function () {
      this.dlg_mov.isShow = true;
    },
    open_dlg_oth: function () {
      this.dlg_oth.isShow = true;
    },
    shutter: function(){
      const ctx = this.canvas.getContext("2d");
      ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      this.dlg_camera.picData = this.canvas.toDataURL("image/png");
      this.dlg_camera.isEdit = true;
      /*
      const image = document.getElementById('editPic');
      const cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        crop(event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      });
      */
    },
    delPic: function(){
      this.dlg_camera.picData = '';
      this.dlg_camera.isEdit = false;
    },
    addPic: function(){
      this.item_pic.src.push(this.dlg_camera.picData);
      this.closeCamera();
    },
    closeCamera: function(){
      this.delPic();
      this.dlg_camera.isShow = false;
    }
  }
});
