<template>
  <div class="full-height d-flex align-center justify-center">
    <div class="container-card__container py-10 px-12 radius-2 background-white">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContainerCard",
  props: {
  }
}
</script>

<style>
  .container-card__container {
    width: 60%;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 25px -5px rgba(0, 0, 0, 0.15);
  }
  @media screen and (max-width: 400px){
    .container-card__container {
      width: 90%;
    }

    .container-card__container.py-10.px-12.radius-2.background-white {
      padding-top: 30px!important;
      padding-bottom: 30px!important;
      padding-right: 30px!important;
      padding-left: 30px!important;
    }

    form.v-form.full-width .headline {
      font-size: 4vh!important;
    }
    .v-label {
      font-size: small;
    }

    input {
      font-size: small;
    }

    .v-data-table__mobile-row__header {
      font-size: small;
    }

    .d-flex.justify-space-between .subtitle-1 {
      font-size: 3vh!important;
    } 

  }

  @media screen and (max-width: 600px){
    .container-card__container {
      width: 80%;
    }

    .v-data-table td, .v-data-table th {
      padding: 0 9px!important;
    }

    .v-data-table td {
      font-size: small!important;
    }

    .container-card__container.py-10.px-12.radius-2.background-white {
      padding-right: 40px!important;
      padding-left: 40px!important;
    }

    .v-data-footer {
      margin-right: -12px;
      padding: 0!important;
    }

    .v-application--is-ltr .v-data-footer__select .v-select {
      margin: 13px 0 13px 13px!important;
    }

    .v-application--is-ltr .v-data-footer__pagination {
      margin: 0 13px 0 13px!important;
    }

    .v-application--is-ltr .v-data-footer__select {
      margin-right: 0!important;
    }
  }

  @media screen and (max-width: 800px){
    .container-card__container {
      width: 80%;
    }
  }

  @media screen {
    .v-input__control {
      min-width: 50px!important;
    }
  }
</style>
