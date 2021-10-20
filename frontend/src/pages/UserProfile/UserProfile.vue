<template>
    <div>
        <v-row>
            <v-col>
                <div class="mx-auto">
                    <p class="display-1">
                    Profile page
                    </p>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <SectionCard title="User information">
                <template v-slot:actions>
                    <router-link :to="{ name: 'Account' }">
                        <v-btn text small color="success">
                        <v-icon small left>mode_edit</v-icon>
                        Edit
                        </v-btn>
                    </router-link>
                </template>
                    <div class="text--primary mx-auto" style="width:80%;" align="center" justify="center">
                        <v-row>
                            <v-col>
                            Name:
                            </v-col>
                            <v-col>
                            {{ $store.getters.user.firstName }} {{ $store.getters.user.lastName }}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                            email:
                            </v-col>
                            <v-col>
                            {{ $store.getters.user.email }}
                            </v-col>
                        </v-row>
                    </div>
                </SectionCard>
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
                <span>Public</span>
            </template>
            </v-data-table>
          </v-container>
        </SectionCard>
      </v-col>
    </v-row>
    </div>
</template>

<script>
import { getUserDetailWithAssets } from '../../requests/auth';
import SectionCard from "../../components/Cards/SectionCard";

export default {
  name: "Assets",
  components: {
    SectionCard
  },
  data() {
    return {
        userId: this.$store.getters.user.userId,
        userName: "",
        search: "",
        assetList: [],
        headers: [
            { text: "Name", value: "assetName" },
            { text: "Description", value: "description", sortable: false },
            { text: "Updated", value: "updateAt"},
            { text: "Visibility", value: "isPublic"}
        ],
        assets: [],
        showPublicAssets: false
    }
  },
  mounted() {
    // Initialize user information and asset table
    const userId = this.$store.getters.user.userId;
    Promise.all([getUserDetailWithAssets({userId})])
    .then(values => {
        const user = values[0].data;
        // Initialize the asset list
        this.userName = user.first_name;
        this.assetList = user.assetList;
    })
  },
  methods: {
    onAssetClick({ assetId }) {
        this.$router.push({
            name: "Asset Detail",
            params: { assetId }
        });
    },
  }
}
</script>