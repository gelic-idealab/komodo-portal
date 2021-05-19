
<template>
  <v-container>
    <v-img
      :src="require('../assets/img/komodo-logo-wordmark-v1.1.png')"
      alt="Title Project Komodo, with a purple, smiling, cartoon Komodo dragon wearing a virtual reality headset and pointing with a teaching stick or laser beam."
    ></v-img>
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
          <span class="ma-1 text-body-1">We're looking for beta testers!</span>
          <v-btn 
            small 
            color="primary" 
            class="ma-1"
            href="https://forms.gle/sNo8btXpbD4E39zr6">Sign up →</v-btn> 
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
        <h2>
          <span class="font-weight-bold">Turn-Key Social VR Classrooms for Instructors. </span>
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="4">
        <span class="font-weight-bold">Instantly deploy a classroom session.​</span> Komodo provides social features for class sessions: networked tools, VR avatars, and cross-platform audio and video chat.
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Manage sessions and upload models.</span> Komodo helps you schedule sessions and get content in easily. We can store 3D and 2D content for you.​
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Analyze student, asset, and session statistics.​</span> Komodo automatically networks and tracks interactions with content. Our data pipeline shows flexible metrics views in the web portal.​
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="12">
        <h2>
          <span class="font-weight-bold">Designed for Developers to Build Powerful Extensions. </span>
        </h2>
        <br><span>By building on top of popular engines and frameworks, we hope research programmers, student developers, and independent professionals can easily add domain-specific content. Here's a preview of how to build a module.</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="4">
        <span class="font-weight-bold">Start with the Unity SDK.​</span> Download and open the Project Komodo SDK in Unity. You’ll get the out-of-the-box features described.
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Implement the domain module.</span> Add custom tools and models and connect our networking and analytics components.
      </v-col>
      <v-col :cols="4">
        <span class="font-weight-bold">Build and upload.​</span> Build your module and serve it with our Komodo build server.  In the web portal, customize data analytics for both your scene content and user-uploaded assets.
      </v-col>
    </v-row>

    <h2>Development Status</h2>
    <v-row>
      <v-col :cols="12">
        In Fall 2020, we will test and deploy two Illinois-specific extensions of Komodo, or “Domain Modules.”  One is a materials science module, and the other a fashion illustration module.​
      </v-col>
    </v-row>

    <h3>Fashion Illustration Module: Tilt Brush Critique</h3>
    <v-row>
      <v-col :cols="2">
        <v-img
          :src="require('../assets/img/headshot-chiara.png')"
          height="125"
          alt="Headshot of Professor Chiara Vincenzi in front of a white wall."
        ></v-img>
      </v-col>
      <v-col :cols="6">
        Professor Chiara Vincenzi has successfully piloted cutting-edge curriculum in Fashion Illustration by <a href="https://vr.illinois.edu/2019/11/20/fashion-illustration-students-explore-vr/">teaching students to ideate with Tilt Brush</a>. She has dreamt  up industry-and-academia-changing possibilities for fashion and XR. We believe social VR fashion critiques with these Tilt Brush garments is the best next step.
      </v-col>
      <v-col :cols="4">
        <v-img
          :src="require('../assets/img/fashion-critique-room-sketch.png')"
          height="125"
          alt="User workflow sketch.  On the left, a list of asset names is shown in a web browser.  On the right, four people sit around a dress placed on a pedestal. "
        ></v-img>
      </v-col>
    </v-row>

    <h3>Materials Science Module: Learning Miller Indices</h3>
    <v-row>
      <v-col :cols="2">
        <v-img
          :src="require('../assets/img/headshot-andre.png')"
          height="125"
          alt="Headshot of Dr. Andre Schleife in front of a brick wall."
        ></v-img>
      </v-col>
      <v-col :cols="6">
        Dr. Andre Schleife has already brought students into the smallest unit of a crystal structure to better <a href="https://www.ideals.illinois.edu/handle/2142/102373">visualize its geometric properties in VR</a>.  Now, he is looking to test whether students will learn controlling geometric with their own hands or walking around large-scale atomic simulations. 
        We believe our web-based deployment will make the main bottleneck – the setup time for Windows Mixed Reality – go away.
      </v-col>
      <v-col :cols="4">
        <v-img
          :src="require('../assets/img/matse-plane-rotation-sketch.png')"
          height="125"
          alt="User workflow sketch.  Two hands grab a plane and move it towards a set of five atoms, one at each corner of a cube and the last at the center.  As the plane intersects the atoms, atoms above the plane become hidden."
        ></v-img>
      </v-col>
    </v-row>

    <h2 class="font-weight-bold">Future Educational VR Ecosystem Catalyzer.</h2>
    <v-row>
      <v-col :cols="12">
        <v-img
          :src="require('../assets/img/komodo-ecosystem-explanation.png')"></v-img>
        <br><p>
          <span class="font-weight-bold">In the future, Komodo will be an open-source sandbox</span> for the future of immersive instruction, WebXR accessibility, and cross-reality experiments. We believe our solution will supercharge higher education ecosystems for instructional VR. 
        </p>
        <p>
          We have chosen the Unity game engine because of the incredible projects produced by students of virtual reality courses here at the University of Illinois.  One such course is in the department of Computer Science, currently taught by Professor Dan Cermak and Professor Eric Shaffer.  In one semester, students learn the fundamentals of virtual reality and design and build an application.  Some use web tools, but many use Unity.  And multiplayer applications remain a challenge for both. 
        </p>
        <p>
          Current solutions allow developers to build VR experiences directly for the web, like with A-Frame, THREE.js, or BabylonJS, among others.  Or they let you build social VR experiences, like with the Normcore.io SDK, but only for non-web platforms.  We believe that by providing multiplayer networking on top of the Unity game engine and the WebXR exporter provided by Mozilla, our SDK will connect Unity developers to social WebXR.  So, we hope to pilot the SDK with students of the Virtual Reality computer science course here at Illinois in the near future.
        </p>
        <p>
          Research programmers and independent developers also would benefit from an easier workflow for creating social VR applications. We hope to lower the barrier to entry for them in the same way.
        </p> 
        <p>
          We also recognize that instructors want more than just a hosted app build — session management, realtime communication, data analytics will go a long way towards accessible and data-driven teaching.  So far, Komodo's portal serves these needs without becoming an entirely separate Learning Management System, though we are exploring potential integrations with them in the future.  
        </p>
        <p>
          We wouldn't be able to imagine this future of higher education XR instruction without the amazing work of instructors, researchers, librarians, and students here at the University of Illinois. And we're excited to partner with other institutions. 
        </p>
        <p>
          Contact us to express interest in Komodo, whether you're interested in using it for your classroom, developing a domain module for an instructor, shaping the future of the platform, or contributing to the core application repository when we open-source it in the future.  Email idealab@library.illinois.edu .
        </p>
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
              :height="90"></v-img>
            <br><a class="font-weight-bold" href="https://techservices.illinois.edu/">Technology Services</a> at the University of Illinois for its generous financial support
          </v-col>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/vr-at-illinois-logo.png')"
              :height="90"></v-img>
            <br>The <a class="font-weight-bold" href="https://vr.illinois.edu/">Virtual Reality at Illinois Committee</a> (VR @ IL) for coordinating the project and continuously providing support
          </v-col>
          <v-col :cols="4">
            <v-img 
              :src="require('../assets/img/idea-lab-logo-cropped.png')"
              alt="Grainger Idea Lab logo, with technological and data-centric icons and imagery."
              :height="90"></v-img>
            <br><a class="font-weight-bold" href="https://library.illinois.edu/enx">Grainger Engineering Library</a> for providing development support, outreach support, and generous financial support
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <h3>Thank you to these individuals for supporting or contributing to the project:</h3>
    <v-row>
      <v-col :cols="3">
        Yifan Bao
        <br>Elisandro Cabada
        <br>Xianzhuo (Patrick) Cao
        <br>Brandon Dang
      </v-col>
      <v-col :cols="3">
        Mihir Joshi
        <br>Welisa Lewis
        <br>Zhe Liu
        <br>Nishi Mehta
      </v-col>
      <v-col :cols="3">
        William H. Mischo
        <br>Dennis Piehl
        <br>Dr. Andre Schleife
        <br>David Tamayo
      </v-col>
      <v-col :cols="3">
        Professor Chiara Vincenzi
        <br>Robert Wallace
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
  name: "About",
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