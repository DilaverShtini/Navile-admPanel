<script lang="ts" setup>

import "~/assets/css/mode.css"

/* Variablefor navigation */
const router = useRouter();

/* Variable for the choice of mode */
const modeOption = ref(['Modifica', 'Visualizza']);

const createOperation = async (item: string) => {
    try {
        if (item === 'Modifica') {
            router.push({ path: '/main-menu/' });
        } else {
            router.push({ path: '/visualization-page/' });
        }
    } catch (error) {
        console.error('Error: ', error);
    }
};

</script>

<template>
    <div class="modeContainer">
        <div class="modeTitle">Scegli la modalità</div>
        <div class="modeOperation">
            <button
                v-for="item, i in modeOption" :key="i"
                @click="createOperation(item)"
                class="modeChose" :class="item.toLowerCase()"
                >{{item}}</button>
        </div>
    </div>
</template>
