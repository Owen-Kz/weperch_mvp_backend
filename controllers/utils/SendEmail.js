const sgMail = require("@sendgrid/mail");

function SendEmail(email,fullname, subject, message){
 
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: {
            email: email,
            name: fullname  // Add receiver's name here
          },
          from: {
            email: "support@asfischolar.org",
            name: "Weperch"  // Optionally, you can also add sender's name
          },
      subject: `${subject}`,
      html: `${message}`
    }  
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent for Weperch')
            //  res.status(200).json({ message: 'Reset token sent to your email' });
          // res.render("confirmCode", {message:"Code has been Sent to your email", email:email})
      })
      .catch((error) => {
        console.error(error)
      }) 
} 

module.exports =  SendEmail