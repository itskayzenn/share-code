export default async function handler(req,res){
  const {password}=JSON.parse(req.body);

  if(password===process.env.ADMIN_PASSWORD){

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN_LOGIN}/sendMessage`,{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        chat_id:process.env.TELEGRAM_CHAT_ID,
        text:`Admin Login Success at ${new Date()}`
      })
    });

    res.json({success:true});
  }else{
    res.json({success:false});
  }
  }
