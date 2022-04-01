<template>
<!-- Asset list section -->
  <div>
    
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="assetList"
      :search="search"
      :items-per-page="5"
      item-key="assetId"
      @input="onChange"
      sort-by="updatedOn"
      :sort-desc="true"
      show-select
    >
      <template v-slot:top>
        <div class="d-flex justify-space-between">
          <span class="h3">Public Assets</span>
          <v-btn color="secondary" @click="uploadNew" small>Upload</v-btn>
          <v-btn color="secondary" @click="refresh" small>Refresh</v-btn>
        </div>      
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </template>
      <template v-slot:no-data>
        No public assets exist. Press Upload, then press Refresh.
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "LabCreateAsset",
  props: {
    assetList: {
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
      search: '',
      selected: []
    }
  },
  methods: {
    onChange() {
      this.$emit("onSelectChange", this.selected);
    },
    uploadNew() {
      this.$emit("uploadNewAsset");
    },
    refresh() {
      this.$emit("refreshAssetList");
    }
  }
}
</script>
