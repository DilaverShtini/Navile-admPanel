<script lang="ts" setup>  
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const opeartionValue = ref('');

// Accesso al valore della variabile 'operation' dall'URL
const operationFromQuery = route.query.operation;

if (operationFromQuery !== undefined && operationFromQuery !== null) {
  opeartionValue.value = operationFromQuery.toString();
  console.log('Operation:', opeartionValue.value);
} else {
  console.error('Operation non definito nell\'URL');
}
</script>

<template>
    
</template>
