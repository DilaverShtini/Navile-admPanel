<!-- MainInput.vue -->
<template>
  <div class="inputModel">
    <h3 class="text-2xl font-bold mb-4">Open a Model</h3>
    <label :for="id">
      {{ label }}
    </label>
    <input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :id="id"
      :name="id"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    type: {
      type: String,
      default: "text",
    },
    placeholder: String,
    id: String,
  },
  data() {
    return {
      inputValue: "",
    };
  },
};
</script>

<style scoped>

input {
  width: 20em;
  padding: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 0.2em;
}

#openModel {
  background-color: #e2e8f0;
}

#openModel:focus {
  background-color: #e2e8f0;
}

</style>
