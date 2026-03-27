export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { fileName, content } = req.body;
  
  const REPO_OWNER = "Cottoncandy"; 
  const REPO_NAME = "Audio-mp3"; 
  // ---------------------------------------

  const GITHUB_TOKEN = process.env.GH_TOKEN;

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Upload audio: ${fileName}`,
        content: content
      })
    });

    const data = await response.json();
    if (response.ok) {
      // คืนค่า Direct Link สำหรับเล่นเพลงทันที
      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${fileName}`;
      res.status(200).json({ url: rawUrl });
    } else {
      res.status(500).json({ error: data.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}

