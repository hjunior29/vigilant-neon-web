<script lang="ts">
    import { Content, Header } from "carbon-components-svelte";
    import "../app.css";
    import "carbon-components-svelte/css/g100.css";
</script>

<Header company="Vigilant" platformName="Neon" href="/" />
<Content>
    <slot />
</Content>
