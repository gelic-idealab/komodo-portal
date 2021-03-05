<template>
    <div>
        <v-row>
            <!-- local user stream -->
            <v-col v-if="localStream != null">
                <v-card v-if="localStream.getVideoTracks().length">
                    <video muted controls autoplay playsinline width="100%" :srcObject.prop="localStream"></video>
                </v-card>
                <v-card v-else-if="localStream.getAudioTracks().length && !sharingScreen">
                    <v-img
                    class="white--text align-end"
                    height="150px"
                    :src="require('@/assets/img/mic.jpg')"
                    ></v-img>
                    <v-row justify="space-around">
                        <v-card-title>{{ firstName + ' ' + lastName }}</v-card-title>
                    </v-row>
                    <audio muted width="100%" :srcObject.prop="localStream"></audio>
                </v-card>

                <!-- connection in progress indicator -->
                <v-row v-if="!isconnectedToServer && localStream">
                    <v-col>
                        <div class="text-center">
                            <v-progress-circular 
                                color="primary"
                                indeterminate
                            ></v-progress-circular>
                        </div>
                    </v-col>
                </v-row>

                <!-- media controls for local user stream -->
                <v-row v-if="isconnectedToServer && localStream">
                    <v-col>
                        <div class="text-center">
                            <v-btn class="mx-2" fab dark small color="primary" v-show="muted" v-on:click="unMute">
                                <v-icon dark>mic</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab dark small color="error" v-show="!muted" v-on:click="mute">
                                <v-icon dark>mic_off</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab dark small color="primary" v-show="videoIsSupported && !sharingVideo" v-on:click="enableVideo">
                                <v-icon dark>videocam</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab dark small color="error" v-show="sharingVideo" v-on:click="disableVideo">
                                <v-icon dark>videocam_off</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab dark small color="primary" v-show="!sharingScreen" v-on:click="shareScreen">
                                <v-icon dark>screen_share</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab dark small color="error" v-show="sharingScreen" v-on:click="stopShareScreen">
                                <v-icon dark>stop_screen_share</v-icon>
                            </v-btn>
                            <!-- <v-btn class="mx-2" fab dark small color="primary" v-show="true" v-on:click="toggleSpeechToText">
                                <v-icon dark>record_voice_over</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab dark small color="error" v-show="false" v-on:click="toggleSpeechToText">
                                <v-icon dark>voice_over_off</v-icon>
                            </v-btn> -->
                        </div>                        
                    </v-col>
                </v-row>
            </v-col>

            <!-- remote streams -->
            <v-col v-for="connection in connections" :key="connection.call.peer">
                <template v-if="connection.active">
                    <!-- render video track if exists -->
                    <template v-if="connection.stream.getVideoTracks().length">
                        <v-card v-for="track in connection.stream.getVideoTracks()" :key="track.id">
                            <video v-if="track.enabled" controls autoplay playsinline width="100%" :srcObject.prop="connection.stream"></video>
                        </v-card>
                    </template>
                    <!-- else render audio placeholder -->
                    <template v-else-if="connection.stream.getAudioTracks().length">
                        <v-card>
                            <v-img
                            class="white--text align-end"
                            height="150px"
                            :src="require('@/assets/img/mic.jpg')"
                            ></v-img>
                            <v-row justify="space-around">
                                <v-card-title>{{ connection.client_name }}</v-card-title>
                            </v-row>
                        </v-card>
                        <audio controls="controls" autoplay :srcObject.prop="connection.stream"></audio>
                    </template>
                </template>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import io from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';
// import RecordRTC from 'recordrtc';
import { getTurnCredentials } from "../../requests/turn";


