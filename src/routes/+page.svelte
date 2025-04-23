<script lang="ts">
  import "/src/app.css";
  import Modal from "$components/Modal.svelte";
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";
  import io, { Socket } from "socket.io-client";

  // ----------- Server ------------

  let socket: Socket;
  onMount(() => {
    socket = io("https://playninegame.onrender.com"); // Replace with your server URL
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Listen for events (e.g., player joining, player leaving)
    socket.on("player-joined", (data) => {
      console.log(`${data.name} joined the lobby.`);
    });

    socket.on("player-left", (socketId) => {
      console.log(`Player with socket ID ${socketId} left the lobby.`);
    });
  });

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });

  // ----------- Page Data ------------

  let playerName = "";
  onMount(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      playerName = storedName;
    }
  });

  let lobbyCode = "";

  let createLobby = () => {
    if (!playerName.trim()) {
      alert("Please enter your name before creating a lobby.");
      return;
    }

    localStorage.setItem("playerName", playerName);
    handleCreateLobby();
  };

  let joinLobby = () => {
    if (!playerName.trim()) {
      alert("Please enter your name before joining a lobby.");
      return;
    }

    localStorage.setItem("playerName", playerName);
    openJoinModal();
  };

  let showJoinModal = false;
  let openJoinModal = () => {
    showJoinModal = true;
  };
  let closeJoinModal = () => {
    showJoinModal = false;
  };

  async function handleCreateLobby() {
    const res = await fetch(
      "https://playninegame.onrender.com/api/game/create",
      {
        // Replace with your server URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName }),
      }
    );

    const data = await res.json();
    if (data.code) {
      // Emit join-lobby event for the player after creating the lobby
      socket.emit("join-lobby", { code: data.code, name: playerName });
      goto(`/game/${data.code}`);
    } else {
      alert("Could not create lobby.");
    }
  }

  async function handleJoinLobby() {
    const res = await fetch("https://playninegame.onrender.com/api/game/join", {
      // Replace with your server URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: lobbyCode }),
    });

    const data = await res.json();
    if (data.success) {
      // Emit join-lobby event for the player after successful lobby join
      socket.emit("join-lobby", {
        code: lobbyCode,
        name: playerName,
      });

      goto(`/game/${lobbyCode}`);
    } else {
      alert("Lobby not found.");
    }
  }
</script>

<div class="homepage">
  <h1>Play Nine</h1>

  <div class="form-row" id="playerNameRow">
    <label for="playerName">Player Name</label>
    <input
      id="playerName"
      type="text"
      placeholder="My Name"
      bind:value={playerName}
    />
  </div>

  <div class="buttons">
    <button on:click={createLobby} aria-label="Create a new lobby"
      >Create Lobby</button
    >
    <button on:click={joinLobby} aria-label="Join an existing lobby"
      >Join Lobby</button
    >
  </div>
</div>

<Modal title="Join a Lobby" show={showJoinModal} onClose={closeJoinModal}>
  <div class="form-row">
    <label for="lobbyCode">Lobby Code</label>
    <input
      id="lobbyCode"
      type="text"
      placeholder="123456"
      maxlength="6"
      bind:value={lobbyCode}
    />
  </div>

  <button class="submit" on:click={handleJoinLobby}>Join</button>
</Modal>

<footer>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/credits">Credits</a>
</footer>

<style>
  .homepage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to bottom right, #111, #222);
    color: #e0ffe0;
    font-family: "Segoe UI", sans-serif;
    text-align: center;
    padding: 2rem;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #90ee90;
  }

  #playerNameRow {
    margin-bottom: 1rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.1s;
  }

  button:hover {
    background-color: #43a047;
    transform: scale(1.05);
  }

  button.submit {
    margin-top: 1rem;
  }

  .form-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  label {
    width: 100px;
    font-weight: bold;
    flex-shrink: 0;
    text-align: left;
  }

  input {
    flex: 1;
    min-width: 0;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #222;
    color: #90ee90;
    text-align: center;
    padding: 1rem 0;
  }

  footer a {
    color: #90ee90;
    margin: 0 1rem;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.2s;
  }

  footer a:hover {
    color: #76c776;
  }
</style>
