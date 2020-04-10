import { SetupContext, computed, Ref } from "@vue/composition-api";
import { get, set, unset, Path } from "immutable-path";

export interface EmitHelper {
  /**
   * Emits `props.value` after **immutably** setting given `attribute` to given value.
   * If new value passed is `undefined`, it deletes related key instead of setting it to `undefined`.
   *
   * @param attribute is the attribute name or path in `props.value`.
   * @param value is the new value to be set, or `undefined` to delete related key from `props.value`.
   */
  emitWith: (attribute: Path, value?: any) => void;
  /**
   * Returns vue `computed` value to be used target of a `v-model` which emits immutable value with new value of the given attribute.
   * If new value passed to `v-model` is `undefined`, it deletes related key instead of setting it to `undefined`.
   *
   * @param attribute is the attribute name or path in `props.value`.
   * @returns `computed` value.
   *
   * @example
   * const { getVModel } = useEmitHelper(props, context, { prop: "value", event: "input" });
   * const quantity = getVModel("item.quantity");
   *
   * // getVModel("item.quantity") is approximately equal to:
   * const quantity = computed({
   *   get: () => props.value.item.quantity,
   *   set: (newQuantity) => context.emit("input", immutableSet("props.value", "item.quantity", newQuantity))
   * })
   */
  getVModel: (attribute?: Path) => Ref<any>;
  /** Computed value of object of events except emitted event. This is used to prevent down passing of emiited event. */
  listeners: Ref<Record<string, Function>>;
  /** Computed value of object of attrs except value of emitted event. This is used to prevent down passing of emiited value. */
  attrs: Ref<Record<string, string>>;
}

/**
 * Creates helper functions for emitting values from Vue component.
 *
 * @param props is props of Vue component passed to `setup()` function.
 * @param context is setup context of Vue component passed to `setup()` function.
 * @returns helper functions.
 *
 * @example
 * <template>
 *   <div>
 *     <v-numeric v-model="unitPrice" />
 *     <v-numeric v-model="quantity" />
 *     <v-numeric ... v-on="listeners" />
 *     <v-amount :value="value.modifications[default]" @input="emitWith(`modifications.${default}`, $event)" />
 *   </div>
 * </template>
 *
 * <script lang="ts">
 * import useEmitHelper from "vue-emit-helper";
 *
 * export default defineComponent({
 *   props: {
 *     value: { type: Object, required: true } // Example: { quantity: 4, unitPrice: 12.3, modifications: {...} }
 *   },
 *   setup(props, context) {
 *     const { getVModel, emitWith, listeners } = useEmitHelper(props, context, { prop: "value", event: "input" });
 *     // ... your setup code
 *
 *     // See example in `getVModel` also.
 *     return {
 *       quantity: getVModel("quantity"),
 *       unitPrice: getVModel("unitPrice"),
 *       default: "vat"
 *     }
 *   }
 * })
 * </script>
 */
export default function useEmitHelper<P extends Record<string, any>, PK extends keyof P>(
  props: P,
  context: SetupContext,
  { prop = "value" as PK, event = "input" } = {}
): EmitHelper {
  function emitWith(attribute: Path, value?: any): void {
    const newValue = value === undefined ? unset(props[prop] as any, attribute) : set(props[prop] as any, attribute, value);
    context.emit(event, newValue);
  }

  function getVModel(attribute?: Path): Ref<any> {
    return attribute
      ? computed({ get: () => get(props[prop], attribute), set: (value: any) => emitWith(attribute, value) })
      : computed({ get: () => props[prop], set: (value: any) => context.emit(event, value) });
  }

  const listeners = computed(() => {
    const newListeners = { ...context.listeners };
    delete newListeners[event];
    return newListeners;
  });

  const attrs = computed(() => {
    const newAttrs = { ...context.attrs };
    delete newAttrs[prop as any];
    return newAttrs;
  });

  return { emitWith, getVModel, listeners, attrs };
}
