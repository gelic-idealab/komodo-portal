<template>
  <section class="shadow-section pa-4 pt-0 radius-2 background-white">
    <header class="section-card__header">
      <span class="section-card__title" v-if="title">
        {{ title }}
      </span>
      <div class="section-card__actions">
        <slot name="actions"></slot>
      </div>
    </header>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: "SectionCard",
  props: {
    title: {
      type: String,
      required: false
    }
  }
}
</script>

<style>
  .section-card__header {
    display: flex;
    height: 48px;
    align-items: center;
    justify-content: space-between;
  }

  .section-card__title {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.25px;
    text-transform: uppercase;
  }

  .section-card__actions {

  }
</style>
