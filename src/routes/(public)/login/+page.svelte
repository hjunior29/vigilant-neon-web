<script lang="ts">
    import { goto } from "$app/navigation";
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Auth } from "$lib/models/auth";
    import type { Notification } from "$lib/models/notification";
    import {
        Button,
        TextInput,
        Tile,
        ToastNotification,
    } from "carbon-components-svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    let auth: Auth = {};
    let notification: Notification = {};
    let timeout: any = undefined;

    onMount(() => {
        if (typeof localStorage !== "undefined") {
            const stored = localStorage.getItem("authentication");
            if (stored) {
                const creds = JSON.parse(stored);
                auth.username = creds.username;
                auth.password = creds.password;
            }
        }
    });

    async function login() {
        if (!auth.username || !auth.password) {
            return;
        }

        const response = await apiRequest<ApiResponse<{ token: string }>>(
            "auth/login",
            "POST",
            auth,
        );

        if (response.status === 200) {
            localStorage.setItem("token", response.data?.token || "");
            goto("/pubsub");
        } else {
            console.log(response);
            notification = {
                kind: "error",
                title: "Error",
                subtitle: response.message,
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };
        }
    }
</script>

<div class="flex items-center justify-center !mt-20">
    <Tile class="w-96">
        <div class="flex flex-col gap-4">
            <TextInput
                invalid={auth.username === undefined}
                invalidText="Username is required."
                labelText="Username"
                placeholder="Enter your username..."
                bind:value={auth.username}
            />
            <TextInput
                invalid={auth.password === undefined}
                invalidText="Password is required."
                labelText="Password"
                placeholder="Enter your password..."
                type="password"
                bind:value={auth.password}
            />
            <Button on:click={login}>Login</Button>
        </div>
    </Tile>
</div>

{#if notification.kind}
    <div
        class="fixed bottom-4 right-4 w-96 transition-opacity duration-300"
        transition:fade
    >
        <ToastNotification
            timeout={notification.timeout}
            kind={notification.kind}
            title={notification.title}
            subtitle={notification.subtitle}
            caption={notification.caption}
            on:close={(e) => {
                timeout = undefined;
                notification = {};
            }}
        />
    </div>
{/if}
