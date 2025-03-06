<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Editar Cuenta del Usuario</h1>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="10" md="6">
              <v-form ref="form" v-model="isFormValid" lazy-validation>
                  <v-text-field v-model="name" :rules="nameRules" label="Nombre" required></v-text-field>
                  <v-text-field v-model="user" :rules="userRules" label="Nombre de usuario" required></v-text-field>
                  <v-text-field v-model="email" :rules="emailRules" label="Correo" required></v-text-field>
                  <v-text-field v-model="address" :rules="addressRules" label="Dirección" required></v-text-field>
                  <v-text-field v-model="phone" :rules="phoneRules" label="Teléfono" required></v-text-field>
                  <v-text-field v-model="contrasenia" :rules="passwordRules" 
                              label="Contraseña" :type="showPassword ? 'text' : 'password'"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
                              @click:append="passwordVisibility"
                              required></v-text-field>

                  <v-btn color="green" @click="submitForm">
                      Guardar
                  </v-btn>
                  <v-btn class="ml-2" color="blue" @click="resetForm">
                      Restablecer
                  </v-btn>
                  <v-btn class="ml-2" @click="goBack">
                      Cancelar
                  </v-btn>
              </v-form>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

export default {
  name: 'UserEditView',
  data() {
      return {
          isFormValid: false,
          showPassword: false,
          id: '',
          name: '',
          user: '',
          email: '',
          address: '',
          phone: '',
          contrasenia: '',
          nameRules: [
              v => !!v || 'Nombre es requerido',
          ],
          userRules: [
              v => !!v || 'Nombre de usuario es requerido',
          ],
          emailRules: [
              v => !!v || 'Correo es requerido',
              v => /.+@.+\..+/.test(v) || 'El correo debe ser valido',
          ],
          addressRules: [
              v => !!v || 'Dirección es requerida',
          ],
          phoneRules: [
              v => !!v || 'Teléfono es requerido',
              v => (/^\d+$/.test(v) && v.length === 10) || 'El teléfono debe contener solo dígitos y tener 10 caracteres',
          ],
          passwordRules: [
              v => !!v || 'Contraseña es requerida',
              v => (v && v.length >= 6) || 'La contraseña no debe ser menor a 6 caracteres',
          ],
      };
  },
  mounted() {
      this.loadUserData();
  },
  methods: {
      passwordVisibility() {
          this.showPassword = !this.showPassword;
      },
      loadUserData() {
          const userData = JSON.parse(sessionStorage.getItem('userData'));
          if (userData) {
              this.id = userData.id;
              this.name = userData.name;
              this.user = userData.user;
              this.email = userData.email;
              this.address = userData.address;
              this.phone = userData.phone;
              this.contrasenia = userData.contrasenia;
          }
      },
      submitForm() {
          if (this.$refs.form.validate()) {
              axios.put(`/usuarios/update/${this.id}`, {
                  usuario: this.user,
                  correo: this.email,
                  password: this.contrasenia,
                  direccion: this.address,
                  nombre: this.name,
                  telefono: this.phone
              }).then(() => {
                  this.$swal({
                      icon: "success",
                      title: "Información actualizada correctamente",
                      showConfirmButton: false,
                      timer: 1500
                  });
              }).then(() => {
                const userData = {
                  name: this.name,
                  user: this.user,
                  email: this.email,
                  address: this.address,
                  phone: this.phone,
                  contrasenia: this.contrasenia,
                  id: this.id
                };
                sessionStorage.setItem('userData', JSON.stringify(userData));
              }).catch(error => {
                  this.$swal({
                      icon: "error",
                      title: "Oops...",
                      text: "Ocurrió un error al actualizar los datos",
                  });
                  Vue.config.errorHandler(error, 'Error al actualizar datos del usuario');
              });
          } else {
              this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Revisa los campos del formulario",
              });
          }
      },
      resetForm() {
          this.loadUserData();
      },
      goBack() {
          this.$router.go(-1);
      },
  },
}
</script>
