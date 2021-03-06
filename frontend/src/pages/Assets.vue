<template>
  <div>
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
          <v-container fluid>
            <v-row>
              <v-text-field
                class="ma-3"
                clearable
                dense
                outlined
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
              ></v-text-field>
            </v-row>
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
              <span>{{ moment(item.updateAt).format("L LT") }}</span>
            </template>
            <template v-slot:item.isPublic="{ item }">
                <span> {{ item.isPublic ? `Public` : `Private`}} </span>
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
import { getAssetList, getAssetDetail } from "../requests/asset"
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
            { text: "Updated", value: "updateAt"},
            { text: "Visibility", value: "isPublic"}
        ],
        assets: [],
        unpublishedAsset: [],
        publishedAsset: [],
        showPublicAssets: false
    }
  },
  mounted() {
    // Initialize the asset list
    getAssetList().then(data => {
      this.assetList = data.data;
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
  }
}
</script>

<style scoped>
  .model-viewer {
    width: 100%;
    min-height: 200px;
  }
</style>
