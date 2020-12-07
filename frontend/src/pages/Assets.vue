<template>
  <div>
      <SectionCard title="Recent Uploads">
        <v-row>
            <v-col v-for="(asset, index) in assets" :key="index">
            <v-card>
                <!-- Model Preview Section -->
                <model-viewer
                    v-if="asset.fileType === 'GLB' || asset.fileType === 'GLTF'"
                    class="model-viewer"
                    :src="asset.path"
                    :alt="asset.assetName"
                    auto-rotate
                    camera-controls
                    :exposure="0.5"
                />
                <v-card-title>{{ asset.assetName }}</v-card-title>
                <v-card-text class="text--primary">
                    <div>{{ asset.creatorName}}</div>
                    <div>{{ asset.updateAt }}</div>
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        color="primary"
                        text
                        @click="onAssetClick(asset)"
                    >
                        Inspect
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        </v-row>
      </SectionCard>

    <v-row>
        <v-col>
        <!-- Assets data table section -->
        <SectionCard title="Assets">
          <template v-slot:actions>
            <router-link :to="{ name: 'Asset Create' }">
              <v-btn text small color="success">
                <v-icon small left>mdi-plus</v-icon>
                Upload
              </v-btn>
            </router-link>
          </template>
          <v-container>
            <v-card-title>
              <v-col cols="10">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
              ></v-text-field>
              </v-col>
              <v-col cols="2">
              <v-checkbox
                @change="checkboxUpdate"
                v-model="checkbox"
                :label="`Published`"
              ></v-checkbox>
              </v-col>
            </v-card-title>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="assetList"
              :sort-by="['updateAt']"
              :sort-desc="[true]"
              @click:row="onAssetClick"
              item-key="assetId"
              no-data-text="No asset added"
            >
            <template v-slot:item.updateAt="{ item }">
              <span>{{moment(item.updateAt).format("L LT")}}</span>
            </template>
            </v-data-table>
          </v-container>
        </SectionCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from "moment";
import { getAssetList } from "../requests/asset"
import { getAssetDetail } from "../requests/asset";

import SectionCard from "../components/Cards/SectionCard";

export default {
  name: "Assets",
  components: {
    SectionCard
  },
  data() {
    return {
        search: "",
        assetList: [],
        headers: [
            { text: "Name", value: "assetName" },
            { text: "Description", value: "description", sortable: false },
            { text: "Updated", value: "updateAt"}
        ],
        assets: [],
        unpublishedAsset: [],
        publishedAsset: [],
        checkbox: true
    }
  },
  mounted() {
    // Initialize the asset list
    getAssetList().then(data => {
      this.assetList = data.data;
      this.publishedAsset = this.assetList;
      this.unpublishedAsset = this.assetList.filter(asset => asset.isPublic !== 1);
      let len = this.assetList.length - 1;
      for (let i = len; i > len - 3; i--) {
          this.getAsset(this.assetList[i].assetId);
      }
    })
  },
  methods: {
      getAsset(assetId) {
        getAssetDetail({ assetId })
        .then(res => {
            let asset = res.data;
            let formatted = {
                ...asset,
                createAt: moment(asset.createAt).format("L LT"),
                updateAt: moment(asset.updateAt).format("L LT"),
                fileType: asset.path.split('.')[asset.path.split('.').length - 1].toUpperCase()
            };
            this.assets.push(formatted);
        })
        .catch(err => {
            console.log(err);
        });
      },
      onAssetClick({ assetId }) {
        this.$router.push({
            name: "Asset Detail",
            params: { assetId }
        });
      },
      checkboxUpdate(){
        if(this.checkbox){
          this.assetList = this.publishedAsset;
        } else {
          this.assetList = this.unpublishedAsset
        }
      }
  }
}
</script>

<style scoped>
  .model-viewer {
    width: 100%;
    min-height: 200px;
  }
</style>
