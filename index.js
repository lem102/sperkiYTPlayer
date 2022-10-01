import Mpv from "mpv";
import fetch from "node-fetch";

const mpv = Mpv({
  args: ["--ytdl-format=worstvideo+bestaudio"],
  options: {},
  path: "mpv",
});

mpv.on("end-file", () => {
  process.exit();
});

const searchYoutube = async (input) => {
  const youtubeUrl = "https://www.youtube.com/results?search_query=";
  const searchQuery = input.replace(" ", "+");
  const response = await fetch(youtubeUrl + searchQuery);
  const body = await response.text();

  const [videoId] = body.match(/\/watch\?v=.{0,11}/);
  return `https://www.youtube.com${videoId}`;
};

const main = async () => {
  const [, , ...args] = process.argv;
  const input = args.join(" ");
  const url = await searchYoutube(input);
  mpv.command("loadfile", url);
};

main();
