<script setup>
import DefaultTheme from 'vitepress/theme'
import Notice from './components/Notice.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- 首页公告：注入到 hero 区块下方、features 之前 -->
    <template #home-hero-after>
      <Notice />
    </template>
  </Layout>
</template>
