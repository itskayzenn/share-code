export default async function handler(req,res){
  const {nama,url,deskripsi}=JSON.parse(req.body);
  const waktu = new Date().toLocaleString();

  const text = `
Request Scrape & Feature Bot WhatsApp/Telegram
Nama: ${nama}
URL: ${url}
Deskripsi: ${deskripsi}
Waktu: ${waktu}
`;

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN_REQUEST}/sendMessage`,{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      chat_id:process.env.TELEGRAM_CHAT_ID,
      text
    })
  });

  res.json({success:true});
}
