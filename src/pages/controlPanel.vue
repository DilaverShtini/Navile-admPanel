<script lang="ts" setup>

import { Form } from '../utils'
import { SideBar } from '../utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const opeartionValue = ref('');

// Accesso al valore della variabile 'model' dall'URL
const operationFromQuery = route.query.operation;

if (operationFromQuery !== undefined && operationFromQuery !== null) {
opeartionValue.value = operationFromQuery.toString();
console.log('Model:', opeartionValue.value);
} else {
console.error('Model non definito nell\'URL');
}
</script>

<template>
    <div class="container">
        <div class="sidebar">
            <div class="operationSelected">
                {{ opeartionValue }} 
            </div>
            <SideBar></SideBar>
        </div>
        <div class="form">
            <Form></Form>
        </div>
    </div>
</template>

<style scoped>

.container {
    width: 100%;
    height: 100%;
    border: 1px solid #d5d5d5;
    border-radius: 0.5em;
    max-height: 100em;
    overflow-y: hidden;
}

.operationSelected {
    font-size: large;
    text-transform: uppercase;
    text-align: center;
    line-height: 4em;
    border-bottom: 1px solid #d5d5d5;
}

.sidebar {
    width: 16%;
    height: 100%;
    float: left;
    margin-left: 0%;
    margin-right: 0%;
    line-height: 2em;
    border-right: 1px solid #d5d5d5;
    box-sizing: border-box;
}

.form {
    width: 76%;
    height: 100%;
    float: right;
    margin-top: 2%;
    margin-left: 2%;
    margin-right: 2%;
    box-sizing: border-box
}

</style>