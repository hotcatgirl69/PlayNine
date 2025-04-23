<script>
  import "/src/app.css";
  import Modal from "$components/Modal.svelte";
  import { goto } from "$app/navigation";

  let showCreateModal = false;
  let showJoinModal = false;
  let openJoinModal = () => {
    showJoinModal = true;
  };
  let closeJoinModal = () => {
    showJoinModal = false;
  };

  let openCreateModal = () => {
    showCreateModal = true;
  };
  let closeCreateModal = () => {
    showCreateModal = false;
  };

  let playerName = "";
  let lobbyName = "";
  let numPlayers = 2;
  let lobbyVisibility = "public";
  let lobbyPasscode = "";

  function handleCreateLobby() {
    console.log("Creating lobby with:", {
      playerName,
      lobbyName,
      numPlayers,
      lobbyVisibility,
      lobbyPasscode,
    });

    sessionStorage.setItem("playerName", playerName);
    sessionStorage.setItem("lobbyName", lobbyName);
    sessionStorage.setItem("numPlayers", numPlayers.toString());
    sessionStorage.setItem("lobbyVisibility", lobbyVisibility);
    sessionStorage.setItem("lobbyPasscode", lobbyPasscode);

    goto("/game");
  }

  function handleJoinLobby() {
    console.log("Creating lobby with:", {
      playerName,
      lobbyName,
      numPlayers,
      lobbyVisibility,
      lobbyPasscode,
    });

    sessionStorage.setItem("playerName", playerName);
    sessionStorage.setItem("lobbyName", lobbyName);
    sessionStorage.setItem("numPlayers", numPlayers.toString());
    sessionStorage.setItem("lobbyVisibility", lobbyVisibility);
    sessionStorage.setItem("lobbyPasscode", lobbyPasscode);

    goto("/game");
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
    <button on:click={openCreateModal} aria-label="Create a new lobby"
      >Create Lobby</button
    >
    <button on:click={openJoinModal} aria-label="Join an existing lobby"
      >Join Lobby</button
    >
  </div>
</div>

<!-- Modal for creating a lobby -->
<Modal title="Create a Lobby" show={showCreateModal} onClose={closeCreateModal}>
  <div class="form-row">
    <label for="lobbyName">Lobby Name</label>
    <input
      id="lobbyName"
      type="text"
      placeholder="My Lobby Name"
      bind:value={lobbyName}
    />
  </div>

  <div class="form-row">
    <label for="numPlayers">Num Players</label>
    <input
      id="numPlayers"
      type="number"
      placeholder="2"
      min="2"
      max="8"
      bind:value={numPlayers}
    />
  </div>

  <div class="form-row">
    <div class="radio-options">
      <div class="radio-pair">
        <label for="visibility-public">Public</label>
        <input
          type="radio"
          id="visibility-public"
          name="visibility"
          value="public"
          bind:group={lobbyVisibility}
        />
      </div>
      <div class="radio-pair">
        <label for="visibility-private">Private</label>
        <input
          type="radio"
          id="visibility-private"
          name="visibility"
          value="private"
          bind:group={lobbyVisibility}
        />
      </div>
    </div>
  </div>

  {#if lobbyVisibility === "private"}
    <div class="form-row">
      <label for="lobbyPasscode">Lobby Passcode</label>
      <input
        id="lobbyPasscode"
        type="text"
        placeholder="My Lobby Passcode"
        bind:value={lobbyPasscode}
      />
    </div>
  {/if}

  <button class="submit" on:click={handleCreateLobby}>Create</button>
</Modal>

<!-- Modal for joining a lobby -->
<Modal title="Join a Lobby" show={showJoinModal} onClose={closeJoinModal}>
  <div class="form-row">
    <label for="lobbyName">Lobby Name</label>
    <input
      id="lobbyName"
      type="text"
      placeholder="Lobby Name"
      bind:value={lobbyName}
    />
  </div>

  <div class="form-row">
    <label for="lobbyCode">Lobby Code</label>
    <input
      id="lobbyCode"
      type="text"
      placeholder="Lobby Code"
      bind:value={lobbyPasscode}
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

  input[type="text"],
  input[type="number"] {
    flex: 1;
    min-width: 0;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  /* input[type="radio"] {
    TODO: style radio buttons
  } */

  .radio-options {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .radio-pair {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .radio-options label {
    width: auto;
    font-weight: normal;
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
