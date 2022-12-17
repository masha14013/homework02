import {emailAdapter} from "../adapters/email-adapter";
import {UsersType} from "../repositories/db";

export const emailManager = {
    async sendPasswordRecoveryMessage(user: UsersType) {
        await emailAdapter.sendEmail(
                user.accountData.email,
                "Confirm email",
                `<div><a href="https://some-front.com/confirm-registration?code=${user.emailConfirmation.confirmationCode}">Confirm email, click here</a></div>`)
    }
}