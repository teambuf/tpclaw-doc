import DefaultTheme from 'vitepress/theme'
import { inject } from '@vercel/analytics'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp() {
    inject()
  }
}
