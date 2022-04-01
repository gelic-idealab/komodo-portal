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
          This page shows everyone's public assets, your public assets, and your private assets.
          <template v-slot:actions>
            <router-link :to="{ name: 'Asset Create' }">
              <v-btn text small color="primary">
                <v-icon small left>mdi-plus</v-icon>
                Upload
              </v-btn>
            </router-link>
            <router-link :to="{ name: 'UserProfilePage' }">
              <v-btn text small color="primary">
                Your Assets
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
              <span>{{ item.updateAt }}</span>
            </template>
            <template v-slot:item.isPublic="{ item }">
              <span v-if="item.isPublic">Public</span>
              <span v-if="!item.isPublic">Private</span>
            </template>
            </v-data-table>
          </v-container>
        </SectionCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getAssetList, getAssetDetail } from "../requests/asset"
import SectionCard from "../components/Cards/SectionCard";

export default {
  name: "AssetsPage",
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
                createAt: asset.createAt,
                updateAt: asset.updateAt,
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