export default {
    name: "MediaChat",
    props: {
        sessionId: Number,
        userId: Number,
        firstName: String,
        lastName: String
    },
    data() {
        return {
            audioIsSupported: false,
            callNotification: new Audio(require("../../assets/sound_notification.mp4")),
            chunks: [],
            connections: [],
            images: [],
            isconnectedToServer: false,
            localStream: null,
            muted: false,
            peer: null,
            recorder: null,
            secureSocket: false,
            sharingScreen: false,
            sharingVideo: false,
            socket: null,
            speechToText: false,
            stock: "",
            videoIsSupported: false,
        }
    },
    methods: {
        connect() {
            // connect to chat relay
            this.setupSocket();

            // get local stream
            this.getMediaDevices();
            
            // connect to WebRTC server
            this.createPeer();
        },
        setupSocket() {
            // connect to socket.io relay server
            this.socket = io(`${process.env.VUE_APP_RELAY_BASE_URL}/chat`);

            // register socket event handlers
            this.socket.on('joined', this.addNewPeer);
            this.socket.on('message', this.handleMessage);
        },
        getMediaDevices() {
            // use navigator.mediaDevices.enumerateDevices() to know if webcam or mic is present
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices()
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                if (devices) {
                    console.log('available media devices:', devices);
                    this.handleMediaDevices(devices);
                }
            });
        },
        createPeer() {
            // create new PeerJS connection, setup event handlers
            let url = new URL(process.env.VUE_APP_RTC_URL);
            let host = url.hostname;
            let port = url.port;
            let secure = url.protocol === "https:";
            let config = { 'iceServers': [] };
            
            getTurnCredentials().then((res) => {
                config.iceServers = res.data;

                console.log("=== CONFIG ===", config)

                this.peer = new Peer({
                    host: host,
                    port: port,
                    path: '/call',
                    secure: secure,
                    config: config
                });
                this.peer.on('open', this.connectedToServer);
                this.peer.on('call', this.answer);
            });
        },
        handleMediaDevices(devices) {
            if (devices) {
                for (let d = 0; d < devices.length; d++) {
                    if (devices[d].kind == 'audioinput') {
                        this.audioIsSupported = true;
                    }
                    if (devices[d].kind == 'videoinput') {
                        this.videoIsSupported = true;
                    }
                }
                this.getLocalStream(this.audioIsSupported, false);
            } else {
                console.log('no media devices detected, cannot get local media stream')
            }
        },
        getLocalStream(getAudio, getVideo) {
            console.log('getting local media stream with audio:', getAudio, 'video:', getVideo);
            navigator.getUserMedia({audio: getAudio, video: getVideo}, (stream) => {
                this.localStream = stream;
                if (stream.getVideoTracks().length) {
                    this.sharingVideo = true;
                }
                if (this.muted) {
                    this.mute();
                }
                console.log('local stream added:', this.localStream);

                // this.addStreamToRecording(stream);  TODO(rob): removing audio recording for now to focus on data playback. 

                // renegotiate calls with new local stream
                this.renegotiateCalls();
            }, (err) => {
                console.log('error getting local stream:', err);
            });
        },
        addStreamToRecording(stream) { // TODO(rob): removing audio capture for now to focus on data playback. 

            // let streams = new MediaStream([...stream.getTracks()]);
            // this.recorder = new MediaRecorder(streams);
            
            // this.recorder.ondataavailable = (e) => {
            //     this.chunks.push(e.data);
            // }

            // this.recorder.onstop = (e) => {
            //     var a = document.createElement("a");
            //     document.body.appendChild(a);
            //     a.style = "display: none";
            //     let url = window.URL.createObjectURL(e.data);
            //     a.href = url;
            //     a.download = 'test.webm';
            //     a.click();
            //     window.URL.revokeObjectURL(url);
            // }
            // this.recorder.start();

            // if (!this.recorder) {
            //     let options = {
            //         type: 'audio',
            //         // mimeType: 'audio/wav',
            //         // desiredSampRate: 16000,
            //         // numberOfAudioChannels: 1,
            //         // timeSlice: 2000,
            //         // ondataavailable: this.downloadBlob
            //     }
            //     this.recorder = new RecordRTC([stream], options);
            //     this.recorder.stopRecording(function(blob) {
            //         console.log("RECORDER BLOB =============", blob.size, blob);
            //     });
            //     this.recorder.startRecording();
            //     console.log("adding stream to recorder:", this.recorder);

            // } else {
            //     this.recorder.getInternalRecorder().addStreams([stream]);
            // }
        },
        emitAudioBlob(blob) {
            this.socket.emit('mic', {
                session_id: this.sessionId, 
                client_id: this.userId, 
                client_name: this.firstName + " " + this.lastName, 
                blob: blob
            });
        },
        enableVideo() {
            this.sharingVideo = true;
            // bump screen share feed if exists
            if (this.sharingScreen) {
                this.stopShareScreen();
            }
            this.getLocalStream(true, true);
        },
        disableVideo(renegotiate=true) {
            this.sharingVideo = false;
            let tracks = this.localStream.getVideoTracks();
            for (let t = 0; t < tracks.length; t++) {
                tracks[t].stop();
                tracks[t].enabled = false;
                this.localStream.removeTrack(tracks[t]);
            }
            if (renegotiate) {
                this.getLocalStream(true, false);
            }
        },
        shareScreen() {
            console.log('getting screen share stream')
            // bump the current webcam feed if exists
            if (this.sharingVideo) {
                this.disableVideo();
            }
            navigator.mediaDevices.getDisplayMedia().then((stream) => {
                console.log('got screen share stream:', stream);
                let screenTracks = stream.getTracks();
                for (let i = 0; i < screenTracks.length; i++) {
                    console.log('adding screen share track to local stream:', screenTracks[i])
                    if (this.localStream) {
                        screenTracks[i].onended = this.userStoppedScreenShare;
                        this.localStream.addTrack(screenTracks[i]);
                        console.log('localStream tracks:', this.localStream.getTracks())
                    }
                }
                this.sharingScreen = true;
                this.renegotiateCalls();
            })
            .catch(err => { console.error("Error:" + err); 
            });
        },
        stopShareScreen(renegotiate=true) {
            console.log('stopping screen share')
            this.sharingScreen = false;
            if (this.localStream.getVideoTracks()) {
                let tracks = this.localStream.getVideoTracks();
                for (let t = 0; t < tracks.length; t++) {
                    tracks[t].stop();
                    tracks[t].enabled = false;
                    this.localStream.removeTrack(tracks[t]);
                }
            }
            if (renegotiate) {
                this.renegotiateCalls();
            }
        },
        renegotiateCalls() {
            // re-call everyone with new localStream tracks
            this.connections.forEach(connection => {
                if (connection.call._open) {
                    console.log('renegotiating call:', connection.call)
                    this.call(connection.client_id, connection.call.peer, connection.client_name);
                }
            });
        },
        userStoppedScreenShare() {
            this.stopShareScreen();
        },
        mute() {
            console.log('muting mic')
            if (this.localStream.getAudioTracks()) {
                this.localStream.getAudioTracks().forEach(track => {
                    track.enabled = false;
                });
            }
            this.muted = true;
            this.recorder.stopRecording();
        },
        unMute() {
            console.log('unmuting mic')
            if (this.localStream.getAudioTracks()) {
                this.localStream.getAudioTracks().forEach(track => {
                    track.enabled = true;
                });
            }
            this.muted = false;
            // this.recorder.startRecording();
        },
        addNewPeer(data) {
            console.log('joined event:', data);
            let client_id = data[1];
            let new_peer_id = data[2];
            let client_name = data[3];
            if (new_peer_id && new_peer_id != this.peer.id) {
                this.call(client_id, new_peer_id, client_name);
            }
        },
        connectedToServer(id) {
            this.isconnectedToServer = true;
            console.log('Connected to Komodo RTC server, joining with peerId:', id);
            // emit the `join` event to start peerjs signaling process with existing clients
            this.socket.emit('join', [this.sessionId, this.userId, id, this.firstName+' '+this.lastName]);
        },
        call(client_id, peer_id, client_name) {
            if (this.peer._destroyed) {
                console.log('cannot call, peer has been destroyed:', this.peer);
                return;
            }
            if (this.peer._disconnected) {
                console.log('reconnecting peer...')
                this.peer.reconnect();
            }
            if (client_id && peer_id) {
                console.log('calling client:', client_id, 'with peer id:', peer_id);
                let call = this.peer.call(peer_id, this.localStream, { metadata: { client_id: this.userId, client_name: this.firstName+' '+this.lastName } });
                call.on('stream', remoteStream => {
                    if (remoteStream.id !== this.localStream.id) {
                        this.soundNotification();
                        let connection = this.connections.find(connection => connection.client_id === client_id);
                        this.$set(connection, "stream", remoteStream);
                        this.$set(connection, "active", true);
                        console.log('added remote stream to connection:', connection);
                        this.addStreamToRecording(remoteStream);
                    }                    
                });

                call.on('close', () => {
                    console.log('call closed event:', call.connectionId);
                    let connection = this.connections.find(connection => connection.call.connectionId === call.connectionId);
                    if (connection) {
                        this.soundNotification();
                        this.$set(connection, "active", false);
                    }
                });

                // new connection to add
                let connection = { initiator: true, client_id: client_id, client_name: client_name,call: call, stream: null, active: false }

                // if we are renegotiating an existing connection, overwrite the call
                let existing = this.connections.find(connection => connection.client_id === client_id);
                if (existing == undefined) {
                    this.connections.push(connection);
                } else {
                    existing.call = call;
                }
            } else {
                console.log('missing client or peer id:', client_id, peer_id)
            }

        },
        answer(call) {
            if (call) {
                let client_id = call.options.metadata.client_id;
                let client_name = call.options.metadata.client_name;
                console.log('call received from client:', client_id, call);
                if (this.localStream) {
                    call.answer(this.localStream);
                } else {
                    console.log('no local stream, one way call initiating')
                    call.answer();
                }

                // when we get the remote stream from the new client, add the stream to the correct connection object
                call.on('stream', remoteStream => {
                    if (remoteStream.id !== this.localStream.id) {
                        let connection = this.connections.find(connection => connection.client_id === client_id);
                        this.$set(connection, "stream", remoteStream)
                        this.$set(connection, "active", true);
                        console.log('added remote stream to connection:', connection);
                    }
                });

                call.on('close', () => {
                    console.log('call closed event:', call.connectionId);
                    let connection = this.connections.find(connection => connection.call.connectionId === call.connectionId);
                    if (connection) {
                        this.$set(connection, "active", false);
                    }
                });
                
                // new connection to add
                let connection = { initiator: false, client_id: client_id, client_name: client_name, call: call, stream: null, active: false }

                // if we are renegotiating an existing connection, overwrite the call
                let existing = this.connections.find(connection => connection.client_id === client_id);
                if (existing == undefined) {
                    this.connections.push(connection);
                } else {
                    existing.call = call;
                }

            } else {
                console.log('call received without client id:', call);
                call.close();
            }

        },
        hangup() {

            // this.recorder.stop();

            this.disableVideo(false);
            this.stopShareScreen(false);
            this.stopStream();
            console.log('hanging up')
            for (let c = 0; c < this.connections.length; c++) {
                console.log('closing connection:', this.connections[c]);
                this.connections[c].call.close();
            }
            this.localStream = null;
            this.connections = [];
            this.peer.disconnect();
            this.isconnectedToServer = false;
            this.socket.disconnect();

        },
        stopStream(){
            if(this.localStream){
            this.localStream.getAudioTracks().forEach(function(track){
                track.stop();
            })
            this.localStream.getVideoTracks().forEach(function(track){
                track.stop();
            });
            }
        },
        toggleSpeechToText() {
            this.speechToText = !this.speechToText;
        },
        handleMessage(data) {
            console.log('received message:', data);
            let message = data.message;
            if (message.type == 'remove client' && data.client_id) {
                let client_id = data.client_id;
                let connection = this.connections.find(connection => connection.client_id === client_id);
                let index = this.connections.indexOf(connection);
                this.connections.splice(index, 1);
            }
        },
        getRandomPhoto() {
            axios.get("https://api.unsplash.com/photos/random?client_id=jwSscNph9SmataZOQLdMqaPV6exzrdFBOiZ0DWzZwbw&content_filter=high&query=dragon")
            .then((res) => {
                this.images.push(res.data.urls.regular);
            })
        },
        soundNotification(){
            this.callNotification.play();
        }
    }
}
</script>

<style>

</style>