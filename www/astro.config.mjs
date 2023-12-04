import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'Sveltekit-Rest',
    customCss:['./src/tailwind.css'],
    social: {
      github: 'https://github.com/anasmohammed361/sveltekit-rest',
    },
    sidebar: [{
      label: 'Getting Started',
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Quick Start',
        link: '/getting-started/quick-start/'
      },
      {
        label: 'Input Validation',
        link: '/getting-started/input-validation/'
      },
      {
        label: 'Routing',
        link: '/getting-started/routing-basics/'
      }
    ]
    }, 
    {
      label:"Configuration",
      autogenerate:{
        directory:"config"
      }
    }
  
  
  ]
  }), tailwind({
    applyBaseStyles:false
  })]
});