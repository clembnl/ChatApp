<template>
  <div class="container-sm mt-20">
    <div class="mx-5">
        <Message
            v-for="{ id, text, userPhotoURL, userName, userId } in messages"
            :key="id"
            :name="userName"
            :photo-url="userPhotoURL"
            :sender="userId === user?.uid"
        >
            {{ text }}
        </Message>
    </div>
  </div>

  <div ref="bottom" class="mt-20" />

  <div class="bottom">
    <div class="container-sm">
        <form v-if="isLogin" @submit.prevent="send">
            <input v-model="message" placeholder="Message" required />
            <button type="submit">
                <SendIcon />
            </button>
        </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import { useAuth, useChat } from '@/firebase';

import SendIcon from './SendIcon.vue';
import Message from './Message.vue';

export default {
    components: {SendIcon, Message},
    async setup() {
        const { messages, sendMessage } = await useChat();

        const bottom = ref(null);
        const stopHandle = watch(
            messages,
            () => {
                nextTick(() => {
                    bottom.value?.scrollIntoView({ behaviour: 'smooth' });
                })
            },
            { deep: true }
        );

        stopHandle();

        const message = ref('');
        const send = () => {
            sendMessage(message.value);
            message.value = '';
        };

        const { user, isLogin } = useAuth();

        return { user, isLogin, messages, bottom, message, send };
    },
}

</script>