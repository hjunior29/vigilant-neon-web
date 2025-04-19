<script lang="ts">
	import Particles, { particlesInit } from "@tsparticles/svelte";
	import { loadSeaAnemonePreset } from "@tsparticles/preset-sea-anemone";
	import type { Engine } from "@tsparticles/engine";
	import { Button } from "carbon-components-svelte";
	import { goto } from "$app/navigation";
	import type { Notification } from "$lib/models/notification";
	import { onMount } from "svelte";
	import type { ApiResponse } from "$lib/models/apiResponse";
	import { apiRequest } from "$lib/api/utils";

	interface PingPong {
		message: string;
	}

	let apiPingSuccess: boolean = false;
	let notification: Notification = {};
	let timeout: any = undefined;

	const options = { preset: "seaAnemone" };
	void particlesInit(async (engine: Engine) => {
		await loadSeaAnemonePreset(engine);
	});

	onMount(() => {
		apiWakeUp();
	});

	async function apiWakeUp() {
		const start = Date.now();
		apiPingSuccess = false;
		let attempts = 0;

		while (!apiPingSuccess) {
			attempts++;
			const response = await apiRequest<ApiResponse<PingPong>>(
				"ping",
				"GET",
			);

			if (response.status === 200) {
				apiPingSuccess = true;
				const end = Date.now();
				const duration = Math.round((end - start) / 1000);
				const message = `The API took ${duration} seconds to respond after ${attempts} attempt(s).`;

				notification = {
					kind: "success",
					title: "Success",
					subtitle: message,
					caption: new Date().toLocaleString(),
					timeout: 3_000,
				};
			} else {
				const message = `Attempt ${attempts} failed. Retrying in 10 seconds...\n${response.message}`;

				notification = {
					kind: "error",
					title: "Error",
					subtitle: message,
					caption: new Date().toLocaleString(),
					timeout: 3_000,
				};

				await new Promise((resolve) => setTimeout(resolve, 10_000));
			}

			if (!apiPingSuccess) {
				await new Promise((resolve) => setTimeout(resolve, 5_000));
			}
		}
	}
</script>

<Particles {options} />

<div class="content flex min-h-screen justify-center items-center">
	<div class="hero w-1/2 h-1/2 backdrop-blur-md rounded-2xl">
		<h1 class="title">Vigilant Neon</h1>
		<p class="subtitle">
			Real‑time Pub/Sub topic management with REST & WebSocket powered by
			Bun + TypeScript + Svelte.
		</p>
		<div class="tech">
			<img
				src="https://cdn.simpleicons.org/typescript/3178c6"
				alt="TypeScript"
			/>
			<img
				src="https://icon.icepanel.io/Technology/svg/Svelte.svg"
				alt="Svelte"
			/>
			<img
				src="https://icon.icepanel.io/Technology/svg/Bun.svg"
				alt="Bun"
			/>
			<img
				src="https://raw.githubusercontent.com/Marfusios/websocket-client/master/websocket-logo.png"
				alt="WebSocket"
			/>
		</div>
		<div>
			<Button
				on:click={() => {
					goto("/login");
				}}
			>
				Enter
			</Button>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
	}
	.content {
		position: relative;
		z-index: 1;
	}
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		text-align: center;
		padding: 2rem;
	}
	.title {
		font-size: clamp(2.5rem, 6vw, 5rem);
		font-weight: 700;
		line-height: 1.1;
		background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%);
		background-size: 200% 200%;
		background-position: 0% 50%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: shine 4s linear infinite;
	}
	@keyframes shine {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 200% 50%;
		}
	}
	.tech {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin: 2rem 0;
	}
	.tech img {
		height: 40px;
	}
</style>
