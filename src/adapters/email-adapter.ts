import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tyyyuuiop5555@gmail.com", // generated ethereal user
                pass: "hctyqdtrdyvvqvqp", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transport.sendMail({
            from: '"Test letter" <tyyyuuiop5555@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        });
        return info
    }
}