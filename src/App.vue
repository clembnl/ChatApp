<template>
  <Nav />
  <Suspense>
    <template #default>
      <Chat />
    </template>
    <template #fallback>
      <span>Loading...</span>
   </template>
  </Suspense>
</template>

<script>
import Nav from '@/components/Nav.vue';
import Chat from '@/components/Chat.vue';

export default {
  name: 'App',
  components: {
    Nav,
    Chat,
  }
}
</script>

