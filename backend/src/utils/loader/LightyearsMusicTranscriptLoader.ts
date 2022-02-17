import path from "path";

import fs from "fs-extra";
import { getManager } from "typeorm";

import { initAppDatabaseConnection } from "../../database_connection";
import { Song } from "../../entity/Song";

export class LightyearsMusicTranscriptLoader {
  lyricsRoot!: string

  constructor(lyricsRoot: string) {
    this.lyricsRoot = lyricsRoot;
  }

  extractLyricsContent(rawLyrics: string) {
    let lines = rawLyrics.split("\n");
    lines = lines.map(line => line.trim());
    lines = lines.filter(line => line.indexOf("纯音乐，请欣赏") === -1);

    const titles = [
      "作曲",
      "编曲",
      "作词",
      "制作人",
      "钢琴",
      "吉他",
      "打击乐",
      "贝斯",
      "和声"
    ];
    for (const title of titles) {
      lines = lines.filter(line => line.match(RegExp(`^${title}\\s*[:：].+$`)) == null);
    }

    return lines.join("\n");
  }

  async load() {
    console.log("connecting...");
    const connection = await initAppDatabaseConnection();
    const manager = getManager();

    console.log("loading...");
    const files = fs.readdirSync(this.lyricsRoot);
    const tasks = [];
    for (const file of files) {
      const songId = Number(file.split(".").shift());
      const filepath = path.resolve(this.lyricsRoot, file);

      const task = fs.readFile(filepath, { encoding: "utf-8" }).then(async text => {
        const lyrics = this.extractLyricsContent(text);
        let song = await manager.findOne(Song, { where: { neteaseMusicId: String(songId) } });
        if (!song) {
          song = manager.create(Song);
          song.neteaseMusicId = String(songId);
          song.lyrics = lyrics;
          await manager.save(song);
        } else if (song.lyrics !== lyrics && lyrics !== "") {
          song.lyrics = lyrics;
          await manager.save(song);
        }
      });

      tasks.push(task);
    }

    await Promise.all(tasks);
    console.log("done.");

    await connection.close();
  }
}
