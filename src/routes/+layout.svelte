<script lang="ts">
    import { Content, Header } from "carbon-components-svelte";
    import "../app.css";
    import "carbon-components-svelte/css/g100.css";
    import { page } from "$app/stores";
    import { browser } from "$app/environment";

    let title = "";

    $: path = $page.url.pathname;
    $: if (browser) {
        switch (true) {
            case path === "/":
                title = "Vigilant 🥷";
                break;
            case path === "/login":
                title = "Login | Vigilant 🥷";
                break;
            case path === "/pubsub":
                title = "Pub/Sub | Vigilant 🥷";
                break;
            case path.startsWith("/shared/"):
                title = "Shared | Vigilant 🥷";
                break;
            default:
                title = "404 | Vigilant 🥷";
        }
    }
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<Header company="Vigilant" platformName="Neon" href="/" />

<slot />
