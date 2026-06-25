const express = require("express");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();

app.use(express.static("public"));

app.get("/download", async (req, res) => {
    try {
        const videoURL = req.query.url;

        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send("Invalid URL");
        }

        const info = await ytdl.getInfo(videoURL);

        const title = info.videoDetails.title
            .replace(/[<>:"/\\|?*]+/g, "_");

        res.header(
            "Content-Disposition",
            `attachment; filename="${title}.mp4"`
        );

        ytdl(videoURL, {
            quality: "highest"
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send("Download failed");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});