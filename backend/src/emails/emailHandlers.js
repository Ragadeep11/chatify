import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js ";

export const sendWelcomeEmail = async (email, Name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name}< ${sender.email}>`,
        to: email,
        subject: "welcome to chatify!",
        html: createWelcomeEmailTemplate(Name, clientURL)
    });
    if (error) {
        console.error("Error sending welcome emails", error);
        throw new Error("Failed to send Emails");
    }
    console.log("welcome email sent successfully", data);
};
