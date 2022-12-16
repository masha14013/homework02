import {emailAdapter} from "../adapters/email-adapter";
import {UsersType} from "../repositories/db";

export const emailManager = {
    async sendPasswordRecoveryMessage(user: UsersType) {
        await emailAdapter.sendEmail(user.accountData.email, "subject", "message")
    }
}