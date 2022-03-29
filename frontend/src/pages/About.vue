
<template>
  <v-container>
    <v-img
      :src="require('../assets/img/komodo-logo-wordmark-rusa-award.jpg')"
      alt="Title Project Komodo, with a gray, smiling, cartoon Komodo dragon wearing a virtual reality headset and pointing with a teaching stick or laser beam. Beneath it is the text, 'ALA • References and User Services Association • Emerging Technologies Section -- 2021 Best Emerging Technology Application Award'"
    ></v-img>
    <br>
    <hr>
    <v-row>
      <v-col :cols="12" class="text-body-1 font-italic">
        Last updated June 18th, 2021.
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <h2 class="font-weight-bold">
          Catalyzing Browser-Based VR Instruction.
        </h2>
        <h3>Project Komodo is an upcoming SDK and web service that will make it easy for instructors to deploy social virtual reality education apps.</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6" class="">
        <div class="deep-purple lighten-5 pa-2 rounded d-flex justify-center align-baseline">
          <span class="ma-1 text-body-1">Follow our progress: </span>
          <v-btn 
            small 
            color="primary" 
            class="ma-1" 
            href="https://publish.illinois.edu/graingeridealab/">IDEA Lab Blog →
          </v-btn>
        </div>
      </v-col>
      <v-col :cols="6" class="">
        <div class="deep-purple lighten-5 pa-2 rounded d-flex justify-center align-baseline">
          <span class="ma-1 text-body-1">Already have access?</span>
          <v-btn 
            small 
            color="primary" 
            class="ma-1" 
            href="https://komodo-dev.library.illinois.edu/login">Log in →</v-btn> 
        </div>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col :cols="12">
        Read more about our original vision in the blog post, <a class="font-weight-bold" href="https://publish.illinois.edu/graingeridealab/2021/06/18/initial-vision-for-project-komodo-future-educational-vr-ecosystem-catalyzer/">Initial Vision for Project Komodo: “Future Educational VR Ecosystem Catalyzer”</a>.
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="12">
        <h2>
          <span class="font-weight-bold">Turn-Key Social VR Classrooms for Instructors. </span>
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="4">
        <span class="font-weight-bold">Instantly deploy a classroom session.</span> Komodo provides social features for class sessions: networked tools, VR avatars, and, coming soon, cross-platform audio and video chat.
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Manage sessions and upload models.</span> Komodo helps you schedule sessions and get content in easily. We can store 3D and 2D content for you.
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Analyze student, asset, and session statistics.</span> Komodo automatically networks and tracks interactions with content. Our data pipeline shows flexible metrics views in the web portal (coming soon).
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6" class="">
      </v-col>
      <v-col :cols="6" class="">
        <div class="deep-purple lighten-5 pa-2 rounded d-flex justify-center align-baseline">
          <span class="ma-1 text-body-1">Sign up to express interest!</span>
          <v-btn 
            small 
            color="primary" 
            class="ma-1"
            href="https://forms.gle/sNo8btXpbD4E39zr6">Sign up →</v-btn> 
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="12">
        <h2>
          <span class="font-weight-bold">Designed for Developers to Build Powerful Extensions. </span>
        </h2>
        <br><span>By building on top of popular engines and frameworks, we hope research programmers, student developers, and independent professionals can easily add domain-specific content. Komodo SDK support is still in the early stages, but our GitHub is available to everyone.</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="4">
        <span class="font-weight-bold">Start with the Unity SDK.</span> Download and open the Project Komodo Package in Unity. You’ll get the out-of-the-box features described.
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Implement the domain module.</span> Customize the environment, add 3D models, program custom features, and connect our networking components. 
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Build and upload. </span>Build your module and serve it with our Komodo build server.  In the near future, in the web portal, you'll be able to customize data analytics for both your scene content and user-uploaded assets.
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6" class="">
      </v-col>
      <v-col :cols="6" class="">
        <div class="deep-purple lighten-5 pa-2 rounded d-flex justify-center align-baseline">
          <span class="ma-1 text-body-1">Check out the repos: </span>
          <v-btn 
            small 
            color="primary" 
            class="ma-1" 
            href="https://github.com/gelic-idealab/komodo/blob/e6500eb1b53dfbd1d2f21d76ec9e91b52454ed0b/ABOUT.md">GitHub →
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <h2>Pilot Domain Modules</h2>
    <v-row>
      <v-col :cols="12">
        Since January 2020, we have been partnering with faculty to deploy Illinois-specific extensions of Komodo, which we call "domain modules.”
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="4">
        <subtitle class="font-weight-bold">Fashion Illustration Module</subtitle>
        <h3>Tilt Brush Critique</h3>
        <v-img
          :src="require('../assets/img/project-komodo-fashion-critique-bee.jpg')"
          height="175"
          alt="Five digital astronaut heads and hands are looking at a bee-inspired garment on a mannequin. The group is inside a moderately large hall, with three garments and mood boards in the background in front of a window wall."
        ></v-img>
        <br>
        <p>
        Professor Chiara Vincenzi has successfully piloted cutting-edge curriculum in Fashion Illustration by <a href="https://vr.illinois.edu/2019/11/20/fashion-illustration-students-explore-vr/">teaching students to ideate with Tilt Brush</a>. She has dreamt up industry-and-academia-changing possibilities for fashion and XR. We have run social VR fashion critiques with these Tilt Brush garments for two semesters.
        </p>
        
        <p><a href="https://github.com/gelic-idealab/design-critique/">Follow the GitHub repo →</a></p>
        
        <p><a href="https://publish.illinois.edu/graingeridealab/">Check our blog for updates →</a></p>
        <!--
        <v-img
          :src="require('../assets/img/headshot-chiara.png')"
          height="125"
          alt="Headshot of Professor Chiara Vincenzi in front of a white wall."
        ></v-img>
        -->
      </v-col>
      <v-col :cols="4">
        <subtitle class="font-weight-bold">Materials Science Module</subtitle>
        <h3>Learning Miller Indices</h3>
        <v-img
          :src="require('../assets/img/komodo-matse-unit-cell-plane-drawings-2021-01-13.jpg')"
          height="175"
          alt="A 3D virtual environment. In the foreground, a set of blue spheres are arranged horizontally in a square. Green hand-drawn circles surround each sphere where it intersects a metallic, circular, horizontal plane. Next to it is a similar group of objects, but with five orange spheres visible instead of four blue ones. In the background, there is a digital astronaut head, on a grassy terrain at sunset."
        ></v-img>
        <br>
        <p>
        Dr. Andre Schleife has already brought students into the smallest unit of a crystal structure to better <a href="https://www.ideals.illinois.edu/handle/2142/102373">visualize its geometric properties in VR</a>.  Now, he is looking to test whether students will learn controlling geometric with their own hands or walking around large-scale atomic simulations. 
        We believe our web-based deployment will make the main bottleneck – the setup time for Windows Mixed Reality – go away. 
        </p>
        <p><a href="https://github.com/gelic-idealab/molecular-dynamics/">Follow the GitHub repo →</a></p>
        
        <p><a href="https://publish.illinois.edu/graingeridealab/">Check our blog for updates →</a></p>
        <!--
        <v-img
          :src="require('../assets/img/headshot-andre.png')"
          height="125"
          alt="Headshot of Dr. Andre Schleife in front of a brick wall."
        ></v-img>
        -->
      </v-col>
      <v-col :cols="4">
        <subtitle class="font-weight-bold">IMPRESS Module</subtitle>
        <h3>Tilt Brush Astronomy</h3>
        <v-img
          :src="require('../assets/img/ian-parker-total-solar-eclipse-sequence-rotated.jpg')"
          height="175"
          alt="A composited image. Black background, with white light. From top left to bottom right: less than a quarter moon, a partial eclipse with a small part of the corona visible, full eclipse with a corona appearing three times as large as the diameter of the moon, then the reverse of the first two."
        ></v-img>
        <br>
        <p>
        PhD student James Planey has developed a positional tracking system for Tilt Brush to help assess whether virtual reality drawing improves astronomy learning outcomes. With Komodo, he is working to set a new standard for pedagogy insights via data analysis and student observation in WebXR. 
        </p>
        <p><a href="https://github.com/gelic-idealab/impress/">Follow the GitHub repo →</a></p>
        
        <p><a href="https://publish.illinois.edu/graingeridealab/">Check our blog for updates →</a></p>
        
       <p class="font-italic">Photo by Ian Parker on Unsplash</p>
      </v-col>
    </v-row>

    <h2 class="font-weight-bold">Acknowledgements</h2>
    <h3>Special thanks to these University of Illinois organizations:</h3>
    <v-row>
      <v-col :cols="12">
        <v-row>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/technology-services-logo.png')"
              :height="90"
              contain></v-img>
            <br><a class="font-weight-bold" href="https://techservices.illinois.edu/">Technology Services</a> at the University of Illinois for its generous financial support
          </v-col>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/vr-at-illinois-logo.png')"
              :height="90"
              contain></v-img>
            <br>The <a class="font-weight-bold" href="https://vr.illinois.edu/">Virtual Reality at Illinois Committee</a> (VR @ IL) for coordinating the project and continuously providing support
          </v-col>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/idea-lab-logo-cropped.png')"
              alt="Grainger Idea Lab logo, with technological and data-centric icons and imagery."
              :height="90"
              contain></v-img>
            <br><a class="font-weight-bold" href="https://library.illinois.edu/enx">Grainger Engineering Library</a> for providing development support, outreach support, and generous financial support
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <h3>Thank you, sponsors!</h3>
    <v-row>
      <v-col :cols="12">
        We were granted the 2021 RUSA Best Emerging Technology Application award, sponsored by Chatstaff and LibraryH3lp.
        <v-row>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/rusa-logo-large.png')"
              :height="90"
              contain></v-img>
            <br>
          </v-col>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/rusa-chatstaff.png')"
              :height="90"
              contain></v-img>
          </v-col>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/rusa-libraryh3lp.png')"
              :height="90"
              contain></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <h3>Thank you to these individuals for supporting or contributing to the project:</h3>
    <v-row>
      <v-col :cols="3">
        Yifan Bao
        <br>Megan Baird
        <br>Elisandro Cabada
        <br>Xianzhuo (Patrick) Cao
        <br>Brandon Dang
      </v-col>
      <v-col :cols="3">
        Mihir Joshi
        <br>Welisa Lewis
        <br>Zhe Liu
        <br>Nishi Mehta
        <br>William H. Mischo
      </v-col>
      <v-col :cols="3">
        Jamie Nelson
        <br>Dennis Piehl
        <br>James Planey
        <br>Dr. Andre Schleife
        <br>David Tamayo
      </v-col>
      <v-col :cols="3">
        Professor Chiara Vincenzi
        <br>Robert Wallace
        <br>Jim Wentworth
        <br>Xiaohan Yin
        <br>Chengyi Zhang
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="4">
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Thanks for reading!</span>
        <v-img
          :src="require('../assets/img/astronaut-wave.gif')"
          alt="An astronaut avatar head and hands does a friendly wave."
        ></v-img>
      </v-col>
      <v-col :cols="4">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AboutPage",
  components: {
  },
  data() {
    return {
      test: 0
    }
  },
  methods: {

  }
}
</script>