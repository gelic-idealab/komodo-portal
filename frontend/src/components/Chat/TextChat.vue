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
      <!-- HACK(rob): only render keyboard messages -- TODO(rob): use speechToText render flag from MediaChat -->
        <v-card-text v-if="record.type === `text`" class="px-2 py-1">
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
// import {Howl, Howler} from 'howler';

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
      // audioManifest: null,
      // audioCache: [],
      // audioIndex: 0,
      // currentAudioPlaying: null,
      // loadedAudio: [],
      socket: null,
      userId: this.$store.getters.user.userId,
      text: "",
      records: [
        { sessionId: 1, clientId: 1, clientName: "Komodo", text: "Let's chat :)", time: this.formatTime(Date.now()) , type: "text" },
      ]
    }
  },
  mounted() {
    this.socket = io(`${process.env.VUE_APP_RELAY_BASE_URL}/chat`); 
    this.socket.emit("join", [this.sessionId, this.userId]);
    this.socket.on("micText", this.handleMicText);

    // TODO(rob): Mar 3 2021 -- removing audio playback for now to focus on data. 
    // this.socket.on("playbackAudioManifest", this.handleAudioManifest);
    // this.socket.on("playbackAudioData", this.handleplaybackAudioData);
    // this.socket.on("startPlaybackAudio", this.startPlaybackAudio);
  },
  methods: {
    cleanup() {
      // if (this.currentAudioPlaying) {
      //   console.log('stopping capture session audio playback')
      //   this.loadedAudio[this.currentAudioPlaying].stop();
      // }
      // this.loadedAudio = null;
      this.socket.disconnect();
    },
    formatTime(ts) {
      return moment(ts).format('h:mm a');
    },
    handleMicText(record) {
      this.appendRecord(record).then( () => { this.updateScroll(); });
    },
    // handleAudioManifest(data) {
    //   this.audioManifest = data;
    // },
    // handleplaybackAudioData(data) {
    //   console.log('audio replay data:', data);
    //   this.audioCache.push(data); // TODO(rob): need to build cache per client!
    //   if (this.audioCache.length == this.audioManifest.length) {
    //     this.sortAudioCache();
    //     this.preloadAudio();
    //     this.scheduleAudio();
    //   }
    // },
    // sortAudioCache() {
    //   this.audioCache.sort((a, b) => (Number(a.seq) > Number(b.seq)) ? 1 : -1);
    // },
    // preloadAudio() {
    //   this.audioCache.forEach(item => {
    //     let buf = Buffer.from(item.data);
    //     let blob = new Blob([buf], { type: "audio/wav" });
    //     let url = URL.createObjectURL(blob);
    //     let haudio = new Howl({ 
    //       src: [url],
    //       format: ['wav'],
    //     });
    //     this.loadedAudio.push(haudio);
    //   })
    // },
    // scheduleAudio(){
    //   this.loadedAudio.forEach((item, index, loadedAudio) => {
    //     item.on('end', () => {
    //       loadedAudio[index+1].play();
    //       this.currentAudioPlaying++;
    //     });
    //   });
    // },
    // startPlaybackAudio() {
    //   console.log('starting playback audio');
    //   this.currentAudioPlaying = 0;
    //   this.loadedAudio[0].play();
    // },
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
    max-height: 800px;
  }
  @media screen and (max-width: 800px) and (max-height: 450px){
    .chat-history-container {
    overflow-y: scroll;
    max-height: 250px;
    }
  }
</style>
