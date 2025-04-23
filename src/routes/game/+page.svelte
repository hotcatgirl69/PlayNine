<script lang="ts">
  import "/src/app.css";
  import { onMount } from "svelte";

  let playerName: string,
    lobbyName: string,
    numPlayers: number,
    lobbyVisibility: string,
    lobbyPasscode: string;

  let lobbyInfo = "";

  onMount(() => {
    playerName = sessionStorage.getItem("playerName") ?? "";
    lobbyName = sessionStorage.getItem("lobbyName") ?? "";
    numPlayers = Number(sessionStorage.getItem("numPlayers") ?? 2);
    lobbyVisibility = sessionStorage.getItem("lobbyVisibility") ?? "public";
    lobbyPasscode = sessionStorage.getItem("lobbyPasscode") ?? "";

    if (lobbyVisibility === "public") {
      lobbyInfo = `Room: ${lobbyName}`;
    } else {
      lobbyInfo = `Room: ${lobbyName} | Passcode: ${lobbyPasscode}`;
    }
  });

  let scoreboard = Array(9)
    .fill(0)
    .map((_, i) => ({
      name: i === 0 ? playerName : `Player ${i + 1}`,
      score: 0,
    }));

  function copy() {
    navigator.clipboard
      .writeText(lobbyInfo)
      .then(() => {
        console.log("Copied to clipboard:", lobbyInfo);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  }
</script>

<header>
  <h1>Play Nine</h1>
  <p>{lobbyVisibility}</p>
  <button on:click={copy}>{lobbyInfo}</button>
</header>

<canvas> </canvas>

<div class="scoreboard">
  <h2>Scoreboard</h2>
  <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {#each scoreboard as player}
        <tr>
          <td>{player.name}</td>
          <td>{player.score}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<footer>
  <p>© 2023 Envy</p>
</footer>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #282c34;
    color: white;
  }

  h1 {
    margin: 0;
  }

  button {
    background-color: #61dafb;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  canvas {
    display: block;
    margin: 2rem auto;
    border: 2px solid #ccc;
    background: white;
  }

  .scoreboard {
    margin: 2rem auto;
    max-width: 300px;
    text-align: center;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #aaa;
    padding: 0.5rem;
  }

  th {
    background-color: #f0f0f0;
  }

  footer {
    text-align: center;
    padding: 1rem;
    background-color: #282c34;
    color: white;
  }
</style>
