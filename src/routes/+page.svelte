<script lang="ts">
    import {
        Button,
        Content,
        Tile,
        Accordion,
        AccordionItem,
    } from "carbon-components-svelte";
    import { goto } from "$app/navigation";

    function handleLogin() {
        goto("/login");
    }
</script>

<div class="!flex !items-center !justify-center !mt-20">
    <Button kind="primary" on:click={handleLogin}>Login</Button>
</div>
