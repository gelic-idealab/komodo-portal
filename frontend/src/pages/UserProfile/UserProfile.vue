<template>
    <div>
        <v-row>
            <v-col>
                <div class="mx-auto">
                    <p class="display-1">
                    Account
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
                <v-row>
                    <v-col>
                      {{this.showUserName ? this.fullUserName : this.hiddenUserName}}
                      <v-btn class="mx-2" dark small depressed v-on:click="() => showUserName = !showUserName">
                        <v-icon>{{showUserName ? 'mdi-eye-off' : 'mdi-eye'}}</v-icon>
                      </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                      {{this.showEmail ? this.fullEmail : this.hiddenEmail}}
                      <v-btn class="mx-2" dark small depressed v-on:click="() => showEmail = !showEmail">
                        <v-icon>{{showEmail ? 'mdi-eye-off' : 'mdi-eye'}}</v-icon>
                      </v-btn>
                    </v-col>
                </v-row>
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
              <span>{{item.updateAt}}</span>
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
import { getUserDetailWithAssets } from '../../requests/auth';
import SectionCard from "../../components/Cards/SectionCard";

export default {
  name: "UserAssets",
  components: {
    SectionCard
  },
  data() {
    return {
        userId: this.$store.getters.user.userId,
        showUserName: false,
        showEmail: false,
        hiddenUserName: "",
        fullUserName: "",
        hiddenEmail: "",
        fullEmail: "",
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
        console.dir(user);
        // Initialize the asset list
        this.fullUserName = `${user.firstName} ${user.lastName}`;
        this.hiddenUserName = `${user.firstName.substr(0,1)}. ${user.lastName.substr(0,1)}.`
        this.fullEmail = user.email;
        this.hiddenEmail = this.getAbbreviatedEmail(user.email);
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
    getAbbreviatedEmail(email) {
      let splitEmail = email.split('@');

      if (splitEmail.length != 2) {
        return "Invalid email format.";
      }

      let beforeAt = splitEmail[0];

      let afterAt = splitEmail[1].split('.');

      if (afterAt.length != 2) {
        return "Invalid email format.";
      }

      let betweenAtAndDot = afterAt[0];

      let afterDot = afterAt[1];

      return `${beforeAt.substr(0,1)}...@${betweenAtAndDot.substr(0,1)}....${afterDot}`
    }
  }
}
</script>