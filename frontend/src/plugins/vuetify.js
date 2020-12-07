import Vue from "vue"
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"
// Material Design Icons
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: 'md',
  },
  theme: {
    themes: {
      light: {
        primary: "#7f5de9",
        accent: "#AB68CA",
        secondary: "#377ED4",
        tertiary: "#DE67A3",
        success: "#4DC08C",
        warning: "#FFA91B",
        error: "#FF3D8B"
      }
    }
  }
};

export default new Vuetify(opts)
