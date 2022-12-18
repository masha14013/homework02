import {emailAdapter} from "../adapters/email-adapter";
import {UsersType} from "../repositories/db";

export const emailManager = {
    async sendPasswordRecoveryMessage(user: UsersType) {
        await emailAdapter.sendEmail(
                user.accountData.email,
                "Confirm email",
            `<a href="https://some-front.com/registration-confirmation/?code=${user.emailConfirmation.confirmationCode}">${user.emailConfirmation.confirmationCode}</a>`)
    }
}


