<template>
    <v-container fill-height>
        <v-row align="center" justify="center">
        <v-col cols="10" md="6">
            <h2>Registro de Usuario</h2>
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
                        Registrar
                    </v-btn>
                    <v-btn class="ml-2" color="blue" @click="resetForm">
                        Limpiar
                    </v-btn>
                    <v-btn class="ml-2" @click="goBack">
                        Volver
                    </v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import Vue from 'vue';

export default {
    name: 'ResultView',
    props: {
        nombre: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        telefono: {
            type: String,
            required: true
        },
        usuario: {
            type: String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        },

    },
    data() {
        return {
            isFormValid: false,
            showPassword: false,
            name: this.nombre,
            user: this.usuario,
            email: this.correo,
            address: this.direccion,
            phone: this.telefono,
            contrasenia: this.password,
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
                v => !!v || 'Contraseña es requerido',
                v => (v && v.length >= 6) || 'La contraseña no debe ser menor a 6 caracteres',
            ],
        };
    },
    methods: {
        passwordVisibility() {
            this.showPassword = !this.showPassword;
        },
        submitForm() {
            if (this.$refs.form.validate()) {
                axios.post(`/usuarios/save`, {
                    usuario: this.user,
                    correo: this.email,
                    password: this.contrasenia,
                    direccion: this.address,
                    nombre: this.name,
                    telefono: this.phone
                }).then(() => {
                    this.$swal({
                        icon: "success",
                        title: "Información enviada correctamente",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }).then(() => {
                    Cookies.set('ccorreo', this.email, { expires: 7, path: '/' });
                    this.$router.push({ name: 'login' });
                }).catch(error => {
                    this.$swal({
                        icon: "error",
                        title: "Oops...",
                        text: "Ocurrió un error al enviar la información",
                    });
                    Vue.config.errorHandler(error, 'Error al enviar la información');
                });
            }else{
                this.$swal({
                    icon: "error",
                    title: "Oops...",
                    text: "Revisa los campos del formulario",
                })
            }
        },
        resetForm() {
            this.$refs.form.reset();
            this.name = '';
            this.email = '';
            this.contrasenia = '';
        },
        goBack() {
            this.$router.go(-1);
        },
    },
}
</script>