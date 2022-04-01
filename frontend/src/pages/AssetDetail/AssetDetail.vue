<template>
  <div>
    <v-row class="lab-basic-info mb-4 flex-column no-gutters">
      <p class="display-1 text-capitalize">{{ asset.assetName }}</p>
    </v-row>
    <v-row>
      <v-col :cols="8">
        <!-- Model Preview Section -->
        <SectionCard title="Preview">
          <template v-slot:actions>
            <v-btn text small color="grey">
              <v-icon left x-small>mdi-pencil</v-icon>Edit
            </v-btn>
          </template>
          <model-viewer
            v-if="asset.fileType === 'GLB' || asset.fileType === 'GLTF'"
            class="model-viewer"
            :src="asset.path"
            :alt="asset.assetName"
            auto-rotate
            camera-controls
            :exposure="0.5"
          />
          <p v-else class="mb-0">
            (Sorry, the current file type is not supported for previewing.)
          </p>
        </SectionCard>
      </v-col>
      <v-col :cols="4">
        <!-- Description Section -->
        <SectionCard title="Description" class="mb-6">
          <template v-slot:actions>
            <v-btn text small color="grey">
              <v-icon left x-small>mdi-pencil</v-icon>Edit
            </v-btn>
          </template>
          {{ asset.description }}
        </SectionCard>
        <!-- Information Section -->
        <SectionCard title="Information">
          <template v-slot:actions>
            <v-btn text small color="red" v-if="role === `admin` || role === `instructor`" @click="deleteAssetClick">
              <v-icon left x-small>mdi-delete</v-icon>Delete
            </v-btn>
          </template>
          <v-row dense>
            <v-col :cols="4">
              <v-chip outlined>File Type</v-chip>
            </v-col>
            <v-col :cols="8" align-self="center">
              {{ asset.fileType }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col :cols="4">
              <v-chip outlined>Creator</v-chip>
            </v-col>
            <v-col :cols="8" align-self="center">
              {{ asset.creatorName }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col :cols="4">
              <v-chip outlined>Create Time</v-chip>
            </v-col>
            <v-col :cols="8" align-self="center">
              {{ asset.createAt }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col :cols="4">
              <v-chip outlined>Update Time</v-chip>
            </v-col>
            <v-col :cols="8" align-self="center">
              {{ asset.updateAt }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col :cols="4">
              <v-chip outlined>Type</v-chip>
            </v-col>
            <v-col :cols="8" align-self="center">
              {{ asset.isWholeObject ? '3D Model' : '3D Model Pack' }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col :cols="4">
              <v-chip outlined>Default Scale</v-chip>
            </v-col>
            <v-col :cols="8" align-self="center">
              {{ Number(asset.scale).toFixed(2) || 1 }}
            </v-col>
          </v-row>
        </SectionCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getAssetDetail } from "../../requests/asset";
import SectionCard from "../../components/Cards/SectionCard";
import {deleteAsset} from "../../requests/asset"
export default {
  name: "AssetDetail",
  components: {
    SectionCard
  },
  data() {
    return {
      userId: 0,
      role: "",
      assetId: 0,
      asset: {
        assetName: "",
        description: "",
        creatorId: "",
        creatorName: "",
        isPublic: "",
        isWholeObject: "",
        createAt: "",
        updateAt: "",
        path: "",
        scale: "",
        fileType: ""
      }
    }
  },
  mounted() {
    const { assetId } = this.$route.params;
    const { userId, role} = this.$store.getters.user;
    this.userId = userId;
    this.role = role;
    /**
     * Initialize the asset information
     */
    getAssetDetail({ assetId })
      .then(res => {
        const asset = res.data;
        this.assetId = assetId;
        this.asset = {
          ...asset,
          createAt: asset.createAt,
          updateAt: asset.updateAt,
          fileType: asset.path.split('.')[asset.path.split('.').length - 1].toUpperCase()
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    /**
     * Delete the selected asset
     */
    deleteAssetClick(){
      let res = confirm('Are you sure you want to delete this asset?');
      if (res) {
        deleteAsset({assetId: this.assetId})
        .then(() => {
          this.status = "success";
          setTimeout(() => {
          this.$router.push({
            name: "Assets",
          })
        }, 1000);
        })
      }
    },
  }
}
</script>

<style>
  .model-viewer {
    width: 100%;
    min-height: 500px;
  }
</style>
