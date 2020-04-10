# vue-emit-helper



Helper functions for emitting values from Vue component using composition API.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Synopsis](#synopsis)
- [Details](#details)
- [API](#api)
- [vue-emit-helper](#vue-emit-helper)
  - [Functions](#functions)
    - [useEmitHelper](#useemithelper)
- [Interfaces](#interfaces)
- [Interface: EmitHelper](#interface-emithelper)
  - [Hierarchy](#hierarchy)
  - [Properties](#properties)
    - [attrs](#attrs)
    - [emitWith](#emitwith)
    - [getVModel](#getvmodel)
    - [listeners](#listeners)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Installation
# Synopsis

Please see full example on [GitHub](https://github.com/ozum/vue-emit-helper/tree/master/example) or [CodeSandbox](https://codesandbox.io/s/vue-emit-helper-basic-bfvnj)

```ts
<template>
  <div>
    <input v-model="unitPrice" />
    <input v-model="quantity" />
    <input ... v-on="listeners" />
    <input :value="value.modifications[default]" @input="emitWith(`modifications.${default}`, $event)" />
  </div>
</template>

<script lang="ts">
import useEmitHelper from "vue-emit-helper";

export default defineComponent({
  props: {
    value: { type: Object, required: true } // i.e object value: { quantity: 4, unitPrice: 12.3, modifications: {...} }
  },
  setup(props, context) {
    // Default options are: { prop: "value", event: "input" }
    const { getVModel, emitWith, listeners, attrs } = useEmitHelper(props, context);

    // ... your setup code

    return {
      quantity: getVModel("quantity"),
      unitPrice: getVModel("unitPrice"),
      default: "vat", // For advanced usage shown in example template.
    }
  }
})
</script>
```

# Details

Using Vue composition API, provides helper functions which emits (immutable) values with deep objects/arrays/Maps.
Also provides functions which returns values used as `v-model`, which emits configured event automatically.

For example:

```ts
const { getVModel } = useEmitHelper(props, context);

const quantity = getVModel("item.quantity");

// Approximately equal to:
const quantity_2 = computed({
  get: () => props.value.item.quantity,
  set: (newQuantity) => context.emit("input", immutableSet("props.value", "item.quantity", newQuantity))
})
```

# API


<a name="readmemd"></a>

[vue-emit-helper](#readmemd)

# vue-emit-helper

## Functions

###  useEmitHelper

▸ **useEmitHelper**<**P**, **PK**>(`props`: P, `context`: SetupContext, `__namedParameters`: object): *[EmitHelper](#interfacesemithelpermd)*

*Defined in [index.ts:75](https://github.com/ozum/vue-emit-helper/blob/b170cbf/src/index.ts#L75)*

Creates helper functions for emitting values from Vue component.

#### Example
```typescript
<template>
  <div>
    <v-numeric v-model="unitPrice" />
    <v-numeric v-model="quantity" />
    <v-numeric ... v-on="listeners" />
    <v-amount :value="value.modifications[default]" @input="emitWith(`modifications.${default}`, $event)" />
  </div>
</template>

<script lang="ts">
import useEmitHelper from "vue-emit-helper";

export default defineComponent({
  props: {
    value: { type: Object, required: true } // Example: { quantity: 4, unitPrice: 12.3, modifications: {...} }
  },
  setup(props, context) {
    const { getVModel, emitWith, listeners } = useEmitHelper(props, context, { prop: "value", event: "input" });
    // ... your setup code

    // See example in `getVModel` also.
    return {
      quantity: getVModel("quantity"),
      unitPrice: getVModel("unitPrice"),
      default: "vat"
    }
  }
})
</script>
```

**Type parameters:**

▪ **P**: *Record‹string, any›*

▪ **PK**: *keyof P*

**Parameters:**

▪ **props**: *P*

is props of Vue component passed to `setup()` function.

▪ **context**: *SetupContext*

is setup context of Vue component passed to `setup()` function.

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`event` | string | "input" |
`prop` | PK | "value" as PK |

**Returns:** *[EmitHelper](#interfacesemithelpermd)*

helper functions.

# Interfaces


<a name="interfacesemithelpermd"></a>

[vue-emit-helper](#readmemd) › [EmitHelper](#interfacesemithelpermd)

# Interface: EmitHelper

## Hierarchy

* **EmitHelper**

## Properties

###  attrs

• **attrs**: *Ref‹Record‹string, string››*

*Defined in [index.ts:34](https://github.com/ozum/vue-emit-helper/blob/b170cbf/src/index.ts#L34)*

Computed value of object of attrs except value of emitted event. This is used to prevent down passing of emiited value.

___

###  emitWith

• **emitWith**: *function*

*Defined in [index.ts:12](https://github.com/ozum/vue-emit-helper/blob/b170cbf/src/index.ts#L12)*

Emits `props.value` after **immutably** setting given `attribute` to given value.
If new value passed is `undefined`, it deletes related key instead of setting it to `undefined`.

**`param`** is the attribute name or path in `props.value`.

**`param`** is the new value to be set, or `undefined` to delete related key from `props.value`.

#### Type declaration:

▸ (`attribute`: Path, `value?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | Path |
`value?` | any |

___

###  getVModel

• **getVModel**: *function*

*Defined in [index.ts:30](https://github.com/ozum/vue-emit-helper/blob/b170cbf/src/index.ts#L30)*

Returns vue `computed` value to be used target of a `v-model` which emits immutable value with new value of the given attribute.
If new value passed to `v-model` is `undefined`, it deletes related key instead of setting it to `undefined`.

#### Example
```typescript
const { getVModel } = useEmitHelper(props, context, { prop: "value", event: "input" });
const quantity = getVModel("item.quantity");

// getVModel("item.quantity") is approximately equal to:
const quantity = computed({
  get: () => props.value.item.quantity,
  set: (newQuantity) => context.emit("input", immutableSet("props.value", "item.quantity", newQuantity))
})
```

**`param`** is the attribute name or path in `props.value`.

**`returns`** `computed` value.

#### Type declaration:

▸ (`attribute?`: Path): *Ref‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`attribute?` | Path |

___

###  listeners

• **listeners**: *Ref‹Record‹string, Function››*

*Defined in [index.ts:32](https://github.com/ozum/vue-emit-helper/blob/b170cbf/src/index.ts#L32)*

Computed value of object of events except emitted event. This is used to prevent down passing of emiited event.

