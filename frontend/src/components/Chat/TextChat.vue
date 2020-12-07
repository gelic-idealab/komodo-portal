<template>
  <div>
    <div
      class="d-flex flex-column chat-history-container"
    >
      <v-card
        v-for="(record, index) of records"
        :key="index"
        class="mb-2"
        :class="record.clientId === userId ? 'align-self-end' : ''"
        style="width: fit-content"
        :color="record.clientId === userId ? 'primary' : 'grey lighten-3'"
        :dark="record.clientId === userId"
        flat
      >
        <v-card-text class="px-2 py-1">
          <div class="caption font-weight-thin">
            {{ `${record.clientName} (${record.time})` }}
            <v-icon x-small>
              {{ record.type === "text" ? "mdi-keyboard" : "mdi-text-to-speech" }}
            </v-icon>
          </div>
          <div>{{ record.text }}</div>
        </v-card-text>
      </v-card>
    </div>
    <v-divider class="mt-1 mb-3" />
    <v-text-field
      v-model="text"
      append-outer-icon="mdi-send"
      @click:append-outer="onSend"
      v-on:keyup.enter="onSend"
      dense
      hide-details
      outlined
    />
  </div>
</template>

<script>
import io from "socket.io-client";
import moment from "moment";

export default {
  name: "TextChat",
  props: {
    sessionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      socket: null,
      userId: this.$store.getters.user.userId,
      text: "",
      records: [
        { sessionId: 1, clientId: 1, clientName: "Komodo", text: "Let's chat :)", time: this.formatTime(Date.now()) , type: "text" },
      ]
    }
  },
  mounted() {
    this.socket = io("https://relay.komodo-dev.library.illinois.edu/chat"); 
    // this.socket = io("http://localhost:3000/chat"); // TODO(rob): should use base url param
    this.socket.emit("join", [this.sessionId, this.userId]);
    this.socket.on("micText", this.handleMicText);
  },
  methods: {
    formatTime(ts) {
      return moment(ts).format('h:mm a');
    },
    handleMicText(record) {
      this.appendRecord(record).then( () => { this.updateScroll(); });
    },
    async appendRecord(record) {
      const {
        session_id: sessionId,
        client_id: clientId,
        client_name: clientName,
        text,
        ts,
        type
      } = record;
      if (sessionId !== this.sessionId) {
        return;
      }
      const time = this.formatTime(ts);
      this.records.push({
        sessionId, clientId, clientName, text, time, type
      });
    },
    updateScroll() {
      const container = document.getElementsByClassName("chat-history-container")[0];
      container.scrollTop = container.scrollHeight;
    },
    onSend() {
      if (this.text != "") {
        this.socket.emit("micText", {
          session_id: this.sessionId,
          client_id: this.userId,
          client_name: `${this.$store.getters.user.firstName} ${this.$store.getters.user.lastName}`,
          text: this.text,
          type: "text",
          ts: Date.now()
        });
        this.text = "";
      }
    }
  }
}
</script>

<style>
  .chat-history-container {
    overflow-y: scroll;
    max-height: 764px;
  }
  @media screen and (max-width: 800px) and (max-height: 450px){
    .chat-history-container {
    overflow-y: scroll;
    max-height: 250px;
    }
  }
</style>
