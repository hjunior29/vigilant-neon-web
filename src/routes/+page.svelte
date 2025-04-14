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

<Content
    class="bx--grid"
    style="min-height: 100vh; display: flex; align-items: center; justify-content: center;"
>
    <div class="bx--row">
        <div class="bx--col-lg-12">
            <Tile
                class="bx--tile--expandable"
                style="padding: 2rem; background-color: #262626; color: #f4f4f4;"
            >
                <h1
                    class="bx--type-expressive-heading-03"
                    style="margin-bottom: 1rem;"
                >
                    Vigilant Neon
                </h1>
                <p class="bx--type-body-long-01" style="margin-bottom: 2rem;">
                    A monitoring interface for your internal Pub/Sub
                    architecture. Lightweight. Functional. Intentional.
                </p>

                <Accordion size="xl">
                    <AccordionItem title="What is Pub/Sub?">
                        <p>
                            Publish/Subscribe is an asynchronous messaging
                            architecture that decouples the sender (publisher)
                            from the receiver (subscriber). Publishers emit
                            messages to a topic without knowing who will consume
                            them. Subscribers express interest in topics and
                            receive relevant messages as they are published.
                        </p>
                    </AccordionItem>

                    <AccordionItem title="Why use a Pub/Sub architecture?">
                        <p>
                            This architecture allows for more scalable and
                            maintainable systems. Services communicate
                            indirectly, which improves modularity and enables
                            real-time processing in distributed applications.
                        </p>
                    </AccordionItem>

                    <AccordionItem title="What is Vigilant Neon?">
                        <p>
                            Vigilant Neon is a lightweight observability layer
                            for your Pub/Sub system. It allows you to view
                            active topics, track publishers and subscribers, and
                            inspect message traffic — all from a centralized
                            interface.
                        </p>
                    </AccordionItem>

                    <AccordionItem title="Is this a production tool?">
                        <p>
                            Not exactly. Vigilant Neon is a developer-facing
                            utility. It doesn’t replace your infrastructure, it
                            helps you observe it. Use it to test integrations,
                            debug workflows, or simply monitor activity in real
                            time.
                        </p>
                    </AccordionItem>
                </Accordion>

                <div style="margin-top: 2rem; text-align: center;">
                    <Button kind="primary" on:click={handleLogin}>
                        Login to Dashboard
                    </Button>
                </div>
            </Tile>
        </div>
    </div>
</Content>
