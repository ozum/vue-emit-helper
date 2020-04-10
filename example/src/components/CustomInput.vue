<template>
  <div>
    Unit Price:
    <!-- Emits { quantity, unitPrice: new-unit-price } -->
    <input v-model="unitPrice">
    Quantity:
    <!-- Emits { quantity: new-quantity, unitPrice } -->
    <input v-model="quantity">

    <!-- Emits { quantity, unitPrice: unitPrice / 2  } -->
    <button @click="emitWith('unitPrice', unitPrice / 2)">Reduce 50%</button>

    <!-- Emits { quantity: 12, unitPrice  } -->
    <button @click="emitWith('quantity', 12)">Make a dozen</button>

    <div style="color:red;">Total: {{ total }}</div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import useEmitHelper from "vue-emit-helper";

export default {
  props: {
    value: { type: Object, required: true } // ie. { unitPrice: 1, quantity: 3 }
  },
  setup(props, context) {
    const { getVModel, emitWith } = useEmitHelper(props, context);

    return {
      emitWith,
      unitPrice: getVModel("unitPrice"),
      quantity: getVModel("quantity"),
      total: computed(() => props.value.unitPrice * props.value.quantity)
    };
  }
};
</script>
