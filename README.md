<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
\
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/krniya/FunTick">
    <img src="https://github.com/krniya/FunTick/blob/main/client/public/assets/images/logo.png?raw=true" alt="Logo" width="80" height="120">
  </a>

<h3 align="center">Funtick</h3>

  <p align="center">
    Funtick is a E-commerce site for general public to buy or sell tickets for any movies or consert
    <br />
    <a href="https://github.com/krniya/FunTick"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/krniya/FunTick/issues">Report Bug</a>
    ·
    <a href="https://github.com/krniya/FunTick/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <!-- <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li> -->
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <!-- <li><a href="#roadmap">Roadmap</a></li> -->
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)



<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- 

### Built With

* [![nodejs][nodejs]][React-url]
* [![Vue][Vue.js]][Vue-url]
* [![Angular][Angular.io]][Angular-url]
* [![Svelte][Svelte.dev]][Svelte-url]
* [![Laravel][Laravel.com]][Laravel-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>
 -->


<!-- GETTING STARTED -->
## Getting Started

This project demonstrates a ticket buying and selling service for general public implemented in microservices architecture using Node.js, Docker, Kubernetes, and NATS Streaming Services for event handling. We use Skaffold to manage the development workflow and Kubernetes Secrets for environment variables and an ingress is used to manage access to the services.


### Prerequisites

Before you begin, ensure you have met the following requirements:

* npm
  ```sh
  npm install npm@latest -g
  ```
- Node.js (>= 18.x)
- Docker
- Kubernetes (Minikube or any Kubernetes cluster)
- kubectl
- Skaffold
- Helm (for managing Kubernetes applications)
- NATS Streaming Server


### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/krniya/FunTick.git
   ```
2. Install NPM packages (if you wants to create your own docker images)
   ```sh
   npm install
   ```
  or use the .yaml available in /infra/k8s folder.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Skaffold Setup
Ensure Skaffold is installed and configured properly. You can check the Skaffold installation guide <a href="https://skaffold.dev/docs/install/">here.</a>

### Deploying the Microservices
Use Skaffold to build and deploy your services. Skaffold will use the configurations defined in skaffold.yaml.

```sh
skaffold dev
```
This command will:

1. Build Docker images for each microservice.
2. Apply Kubernetes manifests to deploy the services.
3. Stream logs from your running services.


To deploy without the continuous development mode:
```sh
skaffold run
```

<!-- USAGE EXAMPLES -->
## Usage

 Once all services are deployed and running, you can start interacting with your microservices. You can access your services through the ingress controller.

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Nitish Yadav - [@krniya_](https://twitter.com/krniya_) - krnitish@live.in

Project Link: [https://github.com/krniya/FunTick](https://github.com/krniya/FunTick)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS
## Acknowledgments

* []()
* []()
* []() -->

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/krniya/FunTick.svg?style=for-the-badge
[contributors-url]: https://github.com/krniya/FunTick/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/krniya/FunTick.svg?style=for-the-badge
[forks-url]: https://github.com/krniya/FunTick/network/members
[stars-shield]: https://img.shields.io/github/stars/krniya/FunTick.svg?style=for-the-badge
[stars-url]: https://github.com/krniya/FunTick/stargazers
[issues-shield]: https://img.shields.io/github/issues/krniya/FunTick.svg?style=for-the-badge
[issues-url]: https://github.com/krniya/FunTick/issues
[license-shield]: https://img.shields.io/github/license/krniya/FunTick.svg?style=for-the-badge
[license-url]: https://github.com/krniya/FunTick/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/krniya
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[nodejs]: https://img.shields.io/badge/niyanode?style=for-the-badge&logo=nodedotjs