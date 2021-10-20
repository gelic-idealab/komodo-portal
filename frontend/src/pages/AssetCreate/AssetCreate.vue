<template>
<!-- Create asset page -->
  <ContainerCard>
    <v-form
      class="full-width"
      ref="uploader"
      action="/test"
      method="post"
      enctype="multipart/form-data"
    >
      <v-list-item class="headline">
        Upload New 3D Model
      </v-list-item>
      <v-list-item class="subtitle">
        Only the .GLB file type is supported for now.
      </v-list-item>
      <v-file-input
        name="file"
        v-model="file"
        color="primary"
        label="Select File"
        prepend-icon="mdi-paperclip"
        :show-size="1000"
        accept=".obj,.fbx,.gltf,.glb,.dae"
        :rules="fileRules"
        counter
        chips
        outlined
      >
        <template v-slot:selection="{ text }">
          <v-chip color="primary" label small>
            {{ text }}
          </v-chip>
        </template>
      </v-file-input>
      <v-text-field
        v-model="asset.assetName"
        label="Asset Name"
        required
        :rules="asset.nameRules"
        :counter="20"
        clearable
        outlined
      />
      <v-textarea
        v-model="asset.description"
        label="Description"
        hint="We recommend adding some description to your asset, but you can leave it blank :)"
        rows="3"
        :rules="asset.descriptionRules"
        :counter="255"
        auto-grow
        outlined
      />

      <v-row>
        <v-switch
          v-model="asset.isPublic"
          class="ml-3"
          :label="'Public'"
        />
      </v-row>
      <v-card
        class="mx-auto"
        outlined
      >
        <v-list-item class="text-h3">
          Advanced Settings
        </v-list-item>
        <v-list-item>
          <v-switch
            v-model="asset.isWholeObject"
            class="ml-3"
            :label="'3D Model (Turn off to set as model pack)'"
          />
        </v-list-item>
        <v-list-item>
          <v-text-field 
            prepend-icon="mdi-resize" 
            class="ml-3" 
            v-model.number="asset.scale"
            :rules="asset.scaleRules"
            type="number" 
            label="Scale" 
            outlined
            dense 
          />
        </v-list-item>
      </v-card>

      <v-row justify="center">
        <v-btn class="mr-3" color="accent" @click="goBack">
          Cancel
          <v-icon right>mdi-close-circle-outline</v-icon>
        </v-btn>
        <v-btn v-if="status === 'processing'" disabled>
          Uploading
          <v-progress-circular class="ml-2" indeterminate size="14" width="2" />
        </v-btn>
        <v-btn v-else-if="status === 'success'" color="success">
          Uploaded
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
        <v-btn v-else @click="onSubmit" color="primary">
          Upload
          <v-icon right>mdi-cloud-upload-outline</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </ContainerCard>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { awsPresignAssetPost, awsUploadAsset, createAsset } from "../../requests/asset";
import ContainerCard from "../../components/Cards/ContainerCard";
export default {
  name: "AssetCreate",
  components: {
    ContainerCard
  },
  data() {
    return {
      asset: {
        assetName: "",
        nameRules: [
          v => !!v || "Asset name is required",
          v => v.length <= 20 || 'Title must be less than 20 characters',
        ],
        description: "",
        descriptionRules: [
          v => v.length <= 255 || "Description must be less than 255 characters",
        ],
        isPublic: false,
        isWholeObject: true,
        path: "",
        scale: 1.0,
        scaleRules: [
          v => v > 0 || "Scale must be greater than zero"
        ]
      },
      file: null,
      fileRules: [
        v => !!v || "File is required",
        v => !v || v.size < 52428800 || "File must be less than 50 MB"
      ],
      status: "pending"
    }
  },
  methods: {
    /**
     * Validate the input of the form
     */
    validate() {
      return this.$refs.uploader.validate();
    },
    /**
     * Return the upper level of the page
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * Submit the form to create a new asset
     */
    onSubmit() {
      if (!this.validate()) {
        return;
      }
      this.status = "processing";
      const uuid = uuidv4();
      const fileName = "model." + this.file.name.split(".")[this.file.name.split(".").length - 1];
      // Upload the asset to aws
      awsPresignAssetPost({ uuid })
      .then(res => {
        const formData = new FormData();
        const { url, fields } = res.data;
        this.asset.path = `${url}/${uuid}/${fileName}`;
        formData.append("key", fields.key);
        Object.keys(fields).forEach(key => {
          formData.set(key, fields[key]);
        });
        formData.append("file", this.file, fileName);

        return awsUploadAsset(url, "/", formData);
      })
      .then(() => {
        // Create asset information in the database
        return createAsset({
          uuid,
          ...this.asset
        })
      })
      .then(res => {
        // Redirect to the asset detail page
        this.status = "success";
        setTimeout(() => {
          this.$router.push({
            name: "Asset Detail",
            params: { assetId: res.data.assetId }
          });
        }, 1000);
      })
    }
  }
}
</script>

<style>
</style>
