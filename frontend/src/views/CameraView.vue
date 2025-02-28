<template>
    <v-container>
      <div class="camera-view">
        <select v-model="selectedDeviceId" @change="startCamera">
          <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
            {{ device.label }}
          </option>
        </select>
        <div class="photo-view">
          <img :src="photoUrl" alt="Photo" v-if="photoUrl" class="foto-redonda">
        </div>
        <button @click="obtenerFoto">Obtener Foto</button>
        <video ref="video" autoplay></video>
        <button @click="startCamera">Iniciar Camera</button>
        <button @click="stopCamera">Detener Camera</button>
        <button @click="capturePhoto">Capturar Photo</button>
        <canvas ref="canvas" style="display: none;"></canvas>
        <img ref="photo" />
        <a ref="downloadLink" style="display: none;">Download Photo</a>
        <canvas ref="canvas" style="display: none;"></canvas>
      </div>
  
    </v-container>
  </template>

<script>
import Vue from 'vue';

export default {
  name: 'CameraView',
  
  data: () => ({
      videoStream: null,
      videoDevices: [],
      selectedDeviceId: '',
      photoUrl: '',//para obtener foto
  }),
  async mounted() {
    await this.getVideoDevices();
    await this.obtenerFoto();
    await this.startCamera();
  },
  methods: {
    async getVideoDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (this.videoDevices.length > 0) {
          this.selectedDeviceId = this.videoDevices[0].deviceId;
        }
      } catch (error) {
        Vue.config.errorHandler(error, this, 'Error fetching video devices');
      }
    },
    async startCamera() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
      }
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: this.selectedDeviceId },
        });
        this.$refs.video.srcObject = this.videoStream;
      } catch (error) {
        Vue.config.errorHandler(error, this, 'Error accessing the camera');
      }
    },
    stopCamera() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        this.videoStream = null;
      }
    },
    capturePhoto() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const photo = this.$refs.photo;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      //Guardar foto 
      canvas.toBlob(async (blob) => {
          console.log('Foto capturada')
          const userData = JSON.parse(sessionStorage.getItem('userData'));
          const formData = new FormData();
          formData.append('photo',blob,'fotoBD.png');
          formData.append('uid', userData.id);
          try {
              const response = await fetch('http://localhost:3000/photos/upload',{
                  method: 'POST',
                  body: formData,
              });
              const result = await response.json();
              console.log('Foto guardada: ', result);
          } catch (error) {
            Vue.config.errorHandler(error, this, 'Error al cargar la foto');
          }
      }, 'image/png');
      
      const dataUrl = canvas.toDataURL('image/png');
      photo.src = dataUrl;
      photo.style.display = 'block';
    },
    //metodo para obtener foto 
    async obtenerFoto(){
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const uid = userData.id;
          try {
              const response = await fetch(`http://localhost:3000/photos/by_user/${uid}`);
              if(response.ok){
                  const blob =await response.blob();
                  this.photoUrl = URL.createObjectURL(blob);
              }else{
                  Vue.config.errorHandler(response.status, 'Error al obtener imagen');
              }
          } catch (error) {
            Vue.config.errorHandler(error, 'Error al obtener imagen');
          }
      },
  },
  beforeDestroy() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
  },
}
</script>

<style scoped>
.camera-view {
display: flex;
flex-direction: column;
align-items: center;
}

video {
width: 100%;
max-width: 600px;
border: 2px solid #ccc;
margin-bottom: 10px;
}

button {
margin: 5px;
padding: 10px 20px;
font-size: 16px;
}

select {
margin-bottom: 10px;
padding: 5px;
font-size: 16px;
}

img {
max-width: 100%;
margin-top: 10px;
}

.foto-redonda {
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ccc; 
  }
</style>