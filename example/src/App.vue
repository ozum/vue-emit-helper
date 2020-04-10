<template>
  <div>
    <custom-input v-model="lineItem"/>
    <div>Line Item Value: {{ lineItem }}</div>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import CustomInput from "./components/CustomInput.vue";

export default {
  components: { CustomInput },
  setup() {
    const lineItem = ref({
      quantity: 0,
      unitPrice: 0
    });

    return {
      lineItem
    };
  }
};
</script>
