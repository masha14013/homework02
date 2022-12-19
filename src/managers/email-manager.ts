import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendPasswordRecoveryMessage(email: string, subject: string, code: string) {
        await emailAdapter.sendEmail(
                email,
            subject,
            `<a href="https://some-front.com/registration-confirmation?code=${code}">${code}</a>`)
    }
}



