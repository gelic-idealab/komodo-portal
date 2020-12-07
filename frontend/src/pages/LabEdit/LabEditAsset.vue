<template>
<!-- Asset list section -->
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="assetList"
    :items-per-page="5"
    item-key="assetId"
    @input="onChange"
    sort-by="updatedOn"
    :sort-desc="true"
    show-select
  >
    <template v-slot:top>
      <div class="d-flex justify-space-between">
        <span class="subtitle-1">Assets</span>
        <v-btn color="success" @click="uploadNew" outlined small>Upload New Asset</v-btn>
      </div>
    </template>
    <template v-slot:no-data>
      No asset available now.
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "LabEditAsset",
  props: {
    assetList: {
      type: Array,
      default: () => []
    },
    selectedAssetList:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "assetName" },
        { text: "Description", value: "description" },
        { text: "Updated On", value: "updatedOn" },
      ],
      selected: this.selectedAssetList
    }
  },
  watch:{
    selectedAssetList: function(val){
      this.selected = val
    }
  },
  methods: {
    onChange() {
      this.$emit("onSelectChange", this.selected);
    },
    uploadNew() {
      this.$emit("uploadNewAsset");
    }
  }
}
</script>
