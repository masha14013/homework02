import {emailAdapter} from "../adapters/email-adapter";
import {UsersType} from "../repositories/db";

export const emailManager = {
    async sendPasswordRecoveryMessage(email: string, subject: string, code: string) {
        await emailAdapter.sendEmail(
                email,
            subject,
            `<a href="https://some-front.com/registration-confirmation?code=${code}">${code}</a>`)
    }
}



